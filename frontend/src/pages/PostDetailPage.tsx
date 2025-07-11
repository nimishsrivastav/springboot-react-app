import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, MessageCircle, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useBlogPostBySlug, useComments, useCreateComment } from '../hooks/useBlogPosts';
import { CreateCommentRequest } from '../types';
import { formatDate, formatRelativeTime } from '../utils';
import { StatusBadge, Tag } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import { CommentList } from '../components/blog/CommentList';
import { CommentForm } from '../components/blog/CommentForm';

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentCommentPage, setCurrentCommentPage] = useState(0);
  
  const { data: post, isLoading: postLoading, error: postError } = useBlogPostBySlug(slug!);
  const { data: comments, isLoading: commentsLoading } = useComments(
    post?.id || 0, 
    currentCommentPage, 
    10
  );
  const createCommentMutation = useCreateComment();

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading post..." />
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Post Not Found
            </h1>
            <p className="text-secondary mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/posts')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Posts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateComment = async (commentData: CreateCommentRequest) => {
    await createCommentMutation.mutateAsync({
      postId: post.id,
      comment: commentData,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary || 'Check out this blog post',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-lg shadow-sm p-8">
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-primary mb-4 leading-tight">
                      {post.title}
                    </h1>
                    
                    {post.summary && (
                      <p className="text-lg text-secondary mb-6">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  
                  <StatusBadge status={post.status} />
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <Link 
                      to={`/authors/${encodeURIComponent(post.author)}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.author}
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <time>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </time>
                  </div>
                  
                  {post.viewCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      {post.viewCount.toLocaleString()} views
                    </div>
                  )}
                  
                  {post.commentCount > 0 && (
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      {post.commentCount} comments
                    </div>
                  )}
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-primary mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`}>
                        <Tag className="hover:opacity-80 transition-opacity">
                          {tag}
                        </Tag>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Comments Section */}
            <div className="mt-8 space-y-8">
              <CommentForm
                onSubmit={handleCreateComment}
                loading={createCommentMutation.isPending}
              />
              
              <CommentList
                comments={comments}
                loading={commentsLoading}
                onPageChange={setCurrentCommentPage}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">About the Author</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary">{post.author}</h4>
                    <p className="text-sm text-muted">Author</p>
                  </div>
                </div>
                <Link to={`/authors/${encodeURIComponent(post.author)}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View All Posts
                  </Button>
                </Link>
              </div>

              {/* Post Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">Post Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Views</span>
                    <span className="font-medium">{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Comments</span>
                    <span className="font-medium">{post.commentCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Published</span>
                    <span className="font-medium text-sm">
                      {formatRelativeTime(post.publishedAt || post.createdAt)}
                    </span>
                  </div>
                  {post.updatedAt !== post.createdAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Updated</span>
                      <span className="font-medium text-sm">
                        {formatRelativeTime(post.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={handleShare}
                  >
                    <Share2 size={16} className="mr-2" />
                    Share Post
                  </Button>
                  <Link to="/create" className="block">
                    <Button size="sm" className="w-full">
                      Write Your Own Post
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;