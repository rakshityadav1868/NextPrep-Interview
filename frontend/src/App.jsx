import { useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [jobsDesc, setJobDesc] = useState("");
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!jobsDesc.trim()) {
      setError("Job description cannot be empty.");
      return;
    }
    setLoading(true);
    setError("");
    setSkills([]);
    setQuestions([]);

    const formdata = new FormData();
    formdata.append("job_desc", jobsDesc);

    try {
      const response = await axios.post("http://localhost:8000/analyze", formdata, { timeout: 60000 });
      setSkills(response.data.skills || []);
      setQuestions(response.data.questions || []);
    } catch (err) {
      setError("Failed to analyze the job description. The server might be down or the request timed out.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NextPrep</h1>
        <p>Your AI-Powered Interview Preparation Assistant</p>
      </header>

      <main className="container">
        <div className="input-section">
          <textarea
            placeholder='Paste the job description here...'
            rows="12"
            value={jobsDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            disabled={loading}
          />
          <button onClick={analyze} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading && <div className="loader"></div>}

        {!loading && (skills.length > 0 || questions.length > 0) && (
          <div className="results-section">
            {skills.length > 0 && (
              <div className="skills-container">
                <h2>Extracted Skills</h2>
                <table className="skills-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <tr key={index}>
                        <td>{skill.skill}</td>
                        <td>{skill.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {questions.length > 0 && (
              <div className="questions-container">
                <h2>Interview Questions</h2>
                {questions.map((q, index) => (
                  <div key={index} className="question-card">
                    <p className="question-text">{q.question}</p>
                    <div className="question-meta">
                      <span className="badge difficulty">{q.difficulty}</span>
                      <span className="badge category">{q.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;