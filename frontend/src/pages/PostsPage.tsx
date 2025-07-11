import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, Offcanvas } from 'react-bootstrap';
import { Filter, SortAsc, SortDesc, Sliders } from 'lucide-react';
import { usePublishedPosts, useSearchPosts, useAllTags } from '../hooks/useBlogPosts';
import { BlogPostList } from '../components/blog/BlogPostList';
import SearchInput from '../components/ui/SearchInput';

const PostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: tags } = useAllTags();
  
  // Use search or regular posts based on search query
  const { data: searchResults, isLoading: searchLoading } = useSearchPosts(
    searchQuery, 
    currentPage, 
    12
  );
  
  const { data: allPosts, isLoading: postsLoading } = usePublishedPosts(
    currentPage, 
    12
  );

  const posts = searchQuery ? searchResults : allPosts;
  const isLoading = searchQuery ? searchLoading : postsLoading;

  // Update URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortDir !== 'desc') params.set('sortDir', sortDir);
    
    setSearchParams(params);
  }, [searchQuery, sortBy, sortDir, setSearchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDir('desc');
    }
    setCurrentPage(0);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSortBy('createdAt');
    setSortDir('desc');
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'publishedAt', label: 'Date Published' },
    { value: 'viewCount', label: 'Views' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
  ];

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'createdAt' || sortDir !== 'desc';

  return (
    <>
      {/* Page Header */}
      <section className="bg-light py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="display-4 fw-bold text-dark mb-3">All Blog Posts</h1>
              <p className="lead text-muted">
                Discover our collection of articles, tutorials, and insights.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search and Filters */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <Row className="g-3">
            {/* Search Bar */}
            <Col lg={8}>
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search posts by title, content, or author..."
                size="lg"
              />
            </Col>
            
            <Col lg={4} className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowFilters(true)}
                className="d-flex align-items-center"
              >
                <Sliders size={16} className="me-2" />
                Filters
                {hasActiveFilters && (
                  <Badge bg="danger" className="ms-2">!</Badge>
                )}
              </Button>
            </Col>
          </Row>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <Row className="mt-3">
              <Col>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <small className="text-muted d-flex align-items-center">
                    <Filter size={14} className="me-1" />
                    Active filters:
                  </small>
                  {searchQuery && (
                    <Badge bg="primary" className="d-flex align-items-center">
                      Search: "{searchQuery}"
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} bg="success" className="d-flex align-items-center">
                      Tag: {tag}
                    </Badge>
                  ))}
                  {(sortBy !== 'createdAt' || sortDir !== 'desc') && (
                    <Badge bg="info" className="d-flex align-items-center">
                      Sort: {sortOptions.find(opt => opt.value === sortBy)?.label} 
                      {sortDir === 'asc' ? <SortAsc size={12} className="ms-1" /> : <SortDesc size={12} className="ms-1" />}
                    </Badge>
                  )}
                  <Button variant="link" size="sm" onClick={clearFilters} className="text-danger p-0">
                    Clear all
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* Results Summary */}
      {posts && (
        <section className="py-3 bg-light">
          <Container>
            <Row>
              <Col>
                <small className="text-muted">
                  {searchQuery ? (
                    <>
                      Found {posts.totalElements} result{posts.totalElements !== 1 ? 's' : ''} for "{searchQuery}"
                    </>
                  ) : (
                    <>
                      Showing {posts.totalElements} post{posts.totalElements !== 1 ? 's' : ''}
                    </>
                  )}
                </small>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Posts List */}
      <section className="py-5">
        <BlogPostList
          posts={posts}
          loading={isLoading}
          onPageChange={handlePageChange}
          emptyMessage={
            searchQuery 
              ? `No posts found for "${searchQuery}". Try different keywords or remove filters.`
              : "No posts have been published yet."
          }
          gridCols={2}
        />
      </section>

      {/* Filters Offcanvas */}
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters & Sorting</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Sort Options */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Sort By</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleSortChange(option.value)}
                    className="d-flex align-items-center justify-content-between"
                  >
                    {option.label}
                    {sortBy === option.value && (
                      sortDir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                    )}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Tag Filters */}
          {tags && tags.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h6 className="mb-0">Filter by Tags</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      bg={selectedTags.includes(tag) ? 'primary' : 'light'}
                      text={selectedTags.includes(tag) ? 'white' : 'dark'}
                      className="cursor-pointer p-2 border"
                      onClick={() => toggleTag(tag)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="d-grid">
              <Button variant="outline-danger" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default PostsPage;