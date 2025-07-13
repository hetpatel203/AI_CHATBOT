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

# Import required libraries and modules
from fastapi import FastAPI                    # Modern Python web framework
from fastapi.middleware.cors import CORSMiddleware  # Cross-Origin Resource Sharing
from pydantic import BaseModel                 # Data validation and serialization
import requests                                # HTTP client for API calls
import json                                    # JSON data handling
import os                                      # Operating system interface
from dotenv import load_dotenv                 # Load environment variables from .env file

# Load environment variables from .env file (like API keys)
load_dotenv()

# Create FastAPI application instance
app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
# CORS = Cross-Origin Resource Sharing (security feature of web browsers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow requests from any domain (* = wildcard)
    allow_credentials=True,     # Allow cookies and authentication headers
    allow_methods=["*"],        # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all request headers
)

# Pydantic models define the structure of request/response data
# These provide automatic validation and documentation

class ChatMessage(BaseModel):
    """Model for incoming chat messages from frontend"""
    message: str    # The user's question/message

class ChatResponse(BaseModel):
    """Model for outgoing responses to frontend"""
    response: str   # The AI's response message

# API endpoint to check if server is running
# GET request to /api/health
@app.get("/api/health")
def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy"}

def get_ai_response(message: str) -> str:
    """Function to get AI response from Groq API or provide fallback responses"""
    
    # Get API key from environment variables
    api_key = os.getenv('GROQ_API_KEY')
    # Debug: Print first 10 characters of API key (for troubleshooting)
    print(f"API Key loaded: {api_key[:10]}..." if api_key else "No API key found")
    
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
        
        # Debug: Print API response status
        print(f"API Response Status: {response.status_code}")
        
        # Check if API call was successful (HTTP 200)
        if response.status_code == 200:
            # Parse JSON response
            data = response.json()
            # Extract the AI's message content and remove extra whitespace
            return data["choices"][0]["message"]["content"].strip()
        else:
            # Print error details for debugging
            print(f"API Error: {response.text}")
            
    except Exception as e:
        # Catch any errors (network issues, JSON parsing, etc.)
        print(f"Exception: {e}")
    
    # Fallback responses when AI API fails
    # Use keyword matching to provide relevant financial advice
    if 'budget' in message.lower():
        return "Track your income and expenses. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
    elif 'invest' in message.lower():
        return "Start with low-cost index funds. Invest regularly and don't try to time the market."
    elif 'debt' in message.lower():
        return "Pay minimum on all debts, then focus extra payments on the highest interest rate debt first."
    else:
        return "I can help with budgeting, investing, and debt management. What specific area interests you?"
    
# Main chat endpoint - handles POST requests to /api/chat
@app.post("/api/chat")
def chat_endpoint(message: ChatMessage):
    """Main chat endpoint that receives user messages and returns AI responses"""
    # Call the AI response function with user's message
    response = get_ai_response(message.message)
    # Return response in the expected format (ChatResponse model)
    return ChatResponse(response=response)

# This block runs only when script is executed directly (not imported)
if __name__ == "__main__":
    import uvicorn  # ASGI server for running FastAPI
    # Start the server
    uvicorn.run(
        app,                    # FastAPI application instance
        host="0.0.0.0",        # Listen on all network interfaces
        port=8002               # Port number to run server on
    )