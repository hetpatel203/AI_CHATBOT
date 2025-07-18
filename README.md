# AI Financial Advisor Chatbot

A modern, intelligent financial advisory chatbot built with FastAPI, Angular, and AI-powered responses. Get personalized financial advice, budget management tips, and investment guidance through an intuitive chat interface.

## Features

- 🤖 AI-powered financial advice using advanced language models
- 💰 Budget management and investment guidance
- 🎨 Modern, responsive Angular frontend with Angular Material
- ⚡ Fast API backend with real-time responses
- 📊 Machine learning integration for personalized recommendations
- 🔒 Secure API endpoints with proper error handling

## Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- py-ai-core - AI integration framework
- scikit-learn - Machine learning capabilities
- Poetry - Dependency management

**Frontend:**
- Angular 17 - Modern TypeScript framework
- Angular Material - UI component library
- RxJS - Reactive programming
- HttpClient - HTTP communication

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Poetry (recommended) or pip

### Backend Setup
```bash
cd backend
poetry install
poetry run python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Project Structure

```
ai-financial-advisor/
├── backend/           # FastAPI backend
├── frontend/          # Angular frontend
├── docs/             # Documentation
├── tests/            # Test files
└── README.md         # This file
```

## API Endpoints

- `POST /api/chat` - Send message to AI advisor
- `GET /api/health` - Health check endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details#
