import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Eye, MessageCircle, Calendar } from 'lucide-react';
import { usePostsByAuthor } from '../hooks/useBlogPosts';
import { BlogPostList } from '../components/blog/BlogPostList';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils';

const AuthorDetailPage: React.FC = () => {
  const { author } = useParams<{ author: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  
  const decodedAuthor = decodeURIComponent(author || '');
  const { data: posts, isLoading, error } = usePostsByAuthor(decodedAuthor, currentPage, 12);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate author statistics
  const authorStats = posts ? {
    totalPosts: posts.totalElements,
    totalViews: posts.content.reduce((acc, post) => acc + post.viewCount, 0),
    totalComments: posts.content.reduce((acc, post) => acc + post.commentCount, 0),
    firstPostDate: posts.content.length > 0 
      ? posts.content.reduce((earliest, post) => 
          new Date(post.createdAt) < new Date(earliest.createdAt) ? post : earliest
        ).createdAt
      : null,
    latestPostDate: posts.content.length > 0
      ? posts.content.reduce((latest, post) => 
          new Date(post.createdAt) > new Date(latest.createdAt) ? post : latest
        ).createdAt
      : null,
  } : null;

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Author Not Found
            </h1>
            <p className="text-secondary mb-6">
              The author you're looking for doesn't exist.
            </p>
            <Link to="/authors">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Back to Authors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/authors">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Authors
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Author Header */}
            <Card className="mb-8">
              <CardBody>
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {decodedAuthor.charAt(0).toUpperCase()}
                  </div>

                  {/* Author Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      {decodedAuthor}
                    </h1>
                    <p className="text-secondary text-lg mb-4">
                      Contributing Author
                    </p>
                    
                    {authorStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {authorStats.totalPosts}
                          </div>
                          <div className="text-sm text-secondary">Posts</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {authorStats.totalViews.toLocaleString()}
                          </div>
                          <div className="text-sm text-secondary">Total Views</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {authorStats.totalComments}
                          </div>
                          <div className="text-sm text-secondary">Comments</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-primary">
                            {authorStats.firstPostDate 
                              ? Math.round((Date.now() - new Date(authorStats.firstPostDate).getTime()) / (1000 * 60 * 60 * 24))
                              : 0
                            }
                          </div>
                          <div className="text-sm text-secondary">Days Active</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Posts by {decodedAuthor}
              </h2>
              
              <BlogPostList
                posts={posts}
                loading={isLoading}
                error={error?.message}
                onPageChange={handlePageChange}
                emptyMessage={`${decodedAuthor} hasn't published any posts yet.`}
                gridCols={1}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Stats */}
              {authorStats && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Author Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-500" />
                        <div>
                          <div className="font-medium">{authorStats.totalPosts} Posts</div>
                          <div className="text-sm text-secondary">Published articles</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Eye size={16} className="text-green-500" />
                        <div>
                          <div className="font-medium">{authorStats.totalViews.toLocaleString()} Views</div>
                          <div className="text-sm text-secondary">Total post views</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MessageCircle size={16} className="text-purple-500" />
                        <div>
                          <div className="font-medium">{authorStats.totalComments} Comments</div>
                          <div className="text-sm text-secondary">Reader engagement</div>
                        </div>
                      </div>
                      
                      {authorStats.firstPostDate && (
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-orange-500" />
                          <div>
                            <div className="font-medium">Member since</div>
                            <div className="text-sm text-secondary">
                              {formatDate(authorStats.firstPostDate)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Latest Activity */}
              {posts && posts.content.length > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Latest Activity</h3>
                    <div className="space-y-3">
                      {posts.content.slice(0, 3).map((post) => (
                        <div key={post.id} className="border-l-2 border-blue-200 pl-3">
                          <Link
                            to={`/posts/${post.slug || post.id}`}
                            className="block hover:text-primary transition-colors"
                          >
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <div className="text-xs text-muted">
                              {formatDate(post.createdAt)} • {post.viewCount} views
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                    
                    {posts.totalElements > 3 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-secondary">
                          and {posts.totalElements - 3} more posts...
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Engagement Metrics */}
              {authorStats && authorStats.totalPosts > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Engagement Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary">Avg. views per post</span>
                        <span className="font-medium">
                          {Math.round(authorStats.totalViews / authorStats.totalPosts).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary">Avg. comments per post</span>
                        <span className="font-medium">
                          {(authorStats.totalComments / authorStats.totalPosts).toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary">Engagement rate</span>
                        <span className="font-medium">
                          {authorStats.totalViews > 0 
                            ? ((authorStats.totalComments / authorStats.totalViews) * 100).toFixed(2)
                            : 0
                          }%
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardBody>
                  <h3 className="font-semibold text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/create" className="block">
                      <Button size="sm" className="w-full">
                        Write Your Own Post
                      </Button>
                    </Link>
                    <Link to="/authors" className="block">
                      <Button variant="secondary" size="sm" className="w-full">
                        Browse All Authors
                      </Button>
                    </Link>
                    <Link to="/posts" className="block">
                      <Button variant="secondary" size="sm" className="w-full">
                        View All Posts
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetailPage;