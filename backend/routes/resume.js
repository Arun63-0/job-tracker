const pdf = require('pdf-parse');

global.resumeStore = global.resumeStore || { text: '', filename: '' };

async function resumeRoutes(fastify, options) {
  fastify.post('/api/resume/upload', async (request, reply) => {
    const data = await request.file();
    const buffer = await data.toBuffer();

    let resumeText = '';

    if (data.filename.endsWith('.pdf')) {
      const parsed = await pdf(buffer);
      resumeText = parsed.text;
    } else {
      resumeText = buffer.toString('utf-8');
    }

    global.resumeStore.text = resumeText;
    global.resumeStore.filename = data.filename;

    console.log('Resume saved! Length:', resumeText.length);

    return {
      message: 'Resume uploaded successfully!',
      filename: data.filename,
      textLength: resumeText.length
    };
  });

  fastify.get('/api/resume', async (request, reply) => {
    if (!global.resumeStore.text) {
      return reply.code(404).send({ message: 'No resume uploaded yet' });
    }
    return {
      filename: global.resumeStore.filename,
      text: global.resumeStore.text
    };
  });
}

module.exports = resumeRoutes;