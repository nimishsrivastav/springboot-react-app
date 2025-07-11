import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Save, Eye, ArrowLeft, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCreatePost } from '../hooks/useBlogPosts';
import { CreateBlogPostRequest, PostStatus } from '../types';
import { generateSlug } from '../utils';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';

interface CreatePostFormData {
  title: string;
  content: string;
  author: string;
  summary: string;
  status: PostStatus;
  tags: string;
}

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const createPostMutation = useCreatePost();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePostFormData>({
    mode: 'onChange',
    defaultValues: {
      status: PostStatus.DRAFT,
    },
  });

  const watchedContent = watch('content');
  const watchedTitle = watch('title');

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      const postData: CreateBlogPostRequest = {
        title: data.title.trim(),
        content: data.content.trim(),
        author: data.author.trim(),
        summary: data.summary?.trim() || undefined,
        status: data.status,
        tags: tags,
      };

      const result = await createPostMutation.mutateAsync(postData);
      navigate(`/posts/${result.slug || result.id}`);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-primary">Create New Post</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2"
            >
              <Eye size={16} />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {!isPreview ? (
              /* Edit Mode */
              <Card>
                <CardBody>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title */}
                    <Input
                      label="Title *"
                      placeholder="Enter your post title..."
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 5,
                          message: 'Title must be at least 5 characters',
                        },
                        maxLength: {
                          value: 100,
                          message: 'Title cannot exceed 100 characters',
                        },
                      })}
                      error={errors.title?.message}
                    />

                    {/* Generated Slug Preview */}
                    {watchedTitle && (
                      <div className="text-sm text-muted">
                        URL slug: <code className="bg-gray-100 px-2 py-1 rounded">{generateSlug(watchedTitle)}</code>
                      </div>
                    )}

                    {/* Author */}
                    <Input
                      label="Author *"
                      placeholder="Your name"
                      {...register('author', {
                        required: 'Author is required',
                        minLength: {
                          value: 2,
                          message: 'Author name must be at least 2 characters',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Author name cannot exceed 50 characters',
                        },
                      })}
                      error={errors.author?.message}
                    />

                    {/* Summary */}
                    <Textarea
                      label="Summary (optional)"
                      placeholder="Brief description of your post..."
                      rows={3}
                      {...register('summary', {
                        maxLength: {
                          value: 200,
                          message: 'Summary cannot exceed 200 characters',
                        },
                      })}
                      error={errors.summary?.message}
                      helperText="This will be shown in post previews and search results"
                    />

                    {/* Content */}
                    <Textarea
                      label="Content * (Markdown supported)"
                      placeholder="Write your post content using Markdown..."
                      rows={15}
                      {...register('content', {
                        required: 'Content is required',
                        minLength: {
                          value: 10,
                          message: 'Content must be at least 10 characters',
                        },
                      })}
                      error={errors.content?.message}
                      className="font-mono"
                    />

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Tags
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={addTag}
                            disabled={!tagInput.trim()}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                        
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:text-blue-600"
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">
                        Status
                      </label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="input"
                          >
                            <option value={PostStatus.DRAFT}>Draft</option>
                            <option value={PostStatus.PUBLISHED}>Published</option>
                          </select>
                        )}
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/posts')}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        loading={createPostMutation.isPending}
                        disabled={!isValid || createPostMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save size={16} />
                        Create Post
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            ) : (
              /* Preview Mode */
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-primary">Preview</h2>
                </CardHeader>
                <CardBody>
                  <article className="prose prose-lg max-w-none">
                    <h1>{watchedTitle || 'Your Post Title'}</h1>
                    <ReactMarkdown>{watchedContent || 'Your content will appear here...'}</ReactMarkdown>
                  </article>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Writing Tips */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary">Writing Tips</h3>
                </CardHeader>
                <CardBody className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-primary mb-1">Markdown Support</h4>
                    <p className="text-secondary">Use Markdown for formatting. Headers (#), bold (**text**), italic (*text*), links, and lists are supported.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">SEO Best Practices</h4>
                    <p className="text-secondary">Write compelling titles and summaries. Use relevant tags to help readers discover your content.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary mb-1">Engagement</h4>
                    <p className="text-secondary">Ask questions, share personal experiences, and encourage comments to boost engagement.</p>
                  </div>
                </CardBody>
              </Card>

              {/* Markdown Reference */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary">Markdown Reference</h3>
                </CardHeader>
                <CardBody className="space-y-2 text-sm font-mono">
                  <div># Heading 1</div>
                  <div>## Heading 2</div>
                  <div>**Bold text**</div>
                  <div>*Italic text*</div>
                  <div>[Link](http://example.com)</div>
                  <div>- List item</div>
                  <div>&gt; Blockquote</div>
                  <div>`Inline code`</div>
                </CardBody>
              </Card>

              {/* Post Stats */}
              {watchedContent && (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary">Post Statistics</h3>
                  </CardHeader>
                  <CardBody className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary">Words:</span>
                      <span className="font-medium">{watchedContent.split(/\s+/).filter(word => word.length > 0).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Characters:</span>
                      <span className="font-medium">{watchedContent.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Reading time:</span>
                      <span className="font-medium">~{Math.ceil(watchedContent.split(/\s+/).length / 200)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Tags:</span>
                      <span className="font-medium">{tags.length}</span>
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

export default CreatePostPage;