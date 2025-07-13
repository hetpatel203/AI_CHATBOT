# Backend main.py - Complete Code Explanation

## Overview
This file creates a FastAPI-based web server that provides an AI-powered financial advisory chatbot. It integrates with the Groq API to generate intelligent responses and includes fallback mechanisms for reliability.

## Code Structure Breakdown

### 1. File Header & Documentation
```python
"""
AI Financial Advisor Backend

This is a FastAPI-based backend server that provides financial advice through AI.
It uses the Groq API (with Llama3 model) to generate intelligent responses,
with fallback responses when the AI service is unavailable.

Key Features:
- RESTful API endpoints
- AI-powered responses via Groq API
- Fallback keyword-based responses
- CORS enabled for frontend communication
- Environment variable configuration
"""
```
**Purpose**: Documents the entire application's purpose and key features.

### 2. Import Statements
```python
from fastapi import FastAPI                    # Modern Python web framework
from fastapi.middleware.cors import CORSMiddleware  # Cross-Origin Resource Sharing
from pydantic import BaseModel                 # Data validation and serialization
import requests                                # HTTP client for API calls
import json                                    # JSON data handling
import os                                      # Operating system interface
from dotenv import load_dotenv                 # Load environment variables from .env file

load_dotenv()
```

**Explanation**:
- **FastAPI**: Creates web APIs with automatic documentation
- **CORSMiddleware**: Allows frontend (different port) to communicate with backend
- **BaseModel**: Validates incoming/outgoing data structure
- **requests**: Makes HTTP calls to external APIs (Groq)
- **json**: Handles JSON data parsing
- **os**: Accesses environment variables
- **dotenv**: Loads API keys from .env file securely
- **load_dotenv()**: Executes immediately to load environment variables

### 3. FastAPI Application Setup
```python
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow requests from any domain (* = wildcard)
    allow_credentials=True,     # Allow cookies and authentication headers
    allow_methods=["*"],        # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all request headers
)
```

**Explanation**:
- **app = FastAPI()**: Creates the main web application instance
- **CORS Middleware**: Solves browser security restrictions
  - **allow_origins=["*"]**: Permits requests from any website (development setting)
  - **allow_credentials=True**: Allows authentication data
  - **allow_methods=["*"]**: Permits GET, POST, PUT, DELETE, etc.
  - **allow_headers=["*"]**: Allows custom headers in requests

### 4. Data Models (Pydantic)
```python
class ChatMessage(BaseModel):
    """Model for incoming chat messages from frontend"""
    message: str    # The user's question/message

class ChatResponse(BaseModel):
    """Model for outgoing responses to frontend"""
    response: str   # The AI's response message
```

**Explanation**:
- **Pydantic Models**: Define data structure and provide automatic validation
- **ChatMessage**: Validates incoming requests have a 'message' field
- **ChatResponse**: Ensures responses have a 'response' field
- **Type Hints**: `str` ensures data is text, not numbers or other types

### 5. Health Check Endpoint
```python
@app.get("/api/health")
def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy"}
```

**Explanation**:
- **@app.get()**: Decorator that creates a GET endpoint
- **"/api/health"**: URL path for this endpoint
- **Purpose**: Allows monitoring systems to check if server is running
- **Returns**: Simple JSON response indicating server status

### 6. AI Response Function (Core Logic)
```python
def get_ai_response(message: str) -> str:
    """Function to get AI response from Groq API or provide fallback responses"""
    
    # Get API key from environment variables
    api_key = os.getenv('GROQ_API_KEY')
    print(f"API Key loaded: {api_key[:10]}..." if api_key else "No API key found")
```

**Environment Variable Loading**:
- **os.getenv()**: Safely retrieves API key from environment
- **Debug Print**: Shows first 10 characters for troubleshooting (security safe)

```python
    try:
        # Make HTTP POST request to Groq AI API
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",  # Groq API endpoint
            headers={
                "Authorization": f"Bearer {api_key}",    # API authentication
                "Content-Type": "application/json"       # Request format
            },
            json={  # Request body (JSON format)
                "model": "llama3-8b-8192",              # AI model to use
                "messages": [                           # Conversation context
                    # System message defines AI's role and behavior
                    {"role": "system", "content": "You are a financial advisor. Give brief, practical advice."},
                    # User message is the actual question
                    {"role": "user", "content": message}
                ],
                "max_tokens": 300    # Limit response length
            },
            timeout=10  # Wait max 10 seconds for response
        )
```

**API Call Breakdown**:
- **requests.post()**: Makes HTTP POST request to Groq API
- **URL**: Groq's OpenAI-compatible endpoint
- **Headers**: Authentication and content type
- **JSON Body**: 
  - **model**: Specifies which AI model to use
  - **messages**: Array with system prompt and user question
  - **max_tokens**: Limits response length to control costs
- **timeout**: Prevents hanging if API is slow

```python
        print(f"API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
        else:
            print(f"API Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")
```

**Response Handling**:
- **Status Code Check**: 200 means success
- **JSON Parsing**: Extracts AI response from API response structure
- **Error Handling**: Prints errors for debugging
- **Exception Catching**: Handles network errors, timeouts, etc.

```python
    # Fallback responses when AI API fails
    if 'budget' in message.lower():
        return "Track your income and expenses. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
    elif 'invest' in message.lower():
        return "Start with low-cost index funds. Invest regularly and don't try to time the market."
    elif 'debt' in message.lower():
        return "Pay minimum on all debts, then focus extra payments on the highest interest rate debt first."
    else:
        return "I can help with budgeting, investing, and debt management. What specific area interests you?"
```

**Fallback System**:
- **Keyword Matching**: Checks for financial terms in user message
- **message.lower()**: Converts to lowercase for case-insensitive matching
- **Predefined Responses**: Provides helpful advice even when AI fails
- **Default Response**: Catches all other cases

### 7. Main Chat Endpoint
```python
@app.post("/api/chat")
def chat_endpoint(message: ChatMessage):
    """Main chat endpoint that receives user messages and returns AI responses"""
    response = get_ai_response(message.message)
    return ChatResponse(response=response)
```

**Explanation**:
- **@app.post()**: Creates POST endpoint (for sending data)
- **"/api/chat"**: URL path for chat functionality
- **message: ChatMessage**: Automatically validates incoming data
- **Function Flow**: Receives message → calls AI function → returns response
- **ChatResponse()**: Wraps response in proper format for frontend

### 8. Server Startup
```python
if __name__ == "__main__":
    import uvicorn  # ASGI server for running FastAPI
    uvicorn.run(
        app,                    # FastAPI application instance
        host="0.0.0.0",        # Listen on all network interfaces
        port=8002               # Port number to run server on
    )
```

**Explanation**:
- **if __name__ == "__main__"**: Only runs when script is executed directly
- **uvicorn**: ASGI server that runs FastAPI applications
- **host="0.0.0.0"**: Allows connections from any IP address
- **port=8002**: Server listens on port 8002

## Data Flow Summary

1. **Startup**: Server loads environment variables and starts on port 8002
2. **Request**: Frontend sends POST request to `/api/chat` with user message
3. **Validation**: Pydantic validates request has required 'message' field
4. **AI Processing**: Server calls Groq API with user message
5. **Response**: AI generates financial advice or fallback response is used
6. **Return**: Server sends response back to frontend in JSON format

## Security Features

- **Environment Variables**: API keys stored in .env file, not in code
- **Input Validation**: Pydantic ensures data integrity
- **Error Handling**: Graceful fallbacks prevent crashes
- **CORS Configuration**: Controls which websites can access the API
- **Timeout Protection**: Prevents hanging on slow API calls

## Configuration Files Required

### .env file:
```
GROQ_API_KEY=your_actual_api_key_here
```

### requirements.txt:
```
fastapi
uvicorn
requests
python-multipart
python-dotenv
```

## Running the Server

```bash
# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```

Server will be available at: `http://localhost:8002`
API documentation at: `http://localhost:8002/docs`

This backend provides a robust, scalable foundation for an AI-powered financial advisory chatbot with proper error handling and security practices.