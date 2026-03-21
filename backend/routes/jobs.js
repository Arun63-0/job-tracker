const { scoreJobMatch } = require('../services/matching');

const jobs = [
  
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Bangalore",
    description: "Build beautiful UIs using React and modern JavaScript frameworks.",
    type: "Full-time",
    mode: "Remote",
    skills: ["React", "JavaScript", "CSS"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "Amazon",
    location: "Hyderabad",
    description: "Build scalable backend services using Node.js and AWS.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Node.js", "AWS", "MongoDB"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Python Developer",
    company: "Microsoft",
    location: "Pune",
    description: "Develop AI and ML solutions using Python and TensorFlow.",
    type: "Full-time",
    mode: "On-site",
    skills: ["Python", "TensorFlow", "ML"],
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    title: "React Native Developer",
    company: "Flipkart",
    location: "Bangalore",
    description: "Build cross platform mobile apps using React Native.",
    type: "Contract",
    mode: "Remote",
    skills: ["React Native", "JavaScript", "Mobile"],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    title: "ML Engineer",
    company: "Swiggy",
    location: "Bangalore",
    description: "Build recommendation systems using PyTorch and TensorFlow.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Python", "PyTorch", "TensorFlow"],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    title: "Full Stack Developer",
    company: "Zomato",
    location: "Bangalore",
    description: "Build full stack web apps using React and Node.js.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["React", "Node.js", "MongoDB"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Infosys",
    location: "Pune",
    description: "Manage cloud infrastructure using AWS and Docker.",
    type: "Full-time",
    mode: "On-site",
    skills: ["AWS", "Docker", "Kubernetes"],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    title: "Data Scientist",
    company: "Razorpay",
    location: "Bangalore",
    description: "Analyze large datasets and build predictive models.",
    type: "Full-time",
    mode: "Remote",
    skills: ["Python", "ML", "SQL"],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 9,
    title: "UI/UX Designer",
    company: "Paytm",
    location: "Noida",
    description: "Design beautiful user interfaces for mobile and web apps.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Figma", "CSS", "JavaScript"],
    postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 10,
    title: "React Developer",
    company: "Freshworks",
    location: "Chennai",
    description: "Build modern web applications using React and Redux.",
    type: "Full-time",
    mode: "Remote",
    skills: ["React", "Redux", "JavaScript"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 11,
    title: "Node.js Developer",
    company: "CRED",
    location: "Bangalore",
    description: "Build high performance APIs using Node.js and Express.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Node.js", "Express", "MongoDB"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 12,
    title: "Android Developer",
    company: "Ola",
    location: "Bangalore",
    description: "Build Android apps using Kotlin and Java.",
    type: "Full-time",
    mode: "On-site",
    skills: ["Kotlin", "Java", "Android"],
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 13,
    title: "iOS Developer",
    company: "PhonePe",
    location: "Bangalore",
    description: "Build iOS apps using Swift and Objective-C.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Swift", "iOS", "Xcode"],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 14,
    title: "Cloud Architect",
    company: "TCS",
    location: "Mumbai",
    description: "Design and implement cloud solutions using AWS and Azure.",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["AWS", "Azure", "Cloud"],
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 15,
    title: "Frontend Intern",
    company: "Meesho",
    location: "Bangalore",
    description: "Learn and build UI components using React.",
    type: "Internship",
    mode: "Remote",
    skills: ["React", "JavaScript", "HTML"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }

];

global.resumeStore = global.resumeStore || { text: '', filename: '' };

async function jobRoutes(fastify, options) {
  fastify.get('/api/jobs', async (request, reply) => {
    let filtered = [...jobs];
    const { title, skills, type, mode, location, date } = request.query;

    if (title) {
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (skills) {
      const skillList = skills.split(',');
      filtered = filtered.filter(j =>
        skillList.some(s => j.skills.includes(s))
      );
    }
    if (type) filtered = filtered.filter(j => j.type === type);
    if (mode) filtered = filtered.filter(j => j.mode === mode);
    if (location) {
      filtered = filtered.filter(j =>
        j.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (date) {
      const now = Date.now();
      filtered = filtered.filter(j => {
        const posted = new Date(j.postedDate).getTime();
        if (date === '24h') return now - posted <= 24 * 60 * 60 * 1000;
        if (date === 'week') return now - posted <= 7 * 24 * 60 * 60 * 1000;
        if (date === 'month') return now - posted <= 30 * 24 * 60 * 60 * 1000;
        return true;
      });
    }

    console.log('Resume text length:', global.resumeStore.text.length);

    if (global.resumeStore.text) {
      const scoredJobs = [];
      for (const job of filtered) {
        const match = await scoreJobMatch(global.resumeStore.text, job);
        scoredJobs.push({
          ...job,
          matchScore: match.score,
          matchingSkills: match.matchingSkills,
          explanation: match.explanation
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      let result = scoredJobs;
      if (request.query.matchScore === 'high') {
        result = scoredJobs.filter(j => j.matchScore >= 70);
      } else if (request.query.matchScore === 'medium') {
        result = scoredJobs.filter(j => j.matchScore >= 40 && j.matchScore < 70);
      }

      result.sort((a, b) => b.matchScore - a.matchScore);
      return { jobs: result, total: result.length };
    }

    return { jobs: filtered, total: filtered.length };
  });
}

module.exports = jobRoutes;
