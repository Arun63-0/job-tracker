const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash',
  temperature: 0.3
});

async function scoreJobMatch(resumeText, job) {
  try {
    const prompt = `You are a job matching expert. Compare this resume with the job and give a match score.

RESUME:
${resumeText.substring(0, 2000)}

JOB TITLE: ${job.title}
JOB DESCRIPTION: ${job.description}
REQUIRED SKILLS: ${job.skills.join(', ')}

Respond with ONLY a JSON object, no extra text, no markdown:
{"score": 75, "matchingSkills": ["React", "JavaScript"], "explanation": "Strong match due to React experience"}

Score must be 0-100.`;

    const result = await model.invoke(prompt);
    const text = result.content;
    
    console.log('AI Response for', job.title, ':', text);
    
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: parsed.score || 0,
      matchingSkills: parsed.matchingSkills || [],
      explanation: parsed.explanation || ''
    };
  } catch (err) {
    console.error('Matching error for', job.title, ':', err.message);
    return { score: 0, matchingSkills: [], explanation: 'Could not calculate match' };
  }
}

module.exports = { scoreJobMatch };