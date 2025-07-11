import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, TrendingUp, Search } from 'lucide-react';
import { usePublishedPosts } from '../hooks/useBlogPosts';
import { BlogPost } from '../types';
import Card, { CardBody } from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Loading from '../components/ui/Loading';

interface AuthorStats {
  name: string;
  postCount: number;
  totalViews: number;
  totalComments: number;
  recentPosts: BlogPost[];
}

const AuthorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all posts to calculate author statistics
  const { data: postsData, isLoading, error } = usePublishedPosts(0, 1000); // Large page size to get all posts

  const authorStats = useMemo(() => {
    if (!postsData?.content) return [];

    const authorsMap = new Map<string, AuthorStats>();

    postsData.content.forEach((post) => {
      const authorName = post.author;
      const existing = authorsMap.get(authorName);

      if (existing) {
        existing.postCount += 1;
        existing.totalViews += post.viewCount;
        existing.totalComments += post.commentCount;
        existing.recentPosts.push(post);
      } else {
        authorsMap.set(authorName, {
          name: authorName,
          postCount: 1,
          totalViews: post.viewCount,
          totalComments: post.commentCount,
          recentPosts: [post],
        });
      }
    });

    // Sort recent posts by date and keep only the 3 most recent
    authorsMap.forEach((author) => {
      author.recentPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      author.recentPosts = author.recentPosts.slice(0, 3);
    });

    return Array.from(authorsMap.values()).sort((a, b) => b.postCount - a.postCount);
  }, [postsData]);

  const filteredAuthors = useMemo(() => {
    if (!searchQuery) return authorStats;
    return authorStats.filter((author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [authorStats, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <Loading text="Loading authors..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Error Loading Authors</h1>
            <p className="text-secondary">Unable to load author information. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Authors</h1>
          <p className="text-secondary text-lg">
            Meet the talented writers contributing to our blog community.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search authors..."
            />
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User size={24} className="text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {authorStats.length}
              </h3>
              <p className="text-secondary">Total Authors</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText size={24} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-1">
                {authorStats.reduce((acc, author) => acc + author.postCount, 0)}
              </h3>
              <p className="text-secondary">Total Posts</p>
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
                {authorStats.reduce((acc, author) => acc + author.totalViews, 0).toLocaleString()}
              </h3>
              <p className="text-secondary">Total Views</p>
            </CardBody>
          </Card>
        </div>

        {/* Authors List */}
        {filteredAuthors.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No authors found
              </h3>
              <p className="text-secondary">
                {searchQuery 
                  ? `No authors match "${searchQuery}". Try a different search term.`
                  : "No authors available at the moment."
                }
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAuthors.map((author) => (
              <Card key={author.name} hover>
                <CardBody>
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {author.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-primary mb-1">
                            {author.name}
                          </h3>
                          <p className="text-sm text-secondary">
                            Contributing Author
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {author.postCount}
                          </div>
                          <div className="text-xs text-secondary">Posts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {author.totalViews.toLocaleString()}
                          </div>
                          <div className="text-xs text-secondary">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">
                            {author.totalComments}
                          </div>
                          <div className="text-xs text-secondary">Comments</div>
                        </div>
                      </div>

                      {/* Recent Posts */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-primary mb-2">
                          Recent Posts:
                        </h4>
                        <div className="space-y-1">
                          {author.recentPosts.map((post) => (
                            <Link
                              key={post.id}
                              to={`/posts/${post.slug || post.id}`}
                              className="block text-sm text-secondary hover:text-primary transition-colors truncate"
                            >
                              • {post.title}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Action */}
                      <Link
                        to={`/authors/${encodeURIComponent(author.name)}`}
                        className="inline-flex items-center text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                      >
                        View all posts →
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery && filteredAuthors.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted">
            Found {filteredAuthors.length} author{filteredAuthors.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorsPage;