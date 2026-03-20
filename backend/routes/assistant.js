const { processMessage } = require('../services/assistant');

async function assistantRoutes(fastify, options) {
  fastify.post('/api/assistant', async (request, reply) => {
    const { message, currentFilters } = request.body;
    console.log('User message:', message);
    const response = await processMessage(message, currentFilters);
    console.log('AI response:', response);
    return response;
  });
}

module.exports = assistantRoutes;