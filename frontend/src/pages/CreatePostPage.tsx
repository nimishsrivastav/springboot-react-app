import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Save, Eye, ArrowLeft, Plus, X, FileText, User, Tag as TagIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useCreatePost } from '../hooks/useBlogPosts';
import { CreateBlogPostRequest, PostStatus } from '../types';
import { generateSlug } from '../utils';
import { Container, Row, Col, Card, Form, Button as BootstrapButton, InputGroup, Badge, Alert } from 'react-bootstrap';

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
  const watchedSummary = watch('summary');

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

  const titleLength = watchedTitle?.length || 0;
  const summaryLength = watchedSummary?.length || 0;
  const contentLength = watchedContent?.length || 0;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white border-bottom sticky-top" style={{ zIndex: 1020 }}>
        <Container className="py-3">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-3">
                <BootstrapButton
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                  className="d-flex align-items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </BootstrapButton>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center bg-primary text-white rounded"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="mb-0 fw-bold">Create New Post</h4>
                    <small className="text-muted">Share your thoughts with the world</small>
                  </div>
                </div>
              </div>
            </Col>
            <Col className="col-auto">
              <div className="d-flex gap-2">
                <BootstrapButton
                  variant="outline-primary"
                  onClick={() => setIsPreview(!isPreview)}
                  className="d-flex align-items-center gap-2"
                >
                  <Eye size={16} />
                  {isPreview ? 'Edit' : 'Preview'}
                </BootstrapButton>
                
                <BootstrapButton
                  variant="primary"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid || createPostMutation.isPending}
                  className="d-flex align-items-center gap-2"
                >
                  {createPostMutation.isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create Post
                    </>
                  )}
                </BootstrapButton>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {!isPreview ? (
              /* Edit Mode */
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Post Details Section */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <FileText size={20} className="text-primary" />
                        <h5 className="mb-0 fw-bold">Post Details</h5>
                      </div>

                      {/* Title */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          size="lg"
                          type="text"
                          placeholder="Enter an engaging title for your post..."
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
                          isInvalid={!!errors.title}
                          className="fw-medium"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title?.message}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          {titleLength}/100 characters
                        </Form.Text>
                      </Form.Group>

                      {/* URL Preview */}
                      {watchedTitle && (
                        <Alert variant="info" className="mb-4">
                          <strong>URL Preview:</strong>{' '}
                          <code>/posts/{generateSlug(watchedTitle)}</code>
                        </Alert>
                      )}

                      {/* Author and Status Row */}
                      <Row className="mb-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              Author <span className="text-danger">*</span>
                            </Form.Label>
                            <InputGroup>
                              <InputGroup.Text>
                                <User size={16} />
                              </InputGroup.Text>
                              <Form.Control
                                type="text"
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
                                isInvalid={!!errors.author}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.author?.message}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Status</Form.Label>
                            <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <Form.Select {...field}>
                                  <option value={PostStatus.DRAFT}>🔒 Save as Draft</option>
                                  <option value={PostStatus.PUBLISHED}>🌐 Publish Immediately</option>
                                </Form.Select>
                              )}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      {/* Summary */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          Summary <span className="text-muted fw-normal">(optional)</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Write a brief, compelling summary of your post..."
                          {...register('summary', {
                            maxLength: {
                              value: 200,
                              message: 'Summary cannot exceed 200 characters',
                            },
                          })}
                          isInvalid={!!errors.summary}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.summary?.message}
                        </Form.Control.Feedback>
                        <div className="d-flex justify-content-between">
                          <Form.Text className="text-muted">
                            This will be shown in post previews and search results
                          </Form.Text>
                          <small className="text-muted">{summaryLength}/200 characters</small>
                        </div>
                      </Form.Group>
                    </div>

                    {/* Tags Section */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <TagIcon size={20} className="text-primary" />
                        <h5 className="mb-0 fw-bold">Tags</h5>
                      </div>

                      <Form.Group className="mb-3">
                        <InputGroup>
                          <InputGroup.Text>
                            <TagIcon size={16} />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            placeholder="Add a tag (e.g., technology, tutorial, tips)..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                          />
                          <BootstrapButton
                            variant="primary"
                            onClick={addTag}
                            disabled={!tagInput.trim()}
                          >
                            <Plus size={16} className="me-1" />
                            Add
                          </BootstrapButton>
                        </InputGroup>
                      </Form.Group>

                      {tags.length > 0 && (
                        <div>
                          <small className="text-muted mb-2 d-block">Added tags:</small>
                          <div className="d-flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Badge
                                key={tag}
                                bg="primary"
                                className="d-flex align-items-center gap-1 px-3 py-2"
                                style={{ fontSize: '0.875rem' }}
                              >
                                <TagIcon size={12} />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="btn-close btn-close-white ms-2"
                                  style={{ fontSize: '0.7rem' }}
                                  aria-label="Remove tag"
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <FileText size={20} className="text-primary" />
                        <h5 className="mb-0 fw-bold">Content</h5>
                      </div>

                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Post Content <span className="text-danger">*</span>
                          <Badge bg="secondary" className="ms-2">Markdown Supported</Badge>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={20}
                          placeholder={`# Your Post Title

Write your amazing content here using Markdown formatting...

## Subheading

You can use:
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- \`Code blocks\`
- Lists and more!

Happy writing! 🚀`}
                          {...register('content', {
                            required: 'Content is required',
                            minLength: {
                              value: 10,
                              message: 'Content must be at least 10 characters',
                            },
                          })}
                          isInvalid={!!errors.content}
                          style={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '14px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.content?.message}
                        </Form.Control.Feedback>
                        <div className="d-flex justify-content-between">
                          <Form.Text className="text-muted">
                            Write your post content using Markdown formatting
                          </Form.Text>
                          <small className="text-muted">{contentLength} characters</small>
                        </div>
                      </Form.Group>
                    </div>

                    {/* Form Actions */}
                    <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                      <BootstrapButton
                        variant="outline-secondary"
                        onClick={() => navigate('/posts')}
                      >
                        Cancel
                      </BootstrapButton>
                      
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-muted">
                          {isValid ? (
                            <span className="text-success">
                              ✅ Ready to publish
                            </span>
                          ) : (
                            <span className="text-warning">
                              ⚠️ Please fill required fields
                            </span>
                          )}
                        </div>
                        <BootstrapButton
                          variant="primary"
                          type="submit"
                          disabled={!isValid || createPostMutation.isPending}
                          className="d-flex align-items-center gap-2"
                        >
                          {createPostMutation.isPending ? (
                            <>
                              <span className="spinner-border spinner-border-sm" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Save size={16} />
                              Create Post
                            </>
                          )}
                        </BootstrapButton>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              /* Preview Mode */
              <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex align-items-center gap-2">
                    <Eye size={20} />
                    <h5 className="mb-0">Post Preview</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <article>
                    <div className="mb-4">
                      <h1 className="display-6 fw-bold mb-3">
                        {watchedTitle || 'Your Post Title'}
                      </h1>
                      <div className="d-flex align-items-center gap-3 text-muted mb-3">
                        <div className="d-flex align-items-center gap-1">
                          <User size={16} />
                          <span>{watch('author') || 'Author Name'}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                        {tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="d-flex align-items-center gap-1">
                              <TagIcon size={16} />
                              <span>{tags.length} tag{tags.length !== 1 ? 's' : ''}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-4">
                          {tags.map((tag) => (
                            <Badge key={tag} bg="secondary" className="px-2 py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {watchedSummary && (
                        <div className="alert alert-light border-start border-primary border-4 mb-4">
                          <p className="mb-0 text-muted fst-italic">
                            {watchedSummary}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="content">
                      <ReactMarkdown>
                        {watchedContent || '*Your content will appear here...*'}
                      </ReactMarkdown>
                    </div>
                  </article>
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="d-flex flex-column gap-4">
                {/* Writing Tips */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0 fw-bold">✍️ Writing Tips</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <h6 className="fw-semibold mb-1">📝 Markdown Support</h6>
                        <small className="text-muted">
                          Use Markdown for rich formatting. Headers (#), bold (**text**), 
                          italic (*text*), links, and lists are all supported.
                        </small>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">🎯 SEO Best Practices</h6>
                        <small className="text-muted">
                          Write compelling titles and summaries. Use relevant tags to help 
                          readers discover your content.
                        </small>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">💡 Engagement</h6>
                        <small className="text-muted">
                          Ask questions, share personal experiences, and encourage 
                          comments to boost engagement.
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Quick Stats */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0 fw-bold">📊 Quick Stats</h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Title length:</small>
                        <small className="fw-medium">{titleLength}/100</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Summary length:</small>
                        <small className="fw-medium">{summaryLength}/200</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Content length:</small>
                        <small className="fw-medium">{contentLength} chars</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Tags:</small>
                        <small className="fw-medium">{tags.length}</small>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Estimated read:</small>
                        <small className="fw-medium">
                          ~{Math.max(1, Math.ceil(contentLength / 1000))} min
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Markdown Reference */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-light">
                    <h6 className="mb-0 fw-bold">📖 Markdown Reference</h6>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'Monaco, Consolas, monospace' }}>
                      <div className="mb-2">
                        <div className="fw-bold"># Heading 1</div>
                        <div className="text-muted">## Heading 2</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-muted">**Bold text**</div>
                        <div className="text-muted">*Italic text*</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-muted">[Link](https://example.com)</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-muted">- List item</div>
                        <div className="text-muted">1. Numbered list</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-muted">`Inline code`</div>
                      </div>
                      <div>
                        <div className="text-muted">```</div>
                        <div className="text-muted">Code block</div>
                        <div className="text-muted">```</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreatePostPage;