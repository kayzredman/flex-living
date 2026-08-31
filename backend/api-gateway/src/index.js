const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(morgan('dev'));

// Service Target URLs
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  listings: process.env.LISTING_SERVICE_URL || 'http://localhost:8000',
  scouts: process.env.SCOUT_SERVICE_URL || 'http://localhost:3001',
  iot: process.env.IOT_SERVICE_URL || 'http://localhost:3002',
  sla: process.env.SLA_SERVICE_URL || 'http://localhost:3003',
  pricing: process.env.PRICING_SERVICE_URL || 'http://localhost:3005',
  comms: process.env.COMMUNICATION_SERVICE_URL || 'http://localhost:3006',
};

// Gateway Health Check & Service Registry Info
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'flexliving-api-gateway',
    timestamp: new Date().toISOString(),
    routes: {
      auth: `${SERVICES.auth}/v1/auth`,
      listings: `${SERVICES.listings}/v1/listings`,
      scouts: `${SERVICES.scouts}/v1/scouts`,
      iot: `${SERVICES.iot}/v1/iot`,
      sla: `${SERVICES.sla}/v1/sla`,
      pricing: `${SERVICES.pricing}/v1/pricing`,
      notifications: `${SERVICES.comms}/v1/notifications`,
      hosts: `${SERVICES.comms}/v1/hosts`
    }
  });
});

// Reverse Proxy Routing
app.use('/v1/auth', proxy(SERVICES.auth, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/listings', proxy(SERVICES.listings, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/scouts', proxy(SERVICES.scouts, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/scout', proxy(SERVICES.scouts, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/iot', proxy(SERVICES.iot, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/sla', proxy(SERVICES.sla, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/fintech', proxy(SERVICES.sla, {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/pricing', proxy(SERVICES.pricing || 'http://localhost:3005', {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/notifications', proxy(SERVICES.comms || 'http://localhost:3006', {
  proxyReqPathResolver: (req) => req.originalUrl
}));

app.use('/v1/hosts', proxy(SERVICES.comms || 'http://localhost:3006', {
  proxyReqPathResolver: (req) => req.originalUrl
}));

// Fallback 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not routed by Flex-Living API Gateway' });
});

app.listen(PORT, () => {
  console.log(`🌐 Flex-Living API Gateway running on port ${PORT}`);
  console.log(`🔗 Routing /v1/auth -> ${SERVICES.auth}`);
  console.log(`🔗 Routing /v1/listings -> ${SERVICES.listings}`);
  console.log(`🔗 Routing /v1/scouts -> ${SERVICES.scouts}`);
  console.log(`🔗 Routing /v1/iot -> ${SERVICES.iot}`);
  console.log(`🔗 Routing /v1/sla -> ${SERVICES.sla}`);
});
