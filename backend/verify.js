require('dotenv').config();

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(
    process.env.COGNODB_USER,
    process.env.COGNODB_PASSWORD
  )
);

async function verify() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Skill)
      WITH count(s) AS skills

      MATCH (c:Company)
      WITH skills, count(c) AS companies

      MATCH (j:Job)
      WITH skills, companies, count(j) AS jobs

      MATCH (:Job)-[r:REQUIRES]->(:Skill)
      WITH skills, companies, jobs, count(r) AS reqs

      RETURN skills, companies, jobs, reqs
    `);

    console.log(result.records[0].toObject());

  } catch (error) {
    console.error('Verification failed:', error.message);

  } finally {
    await session.close();
    await driver.close();
  }
}

verify();