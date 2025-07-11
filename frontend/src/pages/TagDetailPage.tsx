import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag as TagIcon, FileText, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { usePostsByTags, useAllTags } from '../hooks/useBlogPosts';
import { BlogPostList } from '../components/blog/BlogPostList';
import { Tag } from '../components/ui/Badge';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';

const TagDetailPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const [currentPage, setCurrentPage] = useState(0);
  
  const decodedTag = decodeURIComponent(tag || '');
  const { data: posts, isLoading, error } = usePostsByTags([decodedTag], currentPage, 12);
  const { data: allTags } = useAllTags();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate tag statistics
  const tagStats = posts ? {
    totalPosts: posts.totalElements,
    totalViews: posts.content.reduce((acc, post) => acc + post.viewCount, 0),
    totalComments: posts.content.reduce((acc, post) => acc + post.commentCount, 0),
    avgViewsPerPost: posts.totalElements > 0 
      ? Math.round(posts.content.reduce((acc, post) => acc + post.viewCount, 0) / posts.totalElements)
      : 0,
    topAuthors: posts.content.length > 0
      ? Object.entries(
          posts.content.reduce((acc, post) => {
            acc[post.author] = (acc[post.author] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([author, count]) => ({ author, count }))
      : [],
  } : null;

  // Get related tags (tags that often appear with this tag)
  const relatedTags = React.useMemo(() => {
    if (!posts?.content || !allTags) return [];
    
    const tagCounts = new Map<string, number>();
    
    posts.content.forEach(post => {
      post.tags.forEach(postTag => {
        if (postTag !== decodedTag) {
          tagCounts.set(postTag, (tagCounts.get(postTag) || 0) + 1);
        }
      });
    });

    return Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([tagName, count]) => ({ name: tagName, count }));
  }, [posts, allTags, decodedTag]);

  if (!tag) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Tag Not Found
            </h1>
            <p className="text-secondary mb-6">
              The tag you're looking for doesn't exist.
            </p>
            <Link to="/tags">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Back to Tags
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
          <Link to="/tags">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Tags
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tag Header */}
            <Card className="mb-8">
              <CardBody>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                    <TagIcon size={24} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      #{decodedTag}
                    </h1>
                    <p className="text-secondary text-lg">
                      Posts tagged with "{decodedTag}"
                    </p>
                  </div>
                </div>
                
                {tagStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">
                        {tagStats.totalPosts}
                      </div>
                      <div className="text-sm text-secondary">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">
                        {tagStats.totalViews.toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">
                        {tagStats.totalComments}
                      </div>
                      <div className="text-sm text-secondary">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">
                        {tagStats.avgViewsPerPost.toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary">Avg. Views</div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Posts tagged with "{decodedTag}"
              </h2>
              
              <BlogPostList
                posts={posts}
                loading={isLoading}
                error={error?.message}
                onPageChange={handlePageChange}
                emptyMessage={`No posts found with the tag "${decodedTag}".`}
                gridCols={1}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Tag Statistics */}
              {tagStats && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Tag Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-500" />
                        <div>
                          <div className="font-medium">{tagStats.totalPosts} Posts</div>
                          <div className="text-sm text-secondary">Published articles</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Eye size={16} className="text-green-500" />
                        <div>
                          <div className="font-medium">{tagStats.totalViews.toLocaleString()} Views</div>
                          <div className="text-sm text-secondary">Total engagement</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MessageCircle size={16} className="text-purple-500" />
                        <div>
                          <div className="font-medium">{tagStats.totalComments} Comments</div>
                          <div className="text-sm text-secondary">Reader discussions</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <TrendingUp size={16} className="text-orange-500" />
                        <div>
                          <div className="font-medium">
                            {tagStats.totalComments > 0 && tagStats.totalViews > 0
                              ? ((tagStats.totalComments / tagStats.totalViews) * 100).toFixed(2)
                              : 0
                            }%
                          </div>
                          <div className="text-sm text-secondary">Engagement rate</div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Top Authors */}
              {tagStats && tagStats.topAuthors.length > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Top Authors</h3>
                    <div className="space-y-3">
                      {tagStats.topAuthors.map((authorData, index) => (
                        <div key={authorData.author} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Link
                              to={`/authors/${encodeURIComponent(authorData.author)}`}
                              className="font-medium text-primary hover:text-primary-dark transition-colors"
                            >
                              {authorData.author}
                            </Link>
                            <div className="text-sm text-secondary">
                              {authorData.count} post{authorData.count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Related Tags */}
              {relatedTags.length > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Related Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedTags.map((relatedTag) => (
                        <Link
                          key={relatedTag.name}
                          to={`/tags/${encodeURIComponent(relatedTag.name)}`}
                        >
                          <Tag className="text-xs hover:opacity-80 transition-opacity">
                            {relatedTag.name} ({relatedTag.count})
                          </Tag>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-secondary">
                      Tags that frequently appear with "{decodedTag}"
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
                        Write Post with This Tag
                      </Button>
                    </Link>
                    <Link to="/tags" className="block">
                      <Button variant="secondary" size="sm" className="w-full">
                        Browse All Tags
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

              {/* Tag Insights */}
              {tagStats && tagStats.totalPosts > 0 && (
                <Card>
                  <CardBody>
                    <h3 className="font-semibold text-primary mb-4">Tag Insights</h3>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium text-blue-800 mb-1">Popularity</div>
                        <div className="text-blue-600">
                          This tag has {tagStats.totalPosts} post{tagStats.totalPosts !== 1 ? 's' : ''} with an average of{' '}
                          {tagStats.avgViewsPerPost.toLocaleString()} views per post.
                        </div>
                      </div>
                      
                      {tagStats.totalComments > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-green-800 mb-1">Engagement</div>
                          <div className="text-green-600">
                            Posts with this tag generate an average of{' '}
                            {(tagStats.totalComments / tagStats.totalPosts).toFixed(1)} comments each.
                          </div>
                        </div>
                      )}
                      
                      {tagStats.topAuthors.length > 0 && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-medium text-purple-800 mb-1">Top Contributor</div>
                          <div className="text-purple-600">
                            {tagStats.topAuthors[0].author} has written {tagStats.topAuthors[0].count} post{tagStats.topAuthors[0].count !== 1 ? 's' : ''} with this tag.
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagDetailPage;