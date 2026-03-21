const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { StateGraph, END } = require('@langchain/langgraph');
const { HumanMessage } = require('@langchain/core/messages');

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash',
  temperature: 0.1
});

// Rule-based fallback
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

  if (msg.includes('remote')) { filters.mode = 'Remote'; reply = 'Showing remote jobs! 🏠'; }
  else if (msg.includes('hybrid')) { filters.mode = 'Hybrid'; reply = 'Showing hybrid jobs! 🏢'; }
  else if (msg.includes('on-site') || msg.includes('onsite') || msg.includes('office')) { filters.mode = 'On-site'; reply = 'Showing on-site jobs! 🏢'; }

  if (msg.includes('full-time') || msg.includes('fulltime')) { filters.type = 'Full-time'; reply = reply || 'Showing full-time jobs! 💼'; }
  else if (msg.includes('part-time') || msg.includes('parttime')) { filters.type = 'Part-time'; reply = reply || 'Showing part-time jobs! ⏰'; }
  else if (msg.includes('contract')) { filters.type = 'Contract'; reply = reply || 'Showing contract jobs! 📝'; }
  else if (msg.includes('internship') || msg.includes('intern')) { filters.type = 'Internship'; reply = reply || 'Showing internships! 🎓'; }

  if (msg.includes('react')) { filters.skills = 'React'; reply = reply || 'Filtering by React! ⚛️'; }
  else if (msg.includes('python')) { filters.skills = 'Python'; reply = reply || 'Filtering by Python! 🐍'; }
  else if (msg.includes('node')) { filters.skills = 'Node.js'; reply = reply || 'Filtering by Node.js! 🟢'; }
  else if (msg.includes('javascript') || msg.includes('js')) { filters.skills = 'JavaScript'; reply = reply || 'Filtering by JavaScript! 🟨'; }

  if (msg.includes('bangalore') || msg.includes('bengaluru')) { filters.location = 'Bangalore'; reply = reply || 'Showing jobs in Bangalore! 📍'; }
  else if (msg.includes('hyderabad')) { filters.location = 'Hyderabad'; reply = reply || 'Showing jobs in Hyderabad! 📍'; }
  else if (msg.includes('pune')) { filters.location = 'Pune'; reply = reply || 'Showing jobs in Pune! 📍'; }

  if (msg.includes('today') || msg.includes('24h')) { filters.date = '24h'; reply = reply || 'Showing jobs from last 24 hours! ⏰'; }
  else if (msg.includes('week')) { filters.date = 'week'; reply = reply || 'Showing jobs from last week! 📅'; }
  else if (msg.includes('month')) { filters.date = 'month'; reply = reply || 'Showing jobs from last month! 📅'; }

  if (msg.includes('high match') || msg.includes('best match')) { filters.matchScore = 'high'; reply = reply || 'Showing high match jobs! 🎯'; }

  if (msg.includes('clear') || msg.includes('reset') || msg.includes('show all')) {
    return {
      reply: 'Cleared all filters! Showing all jobs! ✨',
      filters: { title: '', skills: '', type: '', mode: '', location: '', date: '', matchScore: '' },
      action: 'filter'
    };
  }

  if (msg.includes('application') || msg.includes('applied')) {
    return { reply: 'Click "📋 My Applications" button at the top to see your applications!', filters, action: 'help' };
  }
  if (msg.includes('resume') || msg.includes('upload')) {
    return { reply: 'Upload your resume using the upload box at the top of the page! 📄', filters, action: 'help' };
  }
  if ((msg.includes('match') || msg.includes('score') || msg.includes('how')) && !msg.includes('remote') && !msg.includes('job')) {
    return { reply: 'AI compares your resume skills with job requirements and gives a 0-100% match score! 🤖', filters, action: 'help' };
  }

  if (!reply) {
    return {
      reply: 'Try: "Show remote jobs", "Filter by React", "Full-time jobs", "Jobs in Bangalore", or "Clear filters"! 😊',
      filters,
      action: 'help'
    };
  }

  return { reply, filters, action: 'filter' };
}

// LangGraph State
const graphState = {
  message: { value: null },
  currentFilters: { value: null },
  intent: { value: null },
  response: { value: null }
};

// Node 1: Detect Intent
async function detectIntent(state) {
  const msg = state.message.toLowerCase();
  let intent = 'help';

  if (msg.includes('remote') || msg.includes('hybrid') || msg.includes('on-site') ||
    msg.includes('full-time') || msg.includes('part-time') || msg.includes('contract') ||
    msg.includes('react') || msg.includes('python') || msg.includes('node') ||
    msg.includes('bangalore') || msg.includes('hyderabad') || msg.includes('pune') ||
    msg.includes('clear') || msg.includes('reset') || msg.includes('filter') ||
    msg.includes('show') || msg.includes('find') || msg.includes('search')) {
    intent = 'filter';
  } else if (msg.includes('how') || msg.includes('where') || msg.includes('what') ||
    msg.includes('application') || msg.includes('resume') || msg.includes('upload')) {
    intent = 'help';
  }

  console.log('LangGraph - Intent detected:', intent);
  return { ...state, intent };
}

// Node 2: Process Filter
async function processFilter(state) {
  const result = ruleBased(state.message);
  console.log('LangGraph - Filter processed:', result.filters);
  return { ...state, response: result };
}

// Node 3: Process Help
async function processHelp(state) {
  const result = ruleBased(state.message);
  console.log('LangGraph - Help processed:', result.reply);
  return { ...state, response: result };
}

// Route based on intent
function routeIntent(state) {
  return state.intent === 'filter' ? 'processFilter' : 'processHelp';
}

// Build LangGraph
let graph;
try {
  const workflow = new StateGraph({ channels: graphState });
  workflow.addNode('detectIntent', detectIntent);
  workflow.addNode('processFilter', processFilter);
  workflow.addNode('processHelp', processHelp);
  workflow.setEntryPoint('detectIntent');
  workflow.addConditionalEdges('detectIntent', routeIntent, {
    processFilter: 'processFilter',
    processHelp: 'processHelp'
  });
  workflow.addEdge('processFilter', END);
  workflow.addEdge('processHelp', END);
  graph = workflow.compile();
  console.log('LangGraph compiled successfully!');
} catch (err) {
  console.error('LangGraph compilation error:', err.message);
}

async function processMessage(message, currentFilters) {
  try {
    if (graph) {
      const result = await graph.invoke({
        message,
        currentFilters,
        intent: null,
        response: null
      });
      console.log('LangGraph result:', result.response);
      return result.response;
    }
    return ruleBased(message);
  } catch (err) {
    console.log('LangGraph failed, using fallback:', err.message);
    return ruleBased(message);
  }
}

module.exports = { processMessage };