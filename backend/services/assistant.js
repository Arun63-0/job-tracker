const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash',
  temperature: 0.1
});

// Simple rule-based fallback when AI fails
function ruleBased(message) {
  const msg = message.toLowerCase();
  
  const filters = {
    title: '',
    skills: '',
    type: '',
    mode: '',
    location: '',
    date: '',
    matchScore: ''
  };

  let reply = '';

  // Work mode
  if (msg.includes('remote')) {
    filters.mode = 'Remote';
    reply = 'Showing remote jobs! 🏠';
  } else if (msg.includes('hybrid')) {
    filters.mode = 'Hybrid';
    reply = 'Showing hybrid jobs! 🏢';
  } else if (msg.includes('on-site') || msg.includes('onsite') || msg.includes('office')) {
    filters.mode = 'On-site';
    reply = 'Showing on-site jobs! 🏢';
  }

  // Job type
  if (msg.includes('full-time') || msg.includes('fulltime') || msg.includes('full time')) {
    filters.type = 'Full-time';
    reply = reply || 'Showing full-time jobs! 💼';
  } else if (msg.includes('part-time') || msg.includes('parttime')) {
    filters.type = 'Part-time';
    reply = reply || 'Showing part-time jobs! ⏰';
  } else if (msg.includes('contract')) {
    filters.type = 'Contract';
    reply = reply || 'Showing contract jobs! 📝';
  } else if (msg.includes('internship') || msg.includes('intern')) {
    filters.type = 'Internship';
    reply = reply || 'Showing internships! 🎓';
  }

  // Skills
  if (msg.includes('react')) {
    filters.skills = 'React';
    reply = reply || 'Filtering by React! ⚛️';
  } else if (msg.includes('python')) {
    filters.skills = 'Python';
    reply = reply || 'Filtering by Python! 🐍';
  } else if (msg.includes('node')) {
    filters.skills = 'Node.js';
    reply = reply || 'Filtering by Node.js! 🟢';
  } else if (msg.includes('javascript') || msg.includes('js')) {
    filters.skills = 'JavaScript';
    reply = reply || 'Filtering by JavaScript! 🟨';
  }

  // Location
  if (msg.includes('bangalore') || msg.includes('bengaluru')) {
    filters.location = 'Bangalore';
    reply = reply || 'Showing jobs in Bangalore! 📍';
  } else if (msg.includes('hyderabad')) {
    filters.location = 'Hyderabad';
    reply = reply || 'Showing jobs in Hyderabad! 📍';
  } else if (msg.includes('pune')) {
    filters.location = 'Pune';
    reply = reply || 'Showing jobs in Pune! 📍';
  }

  // Date
  if (msg.includes('today') || msg.includes('24 hour') || msg.includes('24h')) {
    filters.date = '24h';
    reply = reply || 'Showing jobs from last 24 hours! ⏰';
  } else if (msg.includes('week')) {
    filters.date = 'week';
    reply = reply || 'Showing jobs from last week! 📅';
  } else if (msg.includes('month')) {
    filters.date = 'month';
    reply = reply || 'Showing jobs from last month! 📅';
  }

  // Match score
  if (msg.includes('high match') || msg.includes('best match')) {
    filters.matchScore = 'high';
    reply = reply || 'Showing high match jobs! 🎯';
  }

  // Clear filters
  if (msg.includes('clear') || msg.includes('reset') || msg.includes('all jobs') || msg.includes('show all')) {
    return {
      reply: 'Cleared all filters! Showing all jobs! ✨',
      filters: {
        title: '', skills: '', type: '',
        mode: '', location: '', date: '', matchScore: ''
      },
      action: 'filter'
    };
  }

  // Help questions
  if (msg.includes('application') || msg.includes('applied')) {
    return {
      reply: 'Click "📋 My Applications" button at the top to see your applications! 📋',
      filters,
      action: 'help'
    };
  }
  if (msg.includes('resume') || msg.includes('upload')) {
    return {
      reply: 'You can upload your resume using the upload box at the top of the page! 📄',
      filters,
      action: 'help'
    };
  }
  if ((msg.includes('match') || msg.includes('score') || msg.includes('how')) && !msg.includes('remote') && !msg.includes('job')) {

    return {
      reply: 'AI compares your resume skills with job requirements and gives a 0-100% match score! 🤖',
      filters,
      action: 'help'
    };
  }

  if (!reply) {
    return {
      reply: 'Try saying: "Show remote jobs", "Filter by React", "Show full-time jobs", "Jobs in Bangalore", or "Clear filters"! 😊',
      filters,
      action: 'help'
    };
  }

  return { reply, filters, action: 'filter' };
}

async function processMessage(message, currentFilters) {
  try {
    const prompt = `You are an AI assistant for a job tracking app.
The user said: "${message}"

Current filters: ${JSON.stringify(currentFilters)}

Respond with ONLY a JSON object like this:
{"reply": "I'll show you remote jobs!", "filters": {"title": "", "skills": "", "type": "", "mode": "Remote", "location": "", "date": "", "matchScore": ""}, "action": "filter"}

Rules:
- For remote jobs → mode: "Remote"
- For full-time → type: "Full-time"
- For React jobs → skills: "React"
- For clear/reset → all values ""
- For high match → matchScore: "high"
- For location → set location value
- action: "filter" or "help"
- reply: short friendly message

ONLY return JSON, nothing else.`;

    const result = await model.invoke(prompt);
    const text = result.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.log('AI failed, using rule-based fallback:', err.message);
    return ruleBased(message);
  }
}

module.exports = { processMessage };
