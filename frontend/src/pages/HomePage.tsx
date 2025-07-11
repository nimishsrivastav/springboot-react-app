import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { PenTool, TrendingUp, Users, FileText } from 'lucide-react';
import { usePublishedPosts, useAllTags } from '../hooks/useBlogPosts';
import { BlogPostList } from '../components/blog/BlogPostList';
import SearchInput from '../components/ui/SearchInput';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: posts, isLoading, error } = usePublishedPosts(currentPage, 6);
  const { data: tags } = useAllTags();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you'd implement search functionality here
  };

  const featuredTags = tags?.slice(0, 8) || [];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              <div className="hero-content text-center">
                <div className="d-flex justify-content-center mb-4">
                  <div className="bg-white shadow p-3 rounded-3 border">
                    <PenTool size={48} className="text-primary" />
                  </div>
                </div>
                
                <h1 className="hero-title">
                  Welcome to{' '}
                  <span className="brand-highlight">BlogApp</span>
                </h1>
                
                <p className="hero-subtitle">
                  Discover amazing stories, share your thoughts, and connect with a 
                  community of passionate writers and readers.
                </p>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
                  <Link to="/posts">
                    <Button variant="primary" size="lg" className="px-4">
                      Explore Posts
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button variant="outline-primary" size="lg" className="px-4">
                      Start Writing
                    </Button>
                  </Link>
                </div>

                {/* Search Section */}
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <SearchInput
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Search for posts, authors, or topics..."
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-white">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon primary">
                  <FileText size={32} />
                </div>
                <div className="stat-number">
                  {posts?.totalElements || 0}
                </div>
                <div className="stat-label">Published Posts</div>
                <div className="stat-description">Quality content for everyone</div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon success">
                  <Users size={32} />
                </div>
                <div className="stat-number">
                  {new Set(posts?.content.map(post => post.author)).size || 0}
                </div>
                <div className="stat-label">Active Authors</div>
                <div className="stat-description">Contributing amazing content</div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon info">
                  <TrendingUp size={32} />
                </div>
                <div className="stat-number">
                  {posts?.content.reduce((acc, post) => acc + post.viewCount, 0)?.toLocaleString() || 0}
                </div>
                <div className="stat-label">Total Views</div>
                <div className="stat-description">Engaging our community</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Tags */}
      {featuredTags.length > 0 && (
        <section className="py-5 bg-light">
          <Container>
            <Row className="justify-content-center mb-5">
              <Col lg={8} className="text-center">
                <h2 className="display-5 fw-bold text-dark mb-3">
                  Popular Topics
                </h2>
                <p className="lead text-muted">
                  Explore our most popular topics and discover content that interests you.
                </p>
              </Col>
            </Row>
            
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  {featuredTags.map((tag) => (
                    <Link key={tag} to={`/tags/${encodeURIComponent(tag)}`} className="text-decoration-none">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2 fs-6 shadow-hover border"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </Col>
            </Row>
            
            <div className="text-center">
              <Link to="/tags">
                <Button variant="outline-secondary">
                  View All Topics
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Latest Posts */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="display-5 fw-bold text-dark mb-3">
                Latest Posts
              </h2>
              <p className="lead text-muted">
                Check out our most recent blog posts and stay up to date with the latest content.
              </p>
            </Col>
          </Row>

          <BlogPostList
            posts={posts}
            loading={isLoading}
            error={error?.message}
            onPageChange={handlePageChange}
            emptyMessage="No posts have been published yet. Check back soon!"
            gridCols={3}
          />

          {posts && posts.totalPages > 1 && (
            <Row className="justify-content-center mt-4">
              <Col className="text-center">
                <Link to="/posts">
                  <Button variant="primary" size="lg">
                    View All Posts
                  </Button>
                </Link>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, var(--bs-gray-50) 0%, #e0e7ff 50%, #f0f4ff 100%)' 
      }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="display-5 fw-bold text-dark mb-3">
                Ready to Share Your Story?
              </h2>
              <p className="lead text-muted mb-4">
                Join our community of writers and readers. Start creating amazing content today.
              </p>
              <Link to="/create">
                <Button variant="primary" size="lg" className="px-5">
                  Create Your First Post
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;