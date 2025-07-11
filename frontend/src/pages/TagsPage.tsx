import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag as TagIcon, TrendingUp, Hash, Search } from 'lucide-react';
import { useAllTags, usePublishedPosts } from '../hooks/useBlogPosts';
import { Tag } from '../components/ui/Badge';
import Card, { CardBody } from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Loading from '../components/ui/Loading';

interface TagStats {
  name: string;
  count: number;
  totalViews: number;
  totalComments: number;
}

const TagsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'count' | 'name' | 'views'>('count');
  
  const { data: tags, isLoading: tagsLoading } = useAllTags();
  const { data: posts, isLoading: postsLoading } = usePublishedPosts(0, 1000); // Get all posts to calculate stats

  const isLoading = tagsLoading || postsLoading;

  const tagStats = useMemo(() => {
    if (!tags || !posts?.content) return [];

    const statsMap = new Map<string, TagStats>();

    // Initialize all tags
    tags.forEach(tag => {
      statsMap.set(tag, {
        name: tag,
        count: 0,
        totalViews: 0,
        totalComments: 0,
      });
    });

    // Calculate stats from posts
    posts.content.forEach(post => {
      post.tags.forEach(tag => {
        const stats = statsMap.get(tag);
        if (stats) {
          stats.count += 1;
          stats.totalViews += post.viewCount;
          stats.totalComments += post.commentCount;
        }
      });
    });

    return Array.from(statsMap.values()).filter(stat => stat.count > 0);
  }, [tags, posts]);

  const filteredAndSortedTags = useMemo(() => {
    let filtered = tagStats;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'views':
          return b.totalViews - a.totalViews;
        case 'count':
        default:
          return b.count - a.count;
      }
    });

    return filtered;
  }, [tagStats, searchQuery, sortBy]);

  // Calculate tag size for cloud visualization
  const getTagSize = (count: number) => {
    if (!tagStats.length) return 'text-base';
    
    const maxCount = Math.max(...tagStats.map(t => t.count));
    const minCount = Math.min(...tagStats.map(t => t.count));
    const range = maxCount - minCount || 1;
    const normalizedSize = (count - minCount) / range;

    if (normalizedSize > 0.8) return 'text-2xl';
    if (normalizedSize > 0.6) return 'text-xl';
    if (normalizedSize > 0.4) return 'text-lg';
    if (normalizedSize > 0.2) return 'text-base';
    return 'text-sm';
  };

  const getTagColor = (count: number) => {
    if (!tagStats.length) return 'bg-blue-100 text-blue-800';
    
    const maxCount = Math.max(...tagStats.map(t => t.count));
    const normalizedSize = count / maxCount;

    if (normalizedSize > 0.8) return 'bg-purple-100 text-purple-800';
    if (normalizedSize > 0.6) return 'bg-blue-100 text-blue-800';
    if (normalizedSize > 0.4) return 'bg-green-100 text-green-800';
    if (normalizedSize > 0.2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading tags..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Tags</h1>
          <p className="text-secondary text-lg">
            Explore content organized by topics and themes.
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TagIcon size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {tagStats.length}
              </h3>
              <p className="text-secondary">Total Tags</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {tagStats.reduce((acc, tag) => acc + tag.totalViews, 0).toLocaleString()}
              </h3>
              <p className="text-secondary">Total Views</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Hash size={24} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {tagStats.length > 0 
                  ? (tagStats.reduce((acc, tag) => acc + tag.count, 0) / tagStats.length).toFixed(1)
                  : 0
                }
              </h3>
              <p className="text-secondary">Avg Posts per Tag</p>
            </CardBody>
          </Card>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tags..."
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'count' | 'name' | 'views')}
                className="input w-auto"
              >
                <option value="count">Sort by Post Count</option>
                <option value="views">Sort by Views</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags Display */}
        {filteredAndSortedTags.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No tags found
              </h3>
              <p className="text-secondary">
                {searchQuery 
                  ? `No tags match "${searchQuery}". Try a different search term.`
                  : "No tags available at the moment."
                }
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Tag Cloud */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-primary mb-6">Tag Cloud</h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {filteredAndSortedTags.map((tag) => (
                    <Link
                      key={tag.name}
                      to={`/tags/${encodeURIComponent(tag.name)}`}
                      className="transition-transform hover:scale-105"
                    >
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full font-medium transition-all hover:opacity-80 ${getTagSize(tag.count)} ${getTagColor(tag.count)}`}
                      >
                        {tag.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Detailed Tag List */}
            <Card>
              <CardBody>
                <h2 className="text-xl font-semibold text-primary mb-6">All Tags</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAndSortedTags.map((tag) => (
                    <Link
                      key={tag.name}
                      to={`/tags/${encodeURIComponent(tag.name)}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Tag className="text-sm font-medium">
                          {tag.name}
                        </Tag>
                        <span className="text-xs text-muted">
                          {tag.count} post{tag.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-secondary">
                        <div>
                          <span className="font-medium">{tag.totalViews.toLocaleString()}</span> views
                        </div>
                        <div>
                          <span className="font-medium">{tag.totalComments}</span> comments
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && filteredAndSortedTags.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted">
            Found {filteredAndSortedTags.length} tag{filteredAndSortedTags.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}

        {/* Popular Tags Section */}
        {!searchQuery && tagStats.length > 0 && (
          <Card className="mt-8">
            <CardBody>
              <h2 className="text-xl font-semibold text-primary mb-6">Most Popular Tags</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagStats
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 6)
                  .map((tag, index) => (
                    <Link
                      key={tag.name}
                      to={`/tags/${encodeURIComponent(tag.name)}`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-primary truncate">
                          {tag.name}
                        </div>
                        <div className="text-sm text-secondary">
                          {tag.count} posts • {tag.totalViews.toLocaleString()} views
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TagsPage;