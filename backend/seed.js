require('dotenv').config();
const neo4j = require('neo4j-driver');
const driver= neo4j.driver(
    process.env.COGNODB_URI,
    neo4j.auth.basic(process.env.COGNODB_USER, process.env.COGNODB_PASSWORD)
);

// --------------------------------------------------
// SKILLS
// --------------------------------------------------

const skills = [
  {
    name: 'React',
    normalizedName: 'react',
    category: 'frontend',
    aliases: ['react', 'reactjs', 'react.js']
  },
  {
    name: 'Vue',
    normalizedName: 'vue',
    category: 'frontend',
    aliases: ['vue', 'vuejs', 'vue.js']
  },
  {
    name: 'CSS',
    normalizedName: 'css',
    category: 'frontend',
    aliases: ['css', 'css3', 'cascading style sheets']
  },
  {
    name: 'Node.js',
    normalizedName: 'node.js',
    category: 'backend',
    aliases: ['node', 'nodejs', 'node.js']
  },
  {
    name: 'Express',
    normalizedName: 'express',
    category: 'backend',
    aliases: ['express', 'expressjs', 'express.js']
  },
  {
    name: 'Python',
    normalizedName: 'python',
    category: 'backend',
    aliases: ['python', 'python3']
  },
  {
    name: 'Django',
    normalizedName: 'django',
    category: 'backend',
    aliases: ['django', 'django framework']
  },
  {
    name: 'Java',
    normalizedName: 'java',
    category: 'backend',
    aliases: ['java', 'java programming']
  },
  {
    name: 'SQL',
    normalizedName: 'sql',
    category: 'data',
    aliases: ['sql', 'structured query language']
  },
  {
    name: 'Neo4j',
    normalizedName: 'neo4j',
    category: 'data',
    aliases: ['neo4j', 'neo4j database', 'graph database']
  },
  {
    name: 'Pandas',
    normalizedName: 'pandas',
    category: 'data',
    aliases: ['pandas', 'python pandas']
  },
  {
    name: 'Docker',
    normalizedName: 'docker',
    category: 'devops',
    aliases: ['docker', 'docker container', 'containers']
  },
  {
    name: 'AWS',
    normalizedName: 'aws',
    category: 'devops',
    aliases: ['aws', 'amazon web services', 'amazon aws']
  },
  {
    name: 'Kubernetes',
    normalizedName: 'kubernetes',
    category: 'devops',
    aliases: ['kubernetes', 'k8s']
  },
  {
    name: 'CI/CD',
    normalizedName: 'ci/cd',
    category: 'devops',
    aliases: [
      'ci/cd',
      'cicd',
      'ci cd',
      'continuous integration',
      'continuous deployment'
    ]
  }
];

// --------------------------------------------------
// COMPANIES
// --------------------------------------------------

const companies = [
  { name: 'Northwind Labs', industry: 'Fintech' },
  { name: 'Bluehill Analytics', industry: 'Data & AI' },
  { name: 'Riverstone Retail', industry: 'E-commerce' },
  { name: 'Cascade Health', industry: 'Healthtech' },
  { name: 'Ironpeak Systems', industry: 'Infrastructure' },
  { name: 'Sunbird Media', industry: 'Media' }
];

// --------------------------------------------------
// JOBS
// --------------------------------------------------

const jobs = [
  {
    title: 'Frontend Engineer',
    location: 'Bangalore',
    seniority: 'Mid',
    company: 'Northwind Labs',
    requires: [
      { skill: 'React', mandatory: true },
      { skill: 'CSS', mandatory: true },
      { skill: 'Node.js', mandatory: false }
    ]
  },
  {
    title: 'Backend Engineer',
    location: 'Bangalore',
    seniority: 'Mid',
    company: 'Northwind Labs',
    requires: [
      { skill: 'Node.js', mandatory: true },
      { skill: 'Express', mandatory: true },
      { skill: 'SQL', mandatory: true }
    ]
  },
  {
    title: 'Full Stack Developer',
    location: 'Remote',
    seniority: 'Senior',
    company: 'Riverstone Retail',
    requires: [
      { skill: 'React', mandatory: true },
      { skill: 'Node.js', mandatory: true },
      { skill: 'AWS', mandatory: false },
      { skill: 'SQL', mandatory: true }
    ]
  },
  {
    title: 'Data Engineer',
    location: 'Pune',
    seniority: 'Mid',
    company: 'Bluehill Analytics',
    requires: [
      { skill: 'Python', mandatory: true },
      { skill: 'SQL', mandatory: true },
      { skill: 'Pandas', mandatory: true },
      { skill: 'AWS', mandatory: false }
    ]
  },
  {
    title: 'Data Scientist',
    location: 'Remote',
    seniority: 'Senior',
    company: 'Bluehill Analytics',
    requires: [
      { skill: 'Python', mandatory: true },
      { skill: 'Pandas', mandatory: true },
      { skill: 'SQL', mandatory: false }
    ]
  },
  {
    title: 'DevOps Engineer',
    location: 'Hyderabad',
    seniority: 'Mid',
    company: 'Ironpeak Systems',
    requires: [
      { skill: 'Docker', mandatory: true },
      { skill: 'Kubernetes', mandatory: true },
      { skill: 'AWS', mandatory: true },
      { skill: 'CI/CD', mandatory: false }
    ]
  },
  {
    title: 'Platform Engineer',
    location: 'Remote',
    seniority: 'Senior',
    company: 'Ironpeak Systems',
    requires: [
      { skill: 'Kubernetes', mandatory: true },
      { skill: 'AWS', mandatory: true },
      { skill: 'CI/CD', mandatory: true }
    ]
  },
  {
    title: 'Junior Frontend Developer',
    location: 'Bangalore',
    seniority: 'Junior',
    company: 'Sunbird Media',
    requires: [
      { skill: 'React', mandatory: true },
      { skill: 'CSS', mandatory: true }
    ]
  },
  {
    title: 'Backend Developer (Python)',
    location: 'Pune',
    seniority: 'Mid',
    company: 'Cascade Health',
    requires: [
      { skill: 'Python', mandatory: true },
      { skill: 'Django', mandatory: true },
      { skill: 'SQL', mandatory: true }
    ]
  },
  {
    title: 'Java Backend Engineer',
    location: 'Chennai',
    seniority: 'Senior',
    company: 'Cascade Health',
    requires: [
      { skill: 'Java', mandatory: true },
      { skill: 'SQL', mandatory: true },
      { skill: 'Docker', mandatory: false }
    ]
  },
  {
    title: 'Graph Database Engineer',
    location: 'Remote',
    seniority: 'Senior',
    company: 'Bluehill Analytics',
    requires: [
      { skill: 'Neo4j', mandatory: true },
      { skill: 'Python', mandatory: true },
      { skill: 'SQL', mandatory: false }
    ]
  },
  {
    title: 'UI Engineer',
    location: 'Remote',
    seniority: 'Mid',
    company: 'Riverstone Retail',
    requires: [
      { skill: 'Vue', mandatory: true },
      { skill: 'CSS', mandatory: true },
      { skill: 'React', mandatory: false }
    ]
  },
  {
    title: 'Cloud Infrastructure Engineer',
    location: 'Bangalore',
    seniority: 'Senior',
    company: 'Ironpeak Systems',
    requires: [
      { skill: 'AWS', mandatory: true },
      { skill: 'Docker', mandatory: true },
      { skill: 'CI/CD', mandatory: true }
    ]
  },
  {
    title: 'Junior Backend Developer',
    location: 'Pune',
    seniority: 'Junior',
    company: 'Northwind Labs',
    requires: [
      { skill: 'Node.js', mandatory: true },
      { skill: 'Express', mandatory: false }
    ]
  },
  {
    title: 'Analytics Engineer',
    location: 'Remote',
    seniority: 'Mid',
    company: 'Sunbird Media',
    requires: [
      { skill: 'SQL', mandatory: true },
      { skill: 'Pandas', mandatory: true },
      { skill: 'Python', mandatory: false }
    ]
  }
];

// --------------------------------------------------
// SEED DATABASE
// --------------------------------------------------

async function seed() {
  const session = driver.session();

  try {
    // 1. Clear existing data
    console.log('Clearing existing data...');

    await session.run(
      'MATCH (n) DETACH DELETE n'
    );

    // 2. Create constraints
    console.log('Creating constraints...');

    await session.run(
      'CREATE CONSTRAINT skill_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE'
    );

    await session.run(
      'CREATE CONSTRAINT skill_normalized_name IF NOT EXISTS FOR (s:Skill) REQUIRE s.normalizedName IS UNIQUE'
    );

    await session.run(
      'CREATE CONSTRAINT company_name IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE'
    );

    // 3. Create skills
    console.log('Creating skills...');

    for (const s of skills) {
      await session.run(
        `MERGE (s:Skill {name: $name})
         SET s.normalizedName = $normalizedName,
             s.category = $category,
             s.aliases = $aliases`,
        {
          name: s.name,
          normalizedName: s.normalizedName,
          category: s.category,
          aliases: s.aliases
        }
      );
    }

    // 4. Create companies
    console.log('Creating companies...');

    for (const c of companies) {
      await session.run(
        `MERGE (c:Company {name: $name})
         SET c.industry = $industry`,
        {
          name: c.name,
          industry: c.industry
        }
      );
    }

    // 5. Create jobs and relationships
    console.log('Creating jobs and relationships...');

    for (const j of jobs) {

      await session.run(
        `MATCH (co:Company {name: $company})
         MERGE (j:Job {
           title: $title,
           company: $company
         })
         SET j.location = $location,
             j.seniority = $seniority
         MERGE (co)-[:POSTS]->(j)`,
        {
          title: j.title,
          company: j.company,
          location: j.location,
          seniority: j.seniority
        }
      );

      // Create REQUIRES relationships
      for (const r of j.requires) {

        await session.run(
          `MATCH (j:Job {
            title: $title,
            company: $company
          })
           MATCH (s:Skill {
            name: $skill
          })
           MERGE (j)-[req:REQUIRES]->(s)
           SET req.mandatory = $mandatory`,
          {
            title: j.title,
            company: j.company,
            skill: r.skill,
            mandatory: r.mandatory
          }
        );
      }
    }

    console.log('');
    console.log('=================================');
    console.log('Seed complete successfully!');
    console.log('=================================');

  } catch (err) {

    console.error('');
    console.error('Seed failed:', err.message);

  } finally {

    await session.close();
    
    await driver.close();

  }
}

seed();