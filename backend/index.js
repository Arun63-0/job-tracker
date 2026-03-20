require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const multipart = require('@fastify/multipart');
const jobRoutes = require('./routes/jobs');
const resumeRoutes = require('./routes/resume');
const assistantRoutes = require('./routes/assistant');

// Register plugins
fastify.register(cors, {
  origin: 'http://localhost:5173'
});
fastify.register(multipart);

// Register routes
fastify.register(jobRoutes);
fastify.register(resumeRoutes);
fastify.register(assistantRoutes);

// Test route
fastify.get('/', async (request, reply) => {
  return { message: 'Job Tracker API is running! 🚀' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
    console.log('Server running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
