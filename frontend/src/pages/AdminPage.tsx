import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  Eye, 
  MessageCircle, 
  TrendingUp, 
  Plus,
  Settings,
  BarChart3,
  Edit
} from 'lucide-react';
import { usePublishedPosts, useBlogPosts } from '../hooks/useBlogPosts';
import { PostStatus } from '../types';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const AdminPage: React.FC = () => {
  const { data: publishedPosts, isLoading: publishedLoading } = usePublishedPosts(0, 100);
  const { data: allPosts, isLoading: allLoading } = useBlogPosts(0, 100);

  const isLoading = publishedLoading || allLoading;

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!publishedPosts?.content || !allPosts?.content) {
      return {
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        totalComments: 0,
        topAuthors: [],
        recentPosts: [],
      };
    }

    const totalViews = publishedPosts.content.reduce((acc, post) => acc + post.viewCount, 0);
    const totalComments = publishedPosts.content.reduce((acc, post) => acc + post.commentCount, 0);

    // Calculate author statistics
    const authorStats = new Map<string, { posts: number; views: number; comments: number }>();
    publishedPosts.content.forEach(post => {
      const existing = authorStats.get(post.author) || { posts: 0, views: 0, comments: 0 };
      existing.posts += 1;
      existing.views += post.viewCount;
      existing.comments += post.commentCount;
      authorStats.set(post.author, existing);
    });

    const topAuthors = Array.from(authorStats.entries())
      .map(([author, stats]) => ({ author, ...stats }))
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 5);

    // Get recent posts
    const recentPosts = allPosts.content
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const draftPosts = allPosts.content.filter(post => post.status === PostStatus.DRAFT).length;

    return {
      totalPosts: allPosts.totalElements,
      publishedPosts: publishedPosts.totalElements,
      draftPosts,
      totalViews,
      totalComments,
      topAuthors,
      recentPosts,
    };
  }, [publishedPosts, allPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
            <p className="text-secondary text-lg">
              Manage your blog content and monitor performance.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/create">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {stats.totalPosts}
              </h3>
              <p className="text-secondary">Total Posts</p>
              <div className="text-xs text-muted mt-1">
                {stats.publishedPosts} published, {stats.draftPosts} drafts
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Eye size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {stats.totalViews.toLocaleString()}
              </h3>
              <p className="text-secondary">Total Views</p>
              <div className="text-xs text-muted mt-1">
                {stats.publishedPosts > 0 ? Math.round(stats.totalViews / stats.publishedPosts) : 0} avg per post
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <MessageCircle size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {stats.totalComments}
              </h3>
              <p className="text-secondary">Total Comments</p>
              <div className="text-xs text-muted mt-1">
                {stats.publishedPosts > 0 ? (stats.totalComments / stats.publishedPosts).toFixed(1) : 0} avg per post
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users size={24} className="text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {stats.topAuthors.length}
              </h3>
              <p className="text-secondary">Active Authors</p>
              <div className="text-xs text-muted mt-1">
                Contributing to blog
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Quick Actions</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/create" className="block">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-center">
                      <Plus className="mx-auto mb-2 text-blue-600" size={24} />
                      <h3 className="font-medium text-primary mb-1">Create Post</h3>
                      <p className="text-sm text-secondary">Write a new blog post</p>
                    </div>
                  </Link>

                  <Link to="/admin/posts" className="block">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all text-center">
                      <Edit className="mx-auto mb-2 text-green-600" size={24} />
                      <h3 className="font-medium text-primary mb-1">Manage Posts</h3>
                      <p className="text-sm text-secondary">Edit existing posts</p>
                    </div>
                  </Link>

                  <Link to="/admin/analytics" className="block">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-center">
                      <BarChart3 className="mx-auto mb-2 text-purple-600" size={24} />
                      <h3 className="font-medium text-primary mb-1">Analytics</h3>
                      <p className="text-sm text-secondary">View detailed stats</p>
                    </div>
                  </Link>

                  <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all text-center cursor-pointer">
                    <Settings className="mx-auto mb-2 text-orange-600" size={24} />
                    <h3 className="font-medium text-primary mb-1">Settings</h3>
                    <p className="text-sm text-secondary">Blog configuration</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Recent Posts</h2>
                  <Link to="/admin/posts">
                    <Button variant="secondary" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                {stats.recentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted mb-4" />
                    <p className="text-secondary">No posts yet. Create your first post!</p>
                    <Link to="/create" className="mt-4 inline-block">
                      <Button size="sm">Create Post</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentPosts.map(post => (
                      <div key={post.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <Link 
                            to={`/posts/${post.slug || post.id}`}
                            className="font-medium text-primary hover:text-primary-dark transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-4 mt-1 text-sm text-secondary">
                            <span>by {post.author}</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              post.status === PostStatus.PUBLISHED 
                                ? 'bg-green-100 text-green-800'
                                : post.status === PostStatus.DRAFT
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {post.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted">
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {post.commentCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Performance Overview</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <TrendingUp className="mx-auto mb-2 text-blue-600" size={24} />
                    <div className="text-lg font-bold text-blue-800">
                      {stats.publishedPosts > 0 ? Math.round(stats.totalViews / stats.publishedPosts) : 0}
                    </div>
                    <div className="text-sm text-blue-600">Avg Views per Post</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <MessageCircle className="mx-auto mb-2 text-green-600" size={24} />
                    <div className="text-lg font-bold text-green-800">
                      {stats.publishedPosts > 0 ? (stats.totalComments / stats.publishedPosts).toFixed(1) : 0}
                    </div>
                    <div className="text-sm text-green-600">Avg Comments per Post</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <BarChart3 className="mx-auto mb-2 text-purple-600" size={24} />
                    <div className="text-lg font-bold text-purple-800">
                      {stats.totalViews > 0 ? ((stats.totalComments / stats.totalViews) * 100).toFixed(2) : 0}%
                    </div>
                    <div className="text-sm text-purple-600">Engagement Rate</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Authors */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Top Authors</h2>
              </CardHeader>
              <CardBody>
                {stats.topAuthors.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="mx-auto h-8 w-8 text-muted mb-2" />
                    <p className="text-sm text-secondary">No authors yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.topAuthors.map((author, index) => (
                      <div key={author.author} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/authors/${encodeURIComponent(author.author)}`}
                            className="font-medium text-primary hover:text-primary-dark transition-colors"
                          >
                            {author.author}
                          </Link>
                          <div className="text-sm text-secondary">
                            {author.posts} posts • {author.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Quick Stats</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Published Posts</span>
                    <span className="font-medium">{stats.publishedPosts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Draft Posts</span>
                    <span className="font-medium">{stats.draftPosts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Total Views</span>
                    <span className="font-medium">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Total Comments</span>
                    <span className="font-medium">{stats.totalComments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Active Authors</span>
                    <span className="font-medium">{stats.topAuthors.length}</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* System Info */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">System Info</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary">Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Status</span>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Last Backup</span>
                    <span className="font-medium">Today</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;