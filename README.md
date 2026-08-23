Job Match Explorer

A graph-database powered job matching app. Select or search your skills and discover which jobs fit — and which single skill to learn next to unlock the most new matches.

🔗 Live demo: job-match-explorer.vercel.app (replace with your real Vercel URL)
🎥 Screen recording: Watch demo (replace with your recording link — Loom, YouTube unlisted, or a file in the repo)
💻 Repository: github.com/your-username/job-skill-graph

Overview

Job Match Explorer models the relationship between skills, jobs, and companies as a graph rather than a set of relational tables. A user selects or types in their skills, and the app runs a multi-hop Cypher traversal — Skill ← REQUIRES ← Job ← POSTS ← Company — to rank every job by how well it matches, and separately surfaces which single new skill would unlock the greatest number of additional job matches.

That second query is deliberately the kind SQL handles awkwardly: it needs a negated existence check layered across two many-to-many relationships (jobs I don't yet qualify for, that still share at least one skill I already have). In Cypher it's a single pattern; in SQL it becomes nested correlated subqueries. That gap is the actual argument for why this use case benefits from a graph database, not just why it was modeled as one.

Stack: React (Vite) · Express · CognoDB (Neo4j-compatible graph DB, Bolt protocol) · deployed on Vercel + Render.
