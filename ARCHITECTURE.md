# AI Financial Advisor - Architecture Overview

## Project Structure
```
chatbot/
├── backend/           # Python FastAPI server
│   ├── main.py       # Main server file with API endpoints
│   ├── .env          # Environment variables (API keys)
│   └── requirements.txt
├── frontend/         # Angular web application
│   ├── src/
│   │   ├── app/
│   │   │   └── app.component.ts  # Main chat component
│   │   ├── main.ts   # Angular bootstrap
│   │   └── index.html
│   ├── package.json  # Node.js dependencies
│   └── angular.json  # Angular configuration
└── README.md
```

## Technology Stack

### Backend (Python)
- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server to run FastAPI
- **Requests**: HTTP client for API calls
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management

### Frontend (Angular)
- **Angular 17**: TypeScript-based web framework
- **HttpClient**: For API communication
- **FormsModule**: Two-way data binding
- **CommonModule**: Basic Angular directives

### AI Integration
- **Groq API**: Free AI service using Llama3 model
- **Fallback System**: Keyword-based responses when AI fails

## Data Flow

1. **User Input**: User types message in Angular frontend
2. **HTTP Request**: Frontend sends POST request to backend
3. **AI Processing**: Backend calls Groq API with user message
4. **Response**: AI generates financial advice
5. **Display**: Frontend displays response in chat interface

## Key Components

### Frontend (app.component.ts)
- **Template**: HTML structure with chat interface
- **Styles**: CSS for modern chat UI
- **Component Class**: TypeScript logic for handling messages
- **HTTP Service**: Communication with backend API
- **Local Storage**: Persists chat history

### Backend (main.py)
- **FastAPI App**: Web server instance
- **CORS Middleware**: Allows frontend-backend communication
- **Pydantic Models**: Data structure validation
- **AI Function**: Handles Groq API calls
- **Endpoints**: /api/health and /api/chat

## Security Features
- **Environment Variables**: API keys stored securely
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Pydantic models validate data
- **Error Handling**: Graceful fallbacks for API failures

## Development Workflow
1. Start backend: `python main.py` (port 8002)
2. Start frontend: `ng serve` (port 4200)
3. Frontend communicates with backend via HTTP
4. Backend processes requests and returns responses