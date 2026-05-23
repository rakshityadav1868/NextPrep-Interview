import { useState } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    try {
      const response = await axios.post(`${API_URL}/analyze`, formdata, { timeout: 60000 });
      setSkills(response.data.skills || []);
      setQuestions(response.data.questions || []);
    } catch (err) {
      setError("Failed to analyze the job description. The server might be down or the request timed out.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Framer motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: {
      y: -5,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <div className="App">
      <motion.header 
        className="App-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <h1>NextPrep</h1>
        <p>Your AI-Powered Interview Preparation Assistant</p>
      </motion.header>

      <main className="container">
        <motion.div 
          className="input-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
        >
          <textarea
            placeholder='Paste the job description here...'
            rows="10"
            value={jobsDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            disabled={loading}
          />
          <motion.button 
            onClick={analyze} 
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, backgroundColor: "#333333" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p 
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {loading && <div className="loader"></div>}

        {!loading && (skills.length > 0 || questions.length > 0) && (
          <motion.div 
            className="results-section"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {skills.length > 0 && (
              <motion.div className="skills-container" variants={itemVariants}>
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
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td>{skill.skill}</td>
                        <td>{skill.category}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {questions.length > 0 && (
              <motion.div className="questions-container" variants={itemVariants}>
                <h2>Interview Questions</h2>
                {questions.map((q, index) => (
                  <motion.div 
                    key={index} 
                    className="question-card"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <p className="question-text">{q.question}</p>
                    <div className="question-meta">
                      <span className="badge difficulty">{q.difficulty}</span>
                      <span className="badge category">{q.category}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;