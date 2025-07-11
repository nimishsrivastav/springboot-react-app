import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FileX, AlertCircle } from 'lucide-react';
import { BlogPost, PaginatedResponse } from '@/types';
import { BlogPostCard } from './BlogPostCard';
import { CardSkeleton } from 'components/ui/Loading';
import Loading from 'components/ui/Loading';
import Pagination from 'components/ui/Pagination';

interface BlogPostListProps {
  posts?: PaginatedResponse<BlogPost>;
  loading?: boolean;
  error?: string;
  showStatus?: boolean;
  compact?: boolean;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  gridCols?: 1 | 2 | 3;
}

export const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  loading = false,
  error,
  showStatus = false,
  compact = false,
  onPageChange,
  emptyMessage = 'No blog posts found.',
  gridCols = 2,
}) => {
  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="text-center py-5">
          <AlertCircle size={48} className="mx-auto mb-3 text-danger" />
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Row className={`g-4 ${
          gridCols === 1 ? '' : 
          gridCols === 2 ? 'row-cols-1 row-cols-md-2' :
          'row-cols-1 row-cols-md-2 row-cols-lg-3'
        }`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index}>
              <CardSkeleton />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  if (!posts || posts.content.length === 0) {
    return (
      <Container>
        <div className="text-center py-5">
          <FileX size={64} className="text-muted mb-4" />
          <h3 className="text-dark mb-3">No posts found</h3>
          <p className="text-muted">{emptyMessage}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Posts Grid */}
      <Row className={`g-4 mb-5 ${
        gridCols === 1 ? '' : 
        gridCols === 2 ? 'row-cols-1 row-cols-md-2' :
        'row-cols-1 row-cols-md-2 row-cols-lg-3'
      }`}>
        {posts.content.map((post) => (
          <Col key={post.id}>
            <BlogPostCard
              post={post}
              showStatus={showStatus}
              compact={compact}
            />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {onPageChange && posts.totalPages > 1 && (
        <div className="d-flex justify-content-center mb-4">
          <Pagination
            currentPage={posts.number}
            totalPages={posts.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Results Info */}
      {posts.totalElements > 0 && (
        <div className="text-center">
          <small className="text-muted">
            Showing {posts.numberOfElements} of {posts.totalElements} posts
            {posts.totalPages > 1 && ` (Page ${posts.number + 1} of ${posts.totalPages})`}
          </small>
        </div>
      )}
    </Container>
  );
};

export default BlogPostList;