import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function getMatchTier(score) {
  if (score >= 0.66) return 'high';
  if (score >= 0.34) return 'mid';
  return 'low';
}

function App() {
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/skills`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load skills');
        return res.json();
      })
      .then(data => {
        setAllSkills(data);
        setLoadingSkills(false);
      })
      .catch(() => {
        setError('Could not connect to the server. Is the backend running?');
        setLoadingSkills(false);
      });
  }, []);

  function toggleSkill(name) {
    setSelectedSkills(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  }

  function addSkill(name) {
    if (!selectedSkills.includes(name)) {
      setSelectedSkills(prev => [...prev, name]);
    }
    setQuery('');
  }

  function removeSkill(name) {
    setSelectedSkills(prev => prev.filter(s => s !== name));
  }

  function matchesQuery(skill, q) {
    const lower = q.toLowerCase();
    if (skill.name.toLowerCase().includes(lower)) return true;
    if (Array.isArray(skill.aliases)) {
      return skill.aliases.some(a => a.toLowerCase().includes(lower));
    }
    return false;
  }

  const typeaheadResults = query
    ? allSkills.filter(s => matchesQuery(s, query) && !selectedSkills.includes(s.name)).slice(0, 6)
    : [];

  function handleKeyDown(e) {
    if (e.key === 'Enter' && typeaheadResults.length > 0) {
      e.preventDefault();
      addSkill(typeaheadResults[0].name);
    }
  }

  async function findMatches() {
    setError(null);
    setLoadingMatches(true);
    setMatches(null);
    try {
      const [matchRes, nextRes] = await Promise.all([
        fetch(`${API_URL}/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: selectedSkills })
        }),
        fetch(`${API_URL}/next-skill`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: selectedSkills })
        })
      ]);
      if (!matchRes.ok || !nextRes.ok) throw new Error('Request failed');
      setMatches(await matchRes.json());
      setSuggestions(await nextRes.json());
    } catch (err) {
      setError('Something went wrong fetching matches. Please try again.');
    } finally {
      setLoadingMatches(false);
    }
  }

  const grouped = allSkills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="app">
      <header>
        <div className="mark" aria-hidden="true">
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
            <line x1="6" y1="20" x2="17" y2="6" stroke="#4338CA" strokeWidth="1.6" />
            <line x1="17" y1="6" x2="28" y2="20" stroke="#0D9488" strokeWidth="1.6" />
            <circle cx="6" cy="20" r="4" fill="#4338CA" />
            <circle cx="17" cy="6" r="4" fill="#0D9488" />
            <circle cx="28" cy="20" r="4" fill="#CA8A04" />
          </svg>
        </div>
        <h1>Job Match Explorer</h1>
        <p>Type or browse your skills to see which jobs fit — and what to learn next.</p>
      </header>

      {error && (
        <div className="banner error">
          <span className="banner-label">Connection issue</span>
          {error}
        </div>
      )}

      {loadingSkills ? (
        <div className="banner loading">
          <span className="banner-label">Loading</span>
          Fetching skills from the graph...
        </div>
      ) : (
        <>
          <div className="search-wrap">
            <input
              type="text"
              className="skill-search"
              placeholder="Type a skill (e.g. react, node, k8s)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && typeaheadResults.length > 0 && (
              <ul className="suggestions-dropdown">
                {typeaheadResults.map(s => (
                  <li key={s.name} onClick={() => addSkill(s.name)}>
                    {s.name} <span className="cat-tag" data-cat={s.category}>{s.category}</span>
                  </li>
                ))}
              </ul>
            )}
            {query && typeaheadResults.length === 0 && (
              <div className="no-suggestions">No matching skill found.</div>
            )}
          </div>

          {selectedSkills.length > 0 && (
            <div className="selected-tags">
              {selectedSkills.map(name => (
                <span key={name} className="tag">
                  {name}
                  <button onClick={() => removeSkill(name)} aria-label={`Remove ${name}`}>×</button>
                </span>
              ))}
            </div>
          )}

          <section className="skills-panel">
            {Object.entries(grouped).map(([category, skills]) => (
              <div key={category} className="skill-group">
                <h3>{category}</h3>
                <div className="skill-chips">
                  {skills.map(s => (
                    <label
                      key={s.name}
                      className={`chip ${selectedSkills.includes(s.name) ? 'selected' : ''}`}
                      data-cat={s.category}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(s.name)}
                        onChange={() => toggleSkill(s.name)}
                      />
                      <span className="chip-dot" aria-hidden="true"></span>
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <button
            className="find-btn"
            disabled={selectedSkills.length === 0 || loadingMatches}
            onClick={findMatches}
          >
            {loadingMatches ? 'Searching...' : `Find Matches (${selectedSkills.length} skills selected)`}
          </button>
        </>
      )}

      {matches && (
        <section className="results">
          <h2>Job Matches</h2>
          {matches.length === 0 ? (
            <p className="empty-state">No jobs match these skills yet. Try selecting a few more.</p>
          ) : (
            <ul className="job-list">
              {matches.map((m, i) => (
                <li key={i} className={`job-card tier-${getMatchTier(m.matchScore)}`}>
                  <div className="job-title">{m.title}</div>
                  <div className="job-company">{m.company} · {m.location} · {m.seniority}</div>
                  <div className="job-score">
                    {m.matchedSkills}/{m.totalRequired} skills matched · {Math.round(m.matchScore * 100)}%
                  </div>
                </li>
              ))}
            </ul>
          )}

          {suggestions.length > 0 && (
            <div className="suggestions">
              <h3>Learn one of these next to unlock more jobs</h3>
              <ul>
                {suggestions.map((s, i) => (
                  <li key={i}>
                    <span className="plus">+</span>
                    <span className="suggestion-name">{s.skill}</span>
                    <span className="suggestion-count">unlocks {s.jobsUnlocked}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
