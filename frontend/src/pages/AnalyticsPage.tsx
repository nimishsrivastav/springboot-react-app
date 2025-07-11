import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  MessageCircle, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { usePublishedPosts, useAllTags } from '../hooks/useBlogPosts';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const { data: posts, isLoading: postsLoading } = usePublishedPosts(0, 1000);
  const { data: tags, isLoading: tagsLoading } = useAllTags();

  const isLoading = postsLoading || tagsLoading;

  // Calculate analytics data
  const analytics = React.useMemo(() => {
    if (!posts?.content) {
      return {
        totalViews: 0,
        totalComments: 0,
        totalPosts: 0,
        avgViewsPerPost: 0,
        avgCommentsPerPost: 0,
        engagementRate: 0,
        topPosts: [],
        topAuthors: [],
        topTags: [],
        monthlyData: [],
        viewsOverTime: [],
        contentPerformance: [],
      };
    }

    const totalViews = posts.content.reduce((acc, post) => acc + post.viewCount, 0);
    const totalComments = posts.content.reduce((acc, post) => acc + post.commentCount, 0);
    const totalPosts = posts.content.length;

    // Top performing posts
    const topPosts = [...posts.content]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(post => ({
        title: post.title,
        views: post.viewCount,
        comments: post.commentCount,
        engagementRate: post.viewCount > 0 ? (post.commentCount / post.viewCount * 100) : 0,
        slug: post.slug,
        id: post.id,
      }));

    // Author performance
    const authorStats = new Map();
    posts.content.forEach(post => {
      const existing = authorStats.get(post.author) || { posts: 0, views: 0, comments: 0 };
      existing.posts += 1;
      existing.views += post.viewCount;
      existing.comments += post.commentCount;
      authorStats.set(post.author, existing);
    });

    const topAuthors = Array.from(authorStats.entries())
      .map(([author, stats]: [string, any]) => ({
        author,
        posts: stats.posts,
        views: stats.views,
        comments: stats.comments,
        avgViews: Math.round(stats.views / stats.posts),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Tag performance
    const tagStats = new Map();
    posts.content.forEach(post => {
      post.tags.forEach(tag => {
        const existing = tagStats.get(tag) || { posts: 0, views: 0, comments: 0 };
        existing.posts += 1;
        existing.views += post.viewCount;
        existing.comments += post.commentCount;
        tagStats.set(tag, existing);
      });
    });

    const topTags = Array.from(tagStats.entries())
      .map(([tag, stats]: [string, any]) => ({
        tag,
        posts: stats.posts,
        views: stats.views,
        comments: stats.comments,
        avgViews: Math.round(stats.views / stats.posts),
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Monthly data for trend analysis
    const monthlyData = posts.content.reduce((acc, post) => {
      const month = new Date(post.createdAt).toISOString().slice(0, 7);
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.posts += 1;
        existing.views += post.viewCount;
        existing.comments += post.commentCount;
      } else {
        acc.push({
          month,
          posts: 1,
          views: post.viewCount,
          comments: post.commentCount,
        });
      }
      return acc;
    }, [] as any[]).sort((a, b) => a.month.localeCompare(b.month));

    // Content performance categories
    const contentPerformance = [
      {
        category: 'High Performers',
        description: 'Posts with >500 views',
        count: posts.content.filter(p => p.viewCount > 500).length,
        percentage: posts.content.length > 0 ? (posts.content.filter(p => p.viewCount > 500).length / posts.content.length * 100) : 0,
        color: 'bg-green-500',
      },
      {
        category: 'Good Performers',
        description: 'Posts with 100-500 views',
        count: posts.content.filter(p => p.viewCount >= 100 && p.viewCount <= 500).length,
        percentage: posts.content.length > 0 ? (posts.content.filter(p => p.viewCount >= 100 && p.viewCount <= 500).length / posts.content.length * 100) : 0,
        color: 'bg-blue-500',
      },
      {
        category: 'Low Performers',
        description: 'Posts with <100 views',
        count: posts.content.filter(p => p.viewCount < 100).length,
        percentage: posts.content.length > 0 ? (posts.content.filter(p => p.viewCount < 100).length / posts.content.length * 100) : 0,
        color: 'bg-yellow-500',
      },
    ];

    return {
      totalViews,
      totalComments,
      totalPosts,
      avgViewsPerPost: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0,
      avgCommentsPerPost: totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0,
      engagementRate: totalViews > 0 ? (totalComments / totalViews * 100).toFixed(2) : 0,
      topPosts,
      topAuthors,
      topTags,
      monthlyData,
      contentPerformance,
    };
  }, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading analytics..." />
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
              <h1 className="text-3xl font-bold text-primary">Analytics</h1>
              <p className="text-secondary">Detailed insights into your blog performance.</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : 
                 range === '30d' ? '30 Days' : 
                 range === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {analytics.totalViews.toLocaleString()}
              </h3>
              <p className="text-secondary">Total Views</p>
              <div className="text-xs text-muted mt-1">
                {analytics.avgViewsPerPost} avg per post
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageCircle size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {analytics.totalComments}
              </h3>
              <p className="text-secondary">Total Comments</p>
              <div className="text-xs text-muted mt-1">
                {analytics.avgCommentsPerPost} avg per post
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {analytics.engagementRate}%
              </h3>
              <p className="text-secondary">Engagement Rate</p>
              <div className="text-xs text-muted mt-1">
                Comments per view
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity size={24} className="text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {analytics.totalPosts}
              </h3>
              <p className="text-secondary">Published Posts</p>
              <div className="text-xs text-muted mt-1">
                Content library
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Performing Posts */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Top Performing Posts</h2>
              </CardHeader>
              <CardBody>
                {analytics.topPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted mb-4" />
                    <p className="text-secondary">No performance data available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.topPosts.map((post, index) => (
                      <div key={post.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/posts/${post.slug || post.id}`}
                            className="font-medium text-primary hover:text-primary-dark transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-secondary mt-1">
                            <span>{post.views.toLocaleString()} views</span>
                            <span>{post.comments} comments</span>
                            <span>{post.engagementRate.toFixed(2)}% engagement</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Content Performance Distribution */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Content Performance Distribution</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {analytics.contentPerformance.map(category => (
                    <div key={category.category}>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium text-primary">{category.category}</h4>
                          <p className="text-sm text-secondary">{category.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{category.count}</div>
                          <div className="text-sm text-secondary">{category.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${category.color}`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Monthly Trends</h2>
              </CardHeader>
              <CardBody>
                {analytics.monthlyData.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted mb-4" />
                    <p className="text-secondary">Not enough data for trend analysis.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.monthlyData.slice(-6).map(data => (
                      <div key={data.month} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-primary">
                            {new Date(data.month + '-01').toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </div>
                          <div className="text-sm text-secondary">
                            {data.posts} posts published
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-primary">
                            {data.views.toLocaleString()} views
                          </div>
                          <div className="text-sm text-secondary">
                            {data.comments} comments
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                {analytics.topAuthors.length === 0 ? (
                  <div className="text-center py-4">
                    <Users className="mx-auto h-8 w-8 text-muted mb-2" />
                    <p className="text-sm text-secondary">No author data available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.topAuthors.map((author, index) => (
                      <div key={author.author} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/authors/${encodeURIComponent(author.author)}`}
                            className="font-medium text-primary hover:text-primary-dark transition-colors truncate block"
                          >
                            {author.author}
                          </Link>
                          <div className="text-xs text-secondary">
                            {author.posts} posts • {author.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Top Tags */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Popular Tags</h2>
              </CardHeader>
              <CardBody>
                {analytics.topTags.length === 0 ? (
                  <div className="text-center py-4">
                    <PieChart className="mx-auto h-8 w-8 text-muted mb-2" />
                    <p className="text-sm text-secondary">No tag data available</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {analytics.topTags.map(tag => (
                      <Link
                        key={tag.tag}
                        to={`/tags/${encodeURIComponent(tag.tag)}`}
                        className="block p-2 border border-gray-200 rounded hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-primary text-sm">{tag.tag}</span>
                          <span className="text-xs text-secondary">{tag.posts}</span>
                        </div>
                        <div className="text-xs text-secondary">
                          {tag.views.toLocaleString()} views • {tag.avgViews} avg
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Quick Insights</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Most Viewed Post</div>
                    <div className="text-blue-600">
                      {analytics.topPosts.length > 0 
                        ? `${analytics.topPosts[0].views.toLocaleString()} views`
                        : 'No data yet'
                      }
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Most Commented Post</div>
                    <div className="text-green-600">
                      {analytics.topPosts.length > 0 
                        ? `${Math.max(...analytics.topPosts.map(p => p.comments))} comments`
                        : 'No data yet'
                      }
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Best Engagement</div>
                    <div className="text-purple-600">
                      {analytics.topPosts.length > 0 
                        ? `${Math.max(...analytics.topPosts.map(p => p.engagementRate)).toFixed(2)}%`
                        : 'No data yet'
                      }
                    </div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800">Top Author</div>
                    <div className="text-orange-600">
                      {analytics.topAuthors.length > 0 
                        ? analytics.topAuthors[0].author
                        : 'No data yet'
                      }
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Export Data */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary">Export Data</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // In a real app, you'd implement CSV export
                      alert('CSV export would be implemented here');
                    }}
                  >
                    Export as CSV
                  </Button>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // In a real app, you'd implement PDF export
                      alert('PDF export would be implemented here');
                    }}
                  >
                    Export as PDF
                  </Button>
                  
                  <div className="text-xs text-secondary text-center pt-2">
                    Export analytics data for external analysis
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Additional Analytics Note */}
        <Card className="mt-8">
          <CardBody>
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-muted mb-2">
                <Activity size={16} />
                <span className="text-sm">Analytics Dashboard</span>
              </div>
              <p className="text-sm text-secondary">
                Data is updated in real-time based on published posts and user interactions. 
                For more detailed analytics, consider integrating with Google Analytics or similar tools.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;