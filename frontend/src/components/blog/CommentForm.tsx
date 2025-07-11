import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { CreateCommentRequest } from '../../types';
import Card, { CardBody } from '../ui/Card';
import { Input, Textarea } from '../ui/Input';
import Button from '../ui/Button';

interface CommentFormProps {
  onSubmit: (comment: CreateCommentRequest) => Promise<void>;
  loading?: boolean;
}

interface CommentFormData {
  authorName: string;
  authorEmail?: string;
  content: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommentFormData>({
    mode: 'onChange',
  });

  const onFormSubmit = async (data: CommentFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        authorName: data.authorName.trim(),
        authorEmail: data.authorEmail?.trim() || undefined,
        content: data.content.trim(),
      });
      reset();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-primary mb-4">
          Leave a Comment
        </h3>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              placeholder="Your name"
              {...register('authorName', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters',
                },
              })}
              error={errors.authorName?.message}
            />
            
            <Input
              label="Email (optional)"
              type="email"
              placeholder="your@email.com"
              {...register('authorEmail', {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
                maxLength: {
                  value: 100,
                  message: 'Email cannot exceed 100 characters',
                },
              })}
              error={errors.authorEmail?.message}
              helperText="We'll never share your email address"
            />
          </div>
          
          <Textarea
            label="Comment *"
            placeholder="Share your thoughts..."
            rows={4}
            {...register('content', {
              required: 'Comment is required',
              minLength: {
                value: 1,
                message: 'Comment cannot be empty',
              },
              maxLength: {
                value: 500,
                message: 'Comment cannot exceed 500 characters',
              },
            })}
            error={errors.content?.message}
            helperText={`${register('content').name ? 'content'.length : 0}/500 characters`}
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isSubmitting || loading}
              disabled={!isValid || isSubmitting || loading}
              className="flex items-center gap-2"
            >
              <Send size={16} />
              Post Comment
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default CommentForm;