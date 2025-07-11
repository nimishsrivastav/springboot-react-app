import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { Calendar, User, Eye, MessageCircle } from 'lucide-react';
import { BlogPost } from '../../types';
import { formatDate, truncateText } from '../../utils';

interface BlogPostCardProps {
  post: BlogPost;
  showStatus?: boolean;
  compact?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ 
  post, 
  showStatus = false,
  compact = false 
}) => {
  const postUrl = `/posts/${post.slug || post.id}`;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="blog-post-card card-hover h-100">
      <Card.Body className={compact ? 'p-3' : 'p-4'}>
        <div className="d-flex flex-column h-100">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <Link to={postUrl} className="text-decoration-none">
                <Card.Title className={`post-title ${compact ? 'h6' : 'h5'} mb-2`}>
                  {post.title}
                </Card.Title>
              </Link>
              
              {/* Meta info */}
              <div className="post-meta d-flex flex-wrap gap-3 mb-2">
                <span className="meta-item">
                  <User size={14} />
                  <Link 
                    to={`/authors/${encodeURIComponent(post.author)}`}
                    className="text-decoration-none ms-1"
                  >
                    {post.author}
                  </Link>
                </span>
                <span className="meta-item">
                  <Calendar size={14} />
                  {formatDate(post.createdAt)}
                </span>
                {post.viewCount > 0 && (
                  <span className="meta-item">
                    <Eye size={14} />
                    {post.viewCount.toLocaleString()}
                  </span>
                )}
                {post.commentCount > 0 && (
                  <span className="meta-item">
                    <MessageCircle size={14} />
                    {post.commentCount}
                  </span>
                )}
              </div>
            </div>
            
            {showStatus && (
              <Badge bg={getStatusVariant(post.status)} className="badge-status">
                {post.status}
              </Badge>
            )}
          </div>

          {/* Summary */}
          {post.summary && !compact && (
            <p className="post-excerpt text-muted mb-3">
              {post.summary}
            </p>
          )}

          {/* Content Preview */}
          {!post.summary && (
            <p className="post-excerpt text-muted mb-3">
              {truncateText(post.content.replace(/<[^>]*>/g, ''), compact ? 100 : 150)}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags mb-3">
              {post.tags.slice(0, compact ? 2 : 3).map((tag) => (
                <Link 
                  key={tag} 
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className="tag text-decoration-none"
                >
                  {tag}
                </Link>
              ))}
              {post.tags.length > (compact ? 2 : 3) && (
                <span className="text-muted small">
                  +{post.tags.length - (compact ? 2 : 3)} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
            <Link 
              to={postUrl}
              className="text-primary text-decoration-none fw-medium small"
            >
              Read more →
            </Link>
            
            {post.publishedAt && (
              <small className="text-muted">
                Published {formatDate(post.publishedAt)}
              </small>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BlogPostCard;