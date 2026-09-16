# Order Management API

A backend RESTful API for an order management system built with the modern Node.js ecosystem.

This project is designed as a learning and portfolio project focused on building a backend system from the ground up, covering database transactions, authentication, caching, background jobs, API security, testing, containerization, observability, CI/CD, and performance optimization.

---

## Tech Stack

### Core

- **Node.js**
- **TypeScript**
- **Fastify**

### Database

- **PostgreSQL**
- **Prisma ORM**

### Caching & Performance

- **Redis**
- **ioredis**

### Background Processing

- **BullMQ**
- **Redis**

### Security & Validation

- **Zod**
- **Argon2**
- **Helmet**
- **CORS**
- **Rate Limiting**
- **JWT**

### Testing

- **Vitest**

### DevOps

- **Docker**
- **Docker Compose**
- **GitHub Actions**

### Observability

- **Pino**
- **Request ID**
- **Prometheus**
- **Grafana**
- **OpenTelemetry**

### Performance Testing

- **k6**

---
## System Architecture

The application follows a backend-centered architecture where the Fastify application acts as the main entry point for HTTP requests.

```text
                         ┌─────────────────────┐
                         │  Client / Frontend  │
                         └──────────┬──────────┘
                                    │
                              HTTP Request
                                    │
                                    ▼
              ┌────────────────────────────────────────┐
              │           CORE APPLICATION             │
              │                                        │
              │  ┌──────────────────────────────────┐  │
              │  │       Fastify API Gateway         │  │
              │  │                                  │  │
              │  │ Request ID + Pino Logger         │  │
              │  └───────────────┬──────────────────┘  │
              │                  │                     │
              │        ┌─────────┴─────────┐           │
              │        ▼                   ▼           │
              │  ┌───────────┐      ┌─────────────┐   │
              │  │   Redis   │      │ PostgreSQL  │   │
              │  │   Cache   │      │   + Prisma  │   │
              │  └───────────┘      └─────────────┘   │
              │                                        │
              └──────────────────┬─────────────────────┘
                                 │
                           Async Job
                                 │
                                 ▼
                       ┌──────────────────┐
                       │  BullMQ Queue    │
                       └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Background       │
                       │ Workers          │
                       └──────────────────┘

Request Flow

Client
  │
  ▼
Fastify
  │
  ├── Redis Cache
  │
  ├── PostgreSQL
  │
  └── BullMQ
         │
         ▼
   Background Worker
Main Features
Authentication & Authorization
User registration

User login

Password hashing

JWT authentication

Refresh token

Logout / token invalidation

Role-based authorization

Example roles:


USER
 ├── Browse products
 ├── Manage cart
 ├── Create orders
 └── View own orders

ADMIN
 ├── Manage products
 ├── View orders
 └── Update order status
Product Management
RESTful Product API:

http

GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
Supported features:

CRUD operations

Pagination

Filtering

Sorting

Search

Database indexing

Example:

http

GET /api/v1/products?page=1&limit=20
http

GET /api/v1/products?category=keyboard
http

GET /api/v1/products?sort=price_desc

Cart
The Cart module handles:

Adding products to cart

Updating cart quantities

Removing cart items

Inventory validation

Cart retrieval

Database structure:


User
 │
 └── Cart
      │
      └── CartItem
             │
             └── Product
Order Management
Orders are created using database transactions to maintain data consistency.

Order lifecycle:


PENDING
   │
   ▼
PAID
   │
   ▼
PROCESSING
   │
   ▼
SHIPPED
   │
   ▼
COMPLETED
Order creation flow:


Create Order
     │
     ├── Create Order
     │
     ├── Create Order Items
     │
     └── Reduce Product Stock
              │
              ▼
           COMMIT
If one operation fails:


ROLLBACK
This prevents partially completed order transactions.

Redis Caching
Redis is used to reduce unnecessary database queries and improve API response performance.

Cache-Aside Pattern

                 Request
                    │
                    ▼
                  Redis
                 /     \
              HIT       MISS
               │          │
               ▼          ▼
            Return     PostgreSQL
                          │
                          ▼
                        Redis
                          │
                          ▼
                       Response
The caching layer includes:

Product caching

Cache TTL

Cache expiration

Cache invalidation

Rate limiting

Background Jobs
BullMQ is used for asynchronous processing.

Instead of performing long-running tasks during the HTTP request, the API can create a background job.


POST /orders
      │
      ▼
Create Order
      │
      ▼
Add Job to BullMQ
      │
      ▼
HTTP 201 Created
The background process continues separately:


BullMQ Queue
     │
     ▼
Worker
     │
     ├── Process Order
     │
     └── Send Notification
Planned queue features:

Order processing jobs

Email notification jobs

Retry mechanism

Failed jobs

Job monitoring

Idempotency

API Validation & Error Handling
The API uses Zod for request and response validation.

Success Response
JSON

{
  "success": true,
  "data": {},
  "message": "Product retrieved successfully"
}
Error Response
JSON

{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
The API also aims to provide:

Centralized error handling

Consistent response format

Proper HTTP status codes

API versioning

Example:


/api/v1/products
/api/v1/orders
/api/v1/auth
Database Design
The core database consists of the following entities:


User
 │
 ├── Cart
 │     │
 │     └── CartItem
 │            │
 │            └── Product
 │
 └── Order
       │
       └── OrderItem
              │
              └── Product
Main tables:


User
Product
Cart
CartItem
Order
OrderItem
Database concepts implemented throughout the project include:

Relational database design

Foreign keys

Constraints

Indexing

Prisma migrations

Database seeding

Transactions

Connection poolingSecurity
The API includes several security mechanisms:

JWT authentication

Argon2 password hashing

Role-based authorization

Request validation

CORS configuration

Security headers

Rate limiting

Secrets through environment variables

Audit logging

Security development also covers common API vulnerabilities and secure authentication practices.

Testing
Testing is implemented using Vitest.

Testing layers:


Unit Tests
     │
     ▼
Service Tests
     │
     ▼
Repository Tests
     │
     ▼
Integration Tests
     │
     ▼
E2E Tests
The testing roadmap includes:

Unit testing

Service testing

Repository testing

API integration testing

Authentication testing

Database transaction testing

Redis testing

Queue testing

End-to-end testing

Run the test suite:

Bash

npm run test:run
Run tests in watch mode:

Bash

npm test
Docker
The project is designed to run using Docker Compose.

Development infrastructure:


┌─────────────────────────────────────────┐
│              Docker Compose             │
│                                         │
│   ┌─────────┐   ┌───────────────┐       │
│   │   API   │   │   PostgreSQL  │       │
│   └─────────┘   └───────────────┘       │
│                                         │
│   ┌─────────┐                           │
│   │  Redis  │                           │
│   └─────────┘                           │
│                                         │
└─────────────────────────────────────────┘
The project separates environments into:


development
test
production
Docker-related goals include:

Dockerfile

Docker Compose

Environment separation

Health checks

Graceful shutdown

Environment Variables
Create a .env file based on .env.example.

Example:

env

NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://postgres:password@localhost:5432/order_db?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_super_secret_jwt_key
When running the application entirely through Docker Compose, service names can be used instead of localhost:

env

DATABASE_URL="postgresql://postgres:password@postgres:5432/order_db?schema=public"

REDIS_HOST=redis
REDIS_PORT=6379
Never commit real secrets or production credentials to the repository.

Getting Started
Prerequisites
Make sure you have:

Node.js

npm

Docker

Docker Compose

1. Clone the repository
Bash

git clone https://github.com/ssasasalmaa/order-management-api.git
cd order-management-api
2. Install dependencies
Bash

npm install
3. Configure environment variables
Create:


.env
based on:


.env.example
4. Run database migrations
Bash

npx prisma migrate dev
5. Seed the database
Bash

npx prisma db seed
6. Start the development server
Bash

npm run dev
The API will be available at:


http://localhost:3000
Running with Docker
Build and start the application:

Bash

docker compose up --build
Run in detached mode:

Bash

docker compose up -d --build
Stop the containers:

Bash

docker compose down

API Documentation
Swagger / OpenAPI documentation is available at:


http://localhost:3000/docs
The documentation provides an interactive interface for exploring and testing the API endpoints.

## Performance & Load Testing

The API is benchmarked using **Autocannon** to measure throughput and latency under concurrent connections.

### Benchmark Configuration

```text
Tool        : Autocannon
Connections : 100
Duration    : 30 seconds
Endpoint    : GET /api/products

Benchmark Result
| Metric             |      Result |
| ------------------ | ----------: |
| Total Requests     |     ~53,000 |
| Average Throughput | 1,763 req/s |
| Average Latency    |    56.63 ms |
| Median Latency     |       46 ms |
| p97.5 Latency      |      138 ms |
| p99 Latency        |      166 ms |
| Maximum Latency    |    1,490 ms |
| Data Transferred   |     97.3 MB |


The benchmark was performed against the product endpoint with 100 concurrent connections for approximately 30 seconds.

The current benchmark provides a baseline for further performance analysis, particularly for comparing direct PostgreSQL queries against Redis cache HIT scenarios.

```markdown
## Observability

The application includes an observability stack for monitoring application behavior, request performance, and system metrics.

### OpenTelemetry

OpenTelemetry is used to instrument the application and trace request execution across different components.

The instrumentation covers the request lifecycle from the API layer through backend operations and asynchronous processing.

```text
Request
   │
   ▼
Fastify API
   │
   ├── Service
   │
   ├── PostgreSQL
   │
   └── BullMQ
         │
         ▼
      Worker

Prometheus
The application exposes a /metrics endpoint for collecting application metrics.

Collected metrics include:

HTTP request duration

Request metrics

Active connections

Error rates

System resource metrics

```markdown
## CI/CD

The project uses **GitHub Actions** to automate the development and verification pipeline.

Every `git push` triggers the CI workflow.

Pipeline:

```text
Git Push
   │
   ▼
Lint
   │
   ▼
Type Check
   │
   ▼
Vitest
   │
   ▼
Build
   │
   ▼
Docker Build
The CI workflow performs:

ESLint and TypeScript type checking

Unit and integration tests using Vitest

PostgreSQL and Redis service containers

Application build verification

Docker image build verification


```markdown
## End-to-End Testing

The project includes End-to-End testing to validate the complete application flow across multiple modules.

The E2E scenario covers:

```text
Register
   ↓
Login
   ↓
Receive JWT
   ↓
Browse Products
   ↓
Add Product to Cart
   ↓
Checkout
   ↓
Database Transaction
   ↓
BullMQ Job
   ↓
Background Worker
   ↓
Order Processing
   ↓
Final Order Status
This validates the interaction between authentication, product management, cart, order processing, PostgreSQL transactions, Redis, and BullMQ.

```markdown
# Project Roadmap

## Phase 1 — Project & Backend Foundation

- [x] Define application requirements and scope
- [x] Setup GitHub repository
- [x] Setup Node.js + TypeScript
- [x] Setup Fastify
- [x] Project structure
- [x] Environment configuration
- [x] ESLint + Prettier
- [x] Git hooks / development workflow

## Phase 2 — PostgreSQL & Database Design

- [x] PostgreSQL setup
- [x] Prisma ORM
- [x] Database schema
- [x] Entity relationships
- [x] Migration
- [x] Database seeding
- [x] Indexing
- [x] Database constraints
- [x] ACID transactions

## Phase 3 — Authentication & Authorization

- [x] Registration
- [x] Login
- [x] Argon2 password hashing
- [x] JWT authentication
- [x] Authentication middleware
- [x] Role-based authorization
- [x] Refresh token
- [x] Logout / token invalidation

## Phase 4 — REST API

- [x] Product CRUD
- [x] Pagination
- [x] Filtering
- [x] Sorting
- [x] Search
- [x] Cart API
- [x] Order API
- [x] Order status lifecycle

## Phase 5 — Validation & API Quality

- [x] Request validation
- [x] Response validation
- [x] Standardized response format
- [x] Centralized error handling
- [x] API versioning
- [x] Proper HTTP status codes

## Phase 6 — Redis

- [x] Redis setup
- [x] Redis caching
- [x] Cache-aside pattern
- [x] Cache TTL
- [x] Cache invalidation
- [x] Redis rate limiting
- [x] Performance benchmarking

## Phase 7 — Background Jobs & Queue

- [x] BullMQ setup
- [x] Redis queue
- [x] Background workers
- [x] Order processing jobs
- [x] Email notification jobs
- [x] Retry mechanism
- [x] Failed job handling
- [x] Job monitoring
- [x] Idempotency

## Phase 8 — Security

- [x] Rate limiting
- [x] CORS
- [x] Security headers
- [x] Input sanitization
- [x] JWT security
- [x] Password policy
- [x] API vulnerability prevention
- [x] Secrets management
- [x] Audit logging

## Phase 9 — Testing

- [x] Vitest
- [x] Unit testing
- [x] Service testing
- [x] Repository testing
- [x] API integration testing
- [x] Authentication testing
- [x] Database transaction testing
- [x] Redis testing
- [x] Queue testing
- [x] E2E testing

## Phase 10 — Docker

- [x] Dockerfile
- [x] Docker Compose
- [x] Environment separation
- [x] Development environment
- [x] Test environment
- [x] Production environment
- [x] Health checks
- [x] Graceful shutdown

## Phase 11 — Observability

- [x] Structured logging with Pino
- [x] Request ID
- [x] Metrics
- [x] OpenTelemetry
- [x] Distributed tracing
- [x] Prometheus
- [x] Grafana

## Phase 12 — CI/CD

- [x] GitHub Actions
- [x] Lint
- [x] Type checking
- [x] Automated tests
- [x] Build verification
- [x] Docker build
- [x] Deployment pipeline

## Phase 13 — Performance

- [x] Database indexing analysis
- [x] Query optimization
- [x] Redis performance comparison
- [x] API load testing
- [x] Autocannon benchmarking
- [x] k6 performance testing

## Phase 14 — Documentation

- [x] System architecture diagram
- [x] Database ERD
- [x] API documentation
- [x] Swagger / OpenAPI
- [x] Setup documentation
- [x] Architecture decisions
- [x] Performance results
- [x] Final README
