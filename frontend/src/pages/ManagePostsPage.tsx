import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Archive, 
  Send,
  Filter,
  Search,
  Calendar,
  User,
  MessageCircle
} from 'lucide-react';
import { 
  useBlogPosts, 
  useDeletePost, 
  usePublishPost, 
  useArchivePost 
} from '../hooks/useBlogPosts';
import { PostStatus } from '../types';
import { formatDate, formatRelativeTime } from '../utils';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import Loading from '../components/ui/Loading';
import Pagination from '../components/ui/Pagination';

const ManagePostsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const { data: posts, isLoading, error } = useBlogPosts(
    currentPage, 
    10, 
    sortBy, 
    sortDir
  );

  const deletePostMutation = useDeletePost();
  const publishPostMutation = usePublishPost();
  const archivePostMutation = useArchivePost();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (postId: number, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        await deletePostMutation.mutateAsync(postId);
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handlePublishPost = async (postId: number) => {
    try {
      await publishPostMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post. Please try again.');
    }
  };

  const handleArchivePost = async (postId: number) => {
    try {
      await archivePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Failed to archive post:', error);
      alert('Failed to archive post. Please try again.');
    }
  };

  // Filter posts based on search and filters
  const filteredPosts = React.useMemo(() => {
    if (!posts?.content) return [];

    return posts.content.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
      
      const matchesAuthor = !authorFilter || 
        post.author.toLowerCase().includes(authorFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesAuthor;
    });
  }, [posts, searchQuery, statusFilter, authorFilter]);

  // Get unique authors for filter
  const authors = React.useMemo(() => {
    if (!posts?.content) return [];
    return Array.from(new Set(posts.content.map(post => post.author))).sort();
  }, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading posts..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Error Loading Posts</h1>
            <p className="text-secondary">Unable to load posts. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Manage Posts</h1>
              <p className="text-secondary">Edit, publish, and organize your blog content.</p>
            </div>
          </div>
          
          <Link to="/create">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Post
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardBody>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search posts, authors, content..."
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'ALL')}
                  className="input"
                >
                  <option value="ALL">All Status</option>
                  <option value={PostStatus.PUBLISHED}>Published</option>
                  <option value={PostStatus.DRAFT}>Draft</option>
                  <option value={PostStatus.ARCHIVED}>Archived</option>
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="input"
                >
                  <option value="">All Authors</option>
                  {authors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDir(direction as 'asc' | 'desc');
                  }}
                  className="input"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="viewCount-desc">Most Views</option>
                  <option value="author-asc">Author A-Z</option>
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchQuery || statusFilter !== 'ALL' || authorFilter) && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Filter size={14} className="text-muted" />
                <span className="text-muted">
                  Showing {filteredPosts.length} of {posts?.totalElements || 0} posts
                </span>
                {searchQuery && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    Search: "{searchQuery}"
                  </span>
                )}
                {statusFilter !== 'ALL' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Status: {statusFilter}
                  </span>
                )}
                {authorFilter && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    Author: {authorFilter}
                  </span>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No posts found
              </h3>
              <p className="text-secondary mb-6">
                {searchQuery || statusFilter !== 'ALL' || authorFilter
                  ? 'No posts match your current filters. Try adjusting your search criteria.'
                  : 'You haven\'t created any posts yet.'
                }
              </p>
              {!searchQuery && statusFilter === 'ALL' && !authorFilter && (
                <Link to="/create">
                  <Button>Create Your First Post</Button>
                </Link>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <Card key={post.id} hover>
                <CardBody>
                  <div className="flex items-start gap-4">
                    {/* Post Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Link
                            to={`/posts/${post.slug || post.id}`}
                            className="text-lg font-semibold text-primary hover:text-primary-dark transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-1 text-sm text-secondary">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              {post.viewCount.toLocaleString()} views
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              {post.commentCount} comments
                            </div>
                          </div>
                        </div>
                        <StatusBadge status={post.status} />
                      </div>

                      {/* Summary or Content Preview */}
                      {post.summary ? (
                        <p className="text-secondary text-sm line-clamp-2 mb-3">
                          {post.summary}
                        </p>
                      ) : (
                        <p className="text-secondary text-sm line-clamp-2 mb-3">
                          {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="text-xs text-muted">
                        Created {formatRelativeTime(post.createdAt)}
                        {post.updatedAt !== post.createdAt && (
                          <> • Updated {formatRelativeTime(post.updatedAt)}</>
                        )}
                        {post.publishedAt && (
                          <> • Published {formatRelativeTime(post.publishedAt)}</>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {/* View Post */}
                      <Link to={`/posts/${post.slug || post.id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </Button>
                      </Link>

                      {/* Edit Post */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full flex items-center gap-1"
                        onClick={() => {
                          // In a real app, you'd navigate to an edit page
                          alert('Edit functionality would be implemented here. You would navigate to an edit form with the post data pre-populated.');
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </Button>

                      {/* Status Actions */}
                      {post.status === PostStatus.DRAFT && (
                        <Button
                          size="sm"
                          className="w-full flex items-center gap-1"
                          onClick={() => handlePublishPost(post.id)}
                          loading={publishPostMutation.isPending}
                        >
                          <Send size={14} />
                          Publish
                        </Button>
                      )}

                      {post.status === PostStatus.PUBLISHED && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full flex items-center gap-1"
                          onClick={() => handleArchivePost(post.id)}
                          loading={archivePostMutation.isPending}
                        >
                          <Archive size={14} />
                          Archive
                        </Button>
                      )}

                      {post.status === PostStatus.ARCHIVED && (
                        <Button
                          size="sm"
                          className="w-full flex items-center gap-1"
                          onClick={() => handlePublishPost(post.id)}
                          loading={publishPostMutation.isPending}
                        >
                          <Send size={14} />
                          Republish
                        </Button>
                      )}

                      {/* Delete */}
                      <Button
                        variant="danger"
                        size="sm"
                        className="w-full flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeletePost(post.id, post.title)}
                        loading={deletePostMutation.isPending}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {posts && posts.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={posts.number}
              totalPages={posts.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Summary */}
        {posts && (
          <div className="mt-6 text-center text-sm text-muted">
            Showing {Math.min(posts.numberOfElements, filteredPosts.length)} of {posts.totalElements} posts
            {(searchQuery || statusFilter !== 'ALL' || authorFilter) && 
              ` (${filteredPosts.length} matching current filters)`
            }
          </div>
        )}

        {/* Bulk Actions */}
        {filteredPosts.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-primary">Bulk Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    alert('Bulk publish functionality would be implemented here');
                  }}
                >
                  Bulk Publish Drafts
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    alert('Bulk archive functionality would be implemented here');
                  }}
                >
                  Bulk Archive
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    alert('Export functionality would be implemented here');
                  }}
                >
                  Export Posts
                </Button>
              </div>
              <p className="text-sm text-secondary mt-2">
                Select multiple posts to perform bulk operations. (Feature would be enhanced with checkboxes)
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManagePostsPage;