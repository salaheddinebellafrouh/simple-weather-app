# Weather Application

A modern weather application built with Next.js, featuring real-time weather data, location search, and Redis caching.

## Quick Start

1. Make sure you have Docker and Docker Compose installed:
```bash
docker --version
docker-compose --version
```

2. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

3. Create a `.env.local` file with your OpenWeather API key:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the application:
```bash
docker-compose up --build
```

The application will be available at http://localhost:3000

## Architecture Summary

### Component Interaction Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │     │    Redis    │     │  OpenWeather│
│   Frontend  │     │    Cache    │     │    API      │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ 1. User selects  │                   │
       │    location      │                   │
       │─────────────────>│                   │
       │                   │                   │
       │ 2. Check cache   │                   │
       │─────────────────>│                   │
       │                   │                   │
       │ 3. Cache miss    │                   │
       │<─────────────────│                   │
       │                   │                   │
       │ 4. Fetch data    │                   │
       │──────────────────────────────────────>│
       │                   │                   │
       │ 5. API response  │                   │
       │<──────────────────────────────────────│
       │                   │                   │
       │ 6. Store in cache│                   │
       │─────────────────>│                   │
       │                   │                   │
       │ 7. Update UI     │                   │
       │<─────────────────│                   │
```

### Key Components and Their Roles

1. **Frontend Layer (`app/` and `components/`)**
   - `page.tsx`: Main application page
   - `WeatherContainer`: Manages weather data state and location selection
   - `WeatherDisplay`: Renders weather information
   - `LocationSearch`: Handles location selection UI
   - `RedisToggle`: Controls Redis caching state

2. **API Layer (`app/api/`)**
   - `/api/weather/route.ts`: Handles weather data requests
   - `/api/location/route.ts`: Manages location data
   - `/api/cache/toggle/route.ts`: Controls Redis caching

3. **Service Layer (`lib/`)**
   - `weather-service.ts`: Core weather data fetching logic
   - `redis.ts`: Redis caching implementation
   - `redis-state.ts`: Redis state management

### Data Flow Details

1. **Location Selection Flow**
   ```
   User → LocationSearch → WeatherContainer → API Route → Weather Service → Redis Cache
   ```

2. **Weather Data Flow**
   ```
   WeatherContainer → API Route → Weather Service → Redis Cache → OpenWeather API
   ```

3. **Caching Flow**
   ```
   Request → Redis Check → Cache Hit/Miss → API Call (if miss) → Cache Update → Response
   ```

### State Management

1. **Client-Side State**
   - Weather data
   - Selected location
   - Loading states
   - Error states

2. **Server-Side State**
   - Redis cache
   - API response caching
   - Location data caching

### Error Handling

1. **Client-Side**
   - Loading states
   - Error messages
   - Fallback UI

2. **Server-Side**
   - API error handling
   - Cache fallbacks
   - Rate limiting

### Performance Optimizations

1. **Caching Strategy**
   - Weather data: 30-minute TTL
   - Location data: 24-hour TTL
   - Automatic cache invalidation

2. **Data Fetching**
   - Parallel requests
   - Error retries
   - Cache-first approach

## Scaling Strategy

To scale this application for millions of daily users, we would implement a multi-tier architecture with the following components:

1. **Frontend Scaling**
   - Deploy Next.js application to multiple regions using a CDN (like Vercel or Cloudflare)
   - Implement static page generation for common locations
   - Use edge caching for API responses
   - Deploy static assets (images, icons) to CDN

2. **Backend Scaling**
   - Split into microservices:
     - Weather Service: Handles weather data fetching and caching
     - Location Service: Manages location data and geocoding
     - Cache Service: Manages Redis clusters
   - Implement horizontal scaling for each service
   - Use Kubernetes for container orchestration
   - Implement service mesh for inter-service communication

3. **Data Layer**
   - Redis Cluster for distributed caching
   - Implement Redis Sentinel for high availability
   - Use Redis Cluster for sharding across multiple nodes
   - Implement cache warming strategies

4. **Infrastructure**
   - Load balancers (e.g., AWS ALB) for traffic distribution
   - Auto-scaling groups based on CPU/memory metrics
   - Multi-region deployment for global availability
   - Implement circuit breakers for external API calls

5. **Monitoring and Optimization**
   - Implement distributed tracing
   - Set up real-time monitoring
   - Use APM tools for performance tracking
   - Implement rate limiting and DDoS protection

## Troubleshooting

1. **Build Issues**
   - Clear Docker cache: `docker-compose build --no-cache`
   - Rebuild: `docker-compose up --build`

2. **Weather API Issues**
   - Verify API key in environment variables
   - Check API rate limits
   - Monitor error logs

3. **Container Status**
   - Check running containers: `docker-compose ps`
   - View logs: `docker-compose logs`
   - Restart services: `docker-compose restart` 