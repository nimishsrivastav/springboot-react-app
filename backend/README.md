# Blog App : A Java Spring Boot App

## Complete API Endpoints

#### Blog Post
| HTTP Verb   | Endpoint                         | Remarks                              |
| ----------- | -------------------------------- | ------------------------------------ |
| GET         | /api/v1/posts                    | Get all posts (paginated)            |
| GET         | /api/v1/posts/published          | Get published posts                  |
| GET         | /api/v1/posts/{id}               | Get post by ID (increments views)    |
| GET         | /api/v1/posts/slug/{slug}        | Get post by slug                     |
| GET         | /api/v1/posts/author/{author}    | Get posts by author                  |
| GET         | /api/v1/posts/search?keyword=x   | Search posts                         |
| GET         | /api/v1/posts/tags?tags=x,y      | Get posts by tags                    |
| GET         | /api/v1/posts/tags/all           | Get all available tags               |
| GET         | /api/v1/posts/status/{status}    | Get posts by status                  |
| POST        | /api/v1/posts                    | Create new post                      |
| PUT         | /api/v1/posts/{id}               | Update post                          |
| PATCH       | /api/v1/posts/{id}/publish       | Publish post                         |
| PATCH       | /api/v1/posts/{id}/archive       | Archive post                         |
| DELETE      | /api/v1/posts/{id}               | Delete post                          |
| GET         | /api/v1/posts/stats/count        | Get post count by status             |

#### Comments
| HTTP Verb   | Endpoint                                | Remarks                       |
| ----------- | --------------------------------------- | ----------------------------- |
| GET         | /api/v1/comments/posts/{postId}         | Get comments for post         |
| GET         | /api/v1/comments/{id}                   | Get comment by ID             |
| POST        | /api/v1/comments/posts/{postId}         | Create comment                |
| PUT         | /api/v1/comments/{id}                   | Update comment                |
| DELETE      | /api/v1/comments/{id}                   | Delete comment                |
| GET         | /api/v1/comments/post/{postId}/count    | Get comment count             |


### Core Design Patterns Implemented
- **Dependency Injection** - Constructor injection throughout
- **Repository Pattern** - Custom queries with JPA repositories
- **Service Layer Pattern** - Interface-based services with implementations
- **DTO Pattern** - Data transfer objects with MapStruct mapping
- **Builder Pattern** - For complex object construction
- **Specification Pattern** - Dynamic query building
- **Observer Pattern** - Event-driven architecture

### Enterprise Features
- **Comprehensive CRUD Operations** - Full blog post and comment management
- **Advanced Search & Filtering** - By keyword, author, tags, status
- **Caching Strategy** - Multi-level caching with Redis support
- **Global Exception Handling** - Centralized error management
- **API Documentation** - Swagger/OpenAPI integration
- **Database Optimization** - Indexing and query optimization
- **Testing Suite** - Unit and integration tests
- **Monitoring & Metrics** - Health checks and custom metrics
- **Security** - Input validation and rate limiting
- **Docker Support** - Containerization and orchestration