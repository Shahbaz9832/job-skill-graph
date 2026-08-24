const express = require('express');
const cors = require('cors');
const driver = require('./db');

const app = express();
app.use(cors({
  origin: [
    'https://job-skill-graph.vercel.app',
    'https://job-skill-graph-git-main-shahbaz9832s-projects.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Helper: run a read query with graceful error handling
async function runQuery(query, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(r => r.toObject());
  } finally {
    await session.close();
  }
}

// GET /skills - list all skills, for the checkbox UI
app.get('/skills', async (req, res) => {
  try {
    const records = await runQuery(
      'MATCH (s:Skill) RETURN s.name AS name, s.category AS category ORDER BY s.category, s.name'
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: 'Could not reach the database. Please try again shortly.' });
  }
});

// POST /match - given a list of skill names, return ranked job matches
// Multi-hop query: Skill <- REQUIRES - Job <- POSTS - Company
app.post('/match', async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: 'Provide a non-empty array of skill names.' });
  }
  try {
    const records = await runQuery(
      `MATCH (co:Company)-[:POSTS]->(j:Job)-[:REQUIRES]->(s:Skill)
       WHERE s.name IN $skills
       WITH j, co, count(DISTINCT s) AS matchedSkills
       MATCH (j)-[:REQUIRES]->(allReq:Skill)
       WITH j, co, matchedSkills, count(DISTINCT allReq) AS totalRequired
       RETURN j.title AS title, co.name AS company, j.location AS location,
              j.seniority AS seniority, matchedSkills, totalRequired,
              toFloat(matchedSkills) / totalRequired AS matchScore
       ORDER BY matchScore DESC, matchedSkills DESC`,
      { skills }
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: 'Could not reach the database. Please try again shortly.' });
  }
});

// POST /next-skill - given known skills, suggest which new skill unlocks the most jobs
app.post('/next-skill', async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ error: 'Provide an array of skill names (can be empty).' });
  }
  try {
    const records = await runQuery(
      `MATCH (j:Job)-[:REQUIRES]->(missing:Skill)
       WHERE NOT missing.name IN $skills
         AND EXISTS {
           MATCH (j)-[:REQUIRES]->(known:Skill)
           WHERE known.name IN $skills
         }
       WITH missing, count(DISTINCT j) AS jobsUnlocked
       RETURN missing.name AS skill, jobsUnlocked
       ORDER BY jobsUnlocked DESC
       LIMIT 5`,
      { skills }
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(503).json({ error: 'Could not reach the database. Please try again shortly.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
