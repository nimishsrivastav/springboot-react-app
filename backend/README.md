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

### Database Quick Start Guide
1. Navigate to the backend directory
```
cd backend
```

2. Start Database only
```
# Start PostgreSQL container only
docker-compose up postgres -d
```

3. Start both Database and Application
```
# Start both PostgreSQL and Spring Boot application
docker-compose up -d

# Or build and start (if you made code changes)
docker-compose up -d --build
```

### Container Management
1. Starting Service:
```
# Start all services in background
docker-compose up -d

# Start specific service
docker-compose up postgres -d
docker-compose up backend -d

# Start with logs visible
docker-compose up

# Build and start (after code changes)
docker-compose up -d --build
```

2. Stopping Service:
```
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop postgres
docker-compose stop backend

# Stop and remove volumes (⚠️ DELETES ALL DATA)
docker-compose down -v
```

3. Checking Status:
```
# Check container status
docker-compose ps

# Check logs
docker-compose logs
docker-compose logs postgres
docker-compose logs backend
docker-compose logs -f backend  # Follow logs

# Check resource usage
docker stats blogapp-postgres blogapp-backend
```

### Database Operations
1. Connecting to Database:
```
# Connect to PostgreSQL container
docker exec -it blogapp-postgres psql -U bloguser -d blogdb
```

2. Database Commands (inside psql):
```
-- List all tables
\dt

-- Describe table structure
\d blog_posts
\d comments

-- View table data
SELECT * FROM blog_posts;
SELECT * FROM comments;

-- Count records
SELECT COUNT(*) FROM blog_posts;
SELECT COUNT(*) FROM comments;

-- Show database size
SELECT pg_size_pretty(pg_database_size('blogdb'));

-- List all databases
\l

-- Exit psql
\q
```

3. One-liner Database Commands:
```
# List all tables
docker exec blogapp-postgres psql -U bloguser -d blogdb -c "\dt"

# Show blog_posts structure
docker exec blogapp-postgres psql -U bloguser -d blogdb -c "\d blog_posts"

# Count blog posts
docker exec blogapp-postgres psql -U bloguser -d blogdb -c "SELECT COUNT(*) FROM blog_posts;"

# View recent posts
docker exec blogapp-postgres psql -U bloguser -d blogdb -c "SELECT id, title, author, created_at FROM blog_posts ORDER BY created_at DESC LIMIT 5;"
```

### Database Management
1. Backup Database:
```
# Restore from SQL file
docker exec -i blogapp-postgres psql -U bloguser -d blogdb < backup.sql

# Restore from custom format
docker exec blogapp-postgres pg_restore -U bloguser -d blogdb backup.dump
```

2. Reset Database:
```
# ⚠️ WARNING: This will delete all data
docker-compose down -v
docker-compose up postgres -d
```

### Health Checks & Troubleshooting
1. Application Health:
```
# Check Spring Boot health
curl http://localhost:8080/actuator/health

# Check API endpoints
curl http://localhost:8080/api/v1/posts

# Access Swagger UI
open/start http://localhost:8080/swagger-ui.html (open for linux, start for windows)
```

2. Database Health:
```
# Check PostgreSQL is responding
docker exec blogapp-postgres pg_isready -U bloguser -d blogdb

# Test connection
docker exec blogapp-postgres psql -U bloguser -d blogdb -c "SELECT version();"
```

#### Common Issues
1. Container won't start:
```
# Check logs
docker-compose logs postgres

# Check if port is in use
netstat -an | grep/findstr 5432
lsof -i :5432

# Remove and recreate
docker-compose down
docker-compose up postgres -d
```

2. Application Can't Connect to Database:
```
# Check if containers are on same network
docker network ls
docker network inspect backend_blogapp-network

# Verify environment variables
docker exec blogapp-backend env | grep/findstr SPRING
```

3. Health Check Failing:
```
# Check application logs
docker-compose logs backend

# Test manually
curl -v http://localhost:8080/actuator/health
```