# Health Check API Documentation

This project includes comprehensive health check endpoints for monitoring application status, database connectivity, and system resources.

## Endpoints

### 1. Basic Health Check

**Endpoint:** `GET /api/health`

Returns the overall health status of the application including database connectivity.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "timestamp": "2024-11-17T09:45:00.000Z",
  "uptime": 3600.5,
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 15
    },
    "api": {
      "status": "up"
    }
  },
  "version": "0.1.0",
  "environment": "production"
}
```

**Response (503 Service Unavailable) when database is down:**

```json
{
  "status": "unhealthy",
  "timestamp": "2024-11-17T09:45:00.000Z",
  "uptime": 3600.5,
  "checks": {
    "database": {
      "status": "down",
      "error": "Connection refused"
    },
    "api": {
      "status": "up"
    }
  },
  "version": "0.1.0",
  "environment": "production"
}
```

**Status Codes:**

- `200` - Healthy
- `503` - Unhealthy (database down)

---

### 2. Detailed Health Check

**Endpoint:** `GET /api/health/detailed`

Returns detailed health information including database statistics, tRPC endpoint status, and memory usage.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "timestamp": "2024-11-17T09:45:00.000Z",
  "uptime": 3600.5,
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 15,
      "details": {
        "userCount": 42,
        "workflowCount": 128
      }
    },
    "trpc": {
      "status": "up"
    },
    "api": {
      "status": "up"
    }
  },
  "version": "0.1.0",
  "environment": "production",
  "memory": {
    "heapUsed": 128,
    "heapTotal": 256,
    "external": 12,
    "rss": 512
  }
}
```

**Status Codes:**

- `200` - Healthy or Degraded
- `503` - Unhealthy (critical services down)

**Status Types:**

- `healthy` - All services operational
- `degraded` - Non-critical service down (e.g., tRPC endpoint)
- `unhealthy` - Critical service down (e.g., database)

---

### 3. Liveness Probe

**Endpoint:** `GET /api/health/live`

Simple endpoint to check if the application process is alive. Used by container orchestrators (Kubernetes, Docker Swarm) to determine if the container should be restarted.

**Response (200 OK):**

```json
{
  "status": "alive",
  "timestamp": "2024-11-17T09:45:00.000Z"
}
```

**Status Codes:**

- `200` - Process is alive

---

### 4. Readiness Probe

**Endpoint:** `GET /api/health/ready`

Checks if the application is ready to serve traffic. Verifies database connectivity before marking as ready. Used by load balancers to determine if traffic should be routed to this instance.

**Response (200 OK):**

```json
{
  "status": "ready",
  "timestamp": "2024-11-17T09:45:00.000Z"
}
```

**Response (503 Service Unavailable):**

```json
{
  "status": "not ready",
  "reason": "database unavailable",
  "timestamp": "2024-11-17T09:45:00.000Z"
}
```

**Status Codes:**

- `200` - Ready to serve traffic
- `503` - Not ready (do not route traffic)

---

## Usage Examples

### cURL

```bash
# Basic health check
curl http://localhost:3000/api/health

# Detailed health check
curl http://localhost:3000/api/health/detailed

# Liveness probe
curl http://localhost:3000/api/health/live

# Readiness probe
curl http://localhost:3000/api/health/ready
```

### JavaScript/Fetch

```javascript
// Basic health check
const response = await fetch('/api/health');
const health = await response.json();

if (health.status === 'healthy') {
  console.log('✅ Application is healthy');
} else {
  console.error('❌ Application is unhealthy:', health);
}

// Check database status
if (health.checks.database.status === 'up') {
  console.log(`Database response time: ${health.checks.database.responseTime}ms`);
}
```

---

## Kubernetes Integration

### Liveness Probe Configuration

```yaml
livenessProbe:
  httpGet:
    path: /api/health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3
```

### Readiness Probe Configuration

```yaml
readinessProbe:
  httpGet:
    path: /api/health/ready
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  successThreshold: 1
  failureThreshold: 3
```

### Complete Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n-app
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: n8n:latest
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /api/health/live
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/health/ready
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: url
```

---

## Docker Compose Health Check

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health/ready']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/n8n

  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user']
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## Monitoring & Alerting

### Prometheus Integration

The health endpoints can be scraped by Prometheus for monitoring:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'n8n-health'
    metrics_path: '/api/health'
    static_configs:
      - targets: ['localhost:3000']
```

### Alert Rules

```yaml
groups:
  - name: n8n_health
    rules:
      - alert: ApplicationUnhealthy
        expr: up{job="n8n-health"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: 'n8n application is unhealthy'

      - alert: DatabaseDown
        expr: n8n_database_status == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: 'Database connection failed'
```

---

## Testing

### Unit Tests

```bash
# Run health check unit tests
pnpm vitest run tests/unit/health-check.test.ts
```

### E2E Tests

```bash
# Run health check E2E tests
pnpm playwright test e2e/health-check.spec.ts
```

---

## Best Practices

1. **Use `/api/health/live` for liveness probes** - Simple, fast check
2. **Use `/api/health/ready` for readiness probes** - Includes dependency checks
3. **Use `/api/health` for general monitoring** - Balanced information
4. **Use `/api/health/detailed` for debugging** - Comprehensive diagnostics

### Response Time Guidelines

- Liveness: < 100ms (should be instant)
- Readiness: < 500ms (includes DB check)
- Basic health: < 500ms
- Detailed health: < 1000ms

### Monitoring Strategy

```
┌─────────────┐
│ Load Balancer│ → Readiness Probe (/api/health/ready)
└─────────────┘

┌─────────────┐
│  Kubernetes  │ → Liveness Probe (/api/health/live)
└─────────────┘

┌─────────────┐
│  Prometheus  │ → Health Metrics (/api/health)
└─────────────┘

┌─────────────┐
│   Grafana    │ → Detailed Status (/api/health/detailed)
└─────────────┘
```

---

## Troubleshooting

### Database Connection Issues

If health checks fail with database errors:

1. Check `DATABASE_URL` environment variable
2. Verify database is running: `docker ps` or `pg_isready`
3. Check network connectivity
4. Review database logs

### High Response Times

If response times are consistently high:

1. Check database performance
2. Review database connection pool settings
3. Monitor server resources (CPU, memory)
4. Consider adding database indexes

---

## Related Documentation

- [TESTING.md](./TESTING.md) - Testing guide
- [PNPM-MIGRATION.md](./PNPM-MIGRATION.md) - Package manager setup
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM
