# CodeAssess Microservices Architecture Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Service Communication](#service-communication)
3. [Data Flow](#data-flow)
4. [Security Architecture](#security-architecture)
5. [Scalability](#scalability)
6. [Monitoring & Observability](#monitoring--observability)

## Architecture Overview

### Design Principles

1. **Single Responsibility**: Each service handles one domain
2. **Loose Coupling**: Services are independently deployable
3. **High Cohesion**: Related functionality is grouped together
4. **API Gateway Pattern**: Single entry point for clients
5. **Database per Service**: Each service owns its data

### Service Boundaries

```
┌──────────────────────────────────────────────────────────────┐
│                        API GATEWAY                            │
│                     (Port 3000)                               │
│  Responsibilities:                                            │
│  - Request routing                                            │
│  - Load balancing                                             │
│  - Rate limiting                                              │
│  - Authentication forwarding                                  │
│  - Service discovery                                          │
└──────────────────┬───────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌────────────────┐    ┌────────────────┐
│  Auth Service  │◄───│  Other Services │
│  (Port 3001)   │    │  (3002-3005)    │
└────────────────┘    └────────────────┘
```

## Service Communication

### Synchronous Communication (HTTP/REST)

Services communicate via REST APIs:
- **Auth Service Verification**: Other services call Auth Service to verify tokens
- **Inter-service Data Fetch**: Services can query each other for data

```javascript
// Example: Job Service verifying user with Auth Service
const response = await axios.post(
  `${AUTH_SERVICE_URL}/api/auth/verify`,
  {},
  { headers: { Authorization: token } }
);
```

### Authentication Flow

```
1. Client → API Gateway: Login request
2. API Gateway → Auth Service: Forward request
3. Auth Service: Verify credentials, generate JWT
4. Auth Service → API Gateway: Return JWT + Refresh Token
5. API Gateway → Client: Forward tokens

Subsequent Requests:
1. Client → API Gateway: Request with JWT in header
2. API Gateway → Target Service: Forward with JWT
3. Target Service → Auth Service: Verify JWT
4. Auth Service → Target Service: Return user data
5. Target Service: Process request
6. Target Service → API Gateway → Client: Return response
```

## Data Flow

### Job Application Flow

```
1. Candidate browses jobs (Job Service)
2. Candidate applies (Application Service creates application)
3. Application Service validates:
   - Job exists (Job Service)
   - Candidate profile exists (Candidate Service)
4. Application stored in Application DB
5. Admin reviews application (Application Service)
6. Admin may send assessment (Assessment Service)
7. Candidate takes assessment (Assessment Service)
8. Results stored and candidate notified
```

### Assessment Flow

```
1. Admin creates assessment (Assessment Service)
2. Admin assigns to candidate
3. Candidate starts assessment (creates attempt)
4. Candidate submits answers
5. System auto-scores objective questions
6. Results available to admin and candidate
```

## Security Architecture

### Authentication & Authorization

#### JWT Token Structure
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "admin|candidate",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### Security Layers

1. **API Gateway Layer**
   - Rate limiting
   - CORS policies
   - Request validation
   - Helmet security headers

2. **Service Layer**
   - Token verification
   - Role-based access control
   - Input validation (Joi)
   - Error handling

3. **Database Layer**
   - Password hashing (bcrypt)
   - Data encryption at rest
   - Connection security

### Security Best Practices

1. **Secrets Management**: Environment variables, never in code
2. **Least Privilege**: Services only access what they need
3. **Defense in Depth**: Multiple security layers
4. **Token Expiry**: Short-lived access tokens (7 days)
5. **Refresh Tokens**: Long-lived but revocable (30 days)
6. **Rate Limiting**: Prevent abuse and DDoS

## Scalability

### Horizontal Scaling

Each service can be scaled independently:

```bash
# Scale job service to 3 instances
docker-compose up -d --scale job-service=3

# Load balancer automatically distributes requests
```

### Database Scaling

1. **Read Replicas**: For read-heavy services
2. **Sharding**: For large datasets
3. **Indexing**: Optimize query performance
4. **Connection Pooling**: Efficient resource usage

### Caching Strategy

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     ▼
┌────────────┐
│   Redis    │  ← Cache frequently accessed data
│   Cache    │
└────┬───────┘
     │ (miss)
     ▼
┌────────────┐
│  Service   │
└────┬───────┘
     │
     ▼
┌────────────┐
│  Database  │
└────────────┘
```

### Performance Optimization

1. **Database Indexes**: On frequently queried fields
2. **Pagination**: Limit data returned
3. **Connection Pooling**: Reuse database connections
4. **Async Operations**: Non-blocking I/O
5. **Query Optimization**: Efficient aggregations

## Monitoring & Observability

### Health Checks

Each service exposes `/health` endpoint:

```json
{
  "status": "ok",
  "service": "auth-service",
  "uptime": 12345,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Logging Strategy

1. **Request Logging**: All requests logged at gateway
2. **Error Logging**: Errors with stack traces
3. **Audit Logging**: Security-relevant events
4. **Structured Logging**: JSON format for analysis

### Metrics to Monitor

1. **Service Metrics**
   - Request rate
   - Error rate
   - Response time
   - Success rate

2. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O

3. **Business Metrics**
   - User registrations
   - Job applications
   - Assessment completions
   - Active users

### Alerting

Set up alerts for:
- Service downtime
- High error rates (>5%)
- Slow response times (>2s p95)
- Database connection issues
- High memory usage (>80%)

## Future Enhancements

### Event-Driven Architecture

Add message queue (RabbitMQ/Kafka) for:
- Async notifications
- Event sourcing
- Better decoupling

```
Service A → Message Queue → Service B
                ↓
            Event Log
```

### Service Mesh (Istio/Linkerd)

Benefits:
- Traffic management
- Security (mTLS)
- Observability
- Resilience

### API Versioning

Support multiple API versions:
```
/api/v1/jobs
/api/v2/jobs
```

### Circuit Breaker Pattern

Prevent cascading failures:
```javascript
if (failureCount > threshold) {
  return cachedResponse;
}
```

### Distributed Tracing

Track requests across services:
- Jaeger
- Zipkin
- OpenTelemetry

---

**This architecture is designed to be:**
- ✅ Scalable
- ✅ Maintainable
- ✅ Secure
- ✅ Resilient
- ✅ Observable

