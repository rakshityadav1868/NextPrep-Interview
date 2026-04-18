# NextPrep - Interview Prep Application

A full-stack web application that helps job seekers prepare for interviews by analyzing job descriptions, extracting key skills, and generating relevant interview questions using AI.

## Features

- **Job Description Analysis**: Paste a job description to extract relevant skills
- **Skill Categorization**: Automatically categorize extracted skills as Technical, Soft Skill, or Domain knowledge
- **AI-Generated Questions**: Get 10 interview questions tailored to the job requirements
- **Real-time Processing**: Fast analysis with loading states for better UX

## Tech Stack

### Backend
- **Framework**: FastAPI
- **NLP**: spaCy (en_core_web_sm model)
- **ML**: Hugging Face Transformers (zero-shot-classification)
- **AI**: Google Generative AI (Gemini 2.5-flash)
- **Data**: pandas
- **Server**: Uvicorn

### Frontend
- **Framework**: React with Vite
- **HTTP Client**: Axios
- **Styling**: CSS (basic)

## Project Structure

```
NextPrep/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── .env                 # Environment variables (GEMINI_API_KEY)
│   └── requirment.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── ...
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Python 3.13+
- Node.js 16+
- Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/))

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirment.txt
```

4. Create `.env` file and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

5. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

6. Run the server:
```bash
uvicorn main:app --reload
```
Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

## How to Use

1. Open `http://localhost:5173` in your browser
2. Paste a job description in the textarea
3. Click the "Analyze" button
4. Wait for processing (you'll see "Analyzing..." text)
5. View extracted skills and interview questions

## API Endpoints

### POST `/analyze`
Analyzes a job description and returns skills and interview questions.

**Request:**
```
Content-Type: application/x-www-form-urlencoded
Body: job_desc=<job_description_text>
```

**Response:**
```json
{
  "skills": [
    {
      "skill": "Python",
      "category": "Technical"
    },
    {
      "skill": "AWS",
      "category": "Technical"
    }
  ],
  "questions": [
    {
      "question": "What experience do you have with Python?",
      "difficulty": "easy",
      "category": "Technical"
    },
    {
      "question": "How would you deploy an application on AWS?",
      "difficulty": "medium",
      "category": "Technical"
    }
  ]
}
```

## Dependencies

### Backend (`requirment.txt`)
- fastapi
- uvicorn
- spacy
- transformers
- google-generativeai
- pandas
- python-dotenv

### Frontend
- react
- axios
- vite

## Notes

- The application uses Gemini 2.5-flash model which has free tier rate limits
- spaCy extracts nouns (NOUN, PROPN) as keywords from job descriptions
- Transformers zero-shot classifier categorizes skills without fine-tuning
- Frontend has 60-second timeout for API requests
- CORS is enabled for local development

## Troubleshooting

### Empty Questions Issue
If questions aren't appearing:
1. Check browser console for errors
2. Verify Gemini API key is valid and has quota
3. Check backend logs for JSON parsing errors

### Backend Errors
- Ensure all dependencies are installed: `pip install -r requirment.txt`
- Verify spaCy model is downloaded: `python -m spacy download en_core_web_sm`
- Check `.env` file has valid GEMINI_API_KEY

### Frontend Not Connecting
- Ensure backend is running on `http://localhost:8000`
- Check CORS is properly configured (should be in main.py)
- Verify frontend is running on `http://localhost:5173`

## Future Enhancements

- Add CSS styling/Tailwind CSS for better UI
- Add authentication
- Save analysis history
- Export questions as PDF
- Add mock interview feature with speech-to-text
- Support for multiple job description formats

## License

MIT

## Author

Rakshit Yadav
