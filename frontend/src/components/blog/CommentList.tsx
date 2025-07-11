import React from 'react';
import { MessageCircle, User, Trash2 } from 'lucide-react';
import { Comment, PaginatedResponse } from '../../types';
import { formatRelativeTime } from '../../utils';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import Pagination from '../ui/Pagination';

interface CommentListProps {
  comments?: PaginatedResponse<Comment>;
  loading?: boolean;
  error?: string;
  onPageChange?: (page: number) => void;
  onDeleteComment?: (commentId: number) => void;
  canDelete?: boolean;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  loading = false,
  error,
  onPageChange,
  onDeleteComment,
  canDelete = false,
}) => {
  if (loading) {
    return <Loading text="Loading comments..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <MessageCircle className="mx-auto h-8 w-8" />
        </div>
        <p className="text-sm text-secondary">
          Failed to load comments: {error}
        </p>
      </div>
    );
  }

  if (!comments || comments.content.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted mb-4">
          <MessageCircle className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-primary mb-2">
          No comments yet
        </h3>
        <p className="text-secondary">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-2">
        <MessageCircle size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-primary">
          Comments ({comments.totalElements})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.content.map((comment) => (
          <Card key={comment.id}>
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary text-sm">
                      {comment.authorName}
                    </h4>
                    <time className="text-xs text-muted">
                      {formatRelativeTime(comment.createdAt)}
                    </time>
                  </div>
                </div>
                
                {canDelete && onDeleteComment && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              
              <div className="prose prose-sm max-w-none">
                <p className="text-secondary whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {onPageChange && comments.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={comments.number}
            totalPages={comments.totalPages}
            onPageChange={onPageChange}
            maxVisiblePages={3}
          />
        </div>
      )}
    </div>
  );
};

export default CommentList;