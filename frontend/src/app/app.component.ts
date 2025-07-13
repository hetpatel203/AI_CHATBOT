// Import necessary Angular modules and services
import { Component } from '@angular/core';           // Core Angular component decorator
import { CommonModule } from '@angular/common';     // Common directives like *ngFor, *ngIf
import { FormsModule } from '@angular/forms';       // Two-way data binding with [(ngModel)]
import { HttpClient } from '@angular/common/http';  // HTTP client for API calls

// Component decorator - defines this class as an Angular component
@Component({
  selector: 'app-root',        // HTML tag name to use this component
  standalone: true,            // Modern Angular standalone component (no module needed)
  imports: [CommonModule, FormsModule],  // Import required modules for this component
  // HTML template for the component - defines the user interface
  template: `
    <!-- Main container for the entire chat interface -->
    <div class="container">
      <!-- Application title -->
      <h1>AI Financial Advisor</h1>
      
      <!-- Chat messages display area -->
      <div class="chat-box">
        <!-- Loop through all messages and display them -->
        <!-- *ngFor is Angular directive to repeat elements -->
        <!-- [class] dynamically sets CSS class based on message type -->
        <div *ngFor="let msg of messages" [class]="'message ' + msg.type">
          <!-- Show 'You' for user messages, 'AI' for bot messages -->
          <!-- {{ }} is Angular interpolation to display data -->
          <strong>{{msg.type === 'user' ? 'You' : 'AI'}}:</strong> {{msg.content}}
        </div>
      </div>
      
      <!-- Input area for typing and sending messages -->
      <div class="input-area">
        <!-- Input field with two-way data binding -->
        <!-- [(ngModel)] creates two-way binding with inputMessage property -->
        <!-- (keyup.enter) listens for Enter key press -->
        <input [(ngModel)]="inputMessage" 
               (keyup.enter)="sendMessage()"
               placeholder="Ask about budgeting, investing, etc.">
        <!-- Send button with click handler and disabled state -->
        <!-- [disabled] dynamically disables button when loading -->
        <button (click)="sendMessage()" [disabled]="loading">Send</button>
      </div>
    </div>
  `,
  styles: [`
    html, body, #root, app-root {
      height: 100vh !important;
      min-height: 100vh !important;
      max-height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #f4f6fb !important;
      overflow: hidden !important;
      position: fixed !important;
      width: 100vw !important;
    }
    .container {
      max-width: 750px;
      height: 96vh;
      min-height: 600px;
      margin: 2vh auto;
      padding: 40px 36px 28px 36px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
      border: 1px solid #e3e8f0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    h1 {
      text-align: center;
      color: #2d3a4a;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 18px;
      background: linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .chat-box {
      flex: 1 1 auto;
      min-height: 0;
      border-radius: 12px;
      border: 1.5px solid #e3e8f0;
      padding: 22px 18px;
      overflow-y: auto;
      margin: 28px 0 18px 0;
      background: linear-gradient(135deg, #f7fafc 60%, #e3f0ff 100%);
      box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.06);
      transition: box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      max-height: 100%;
    }
    .chat-box::-webkit-scrollbar {
      width: 8px;
      background: #e3e8f0;
      border-radius: 8px;
    }
    .chat-box::-webkit-scrollbar-thumb {
      background: #b6c6e3;
      border-radius: 8px;
    }
    .message {
      margin: 12px 0;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 1.08rem;
      box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.04);
      transition: background 0.2s;
      word-break: break-word;
      line-height: 1.6;
    }
    .message.user {
      background: linear-gradient(90deg, #e3f0ff 60%, #d1f7e7 100%);
      align-self: flex-end;
      border-bottom-right-radius: 2px;
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      color: #2d3a4a;
      font-weight: 500;
    }
    .message.bot {
      background: linear-gradient(90deg, #f7fafc 60%, #e3e8f0 100%);
      align-self: flex-start;
      border-bottom-left-radius: 2px;
      border-top-right-radius: 16px;
      border-top-left-radius: 16px;
      border-bottom-right-radius: 16px;
      color: #3b4a5a;
    }
    .input-area {
      display: flex;
      gap: 12px;
      margin-top: 8px;
      align-items: center;
      background: #f7fafc;
      border-radius: 8px;
      padding: 10px 12px;
      box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.04);
      border: 1px solid #e3e8f0;
    }
    input {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      font-size: 1.08rem;
      background: #f4f6fb;
      color: #2d3a4a;
      outline: none;
      transition: box-shadow 0.2s;
      box-shadow: 0 1px 2px 0 rgba(31, 38, 135, 0.03);
    }
    input:focus {
      box-shadow: 0 0 0 2px #4f8cff33;
      background: #e3f0ff;
    }
    button {
      padding: 12px 28px;
      background: linear-gradient(90deg, #4f8cff 0%, #6ee7b7 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.08rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
      transition: background 0.2s, box-shadow 0.2s;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #b6c6e3;
    }
  `]
})
// Main component class - contains all the logic and data
export class AppComponent {
  // Component properties (data that the template can access)
  messages: any[] = [];        // Array to store all chat messages
  inputMessage = '';           // Current text in the input field
  loading = false;             // Flag to show loading state

  // Constructor - runs when component is created
  // Dependency injection: Angular provides HttpClient instance
  constructor(private http: HttpClient) {
    // Load previous chat messages from browser's local storage
    const saved = localStorage.getItem('chatbot-messages');
    if (saved) {
      // Parse JSON string back to array and restore messages
      this.messages = JSON.parse(saved);
      // Scroll to bottom after a short delay to show latest messages
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // Method called when user sends a message
  sendMessage() {
    // Check if input is empty or only whitespace - exit if so
    if (!this.inputMessage.trim()) return;

    // Add user's message to the messages array
    this.messages.push({ type: 'user', content: this.inputMessage });
    // Save messages to browser storage
    this.saveMessages();
    // Set loading state to true (disables send button)
    this.loading = true;

    // Make HTTP POST request to backend API
    // <any> tells TypeScript we expect any type of response
    this.http.post<any>('http://localhost:8002/api/chat', { message: this.inputMessage })
      .subscribe({  // Subscribe to the HTTP response (Observable pattern)
        // Success callback - runs when API call succeeds
        next: (res) => {
          // Add AI response to messages array
          this.messages.push({ type: 'bot', content: res.response });
          this.saveMessages();  // Save updated messages
          this.loading = false; // Stop loading state
          // Scroll to show new message after DOM updates
          setTimeout(() => this.scrollToBottom(), 100);
        },
        // Error callback - runs when API call fails
        error: () => {
          // Add error message to chat
          this.messages.push({ type: 'bot', content: 'Error connecting to server' });
          this.saveMessages();
          this.loading = false;
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });

    // Clear the input field after sending
    this.inputMessage = '';
    // Scroll to bottom to show user's message
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // Helper method to save messages to browser's local storage
  saveMessages() {
    // Convert messages array to JSON string and store in localStorage
    // This persists chat history even after page refresh
    localStorage.setItem('chatbot-messages', JSON.stringify(this.messages));
  }

  // Helper method to automatically scroll chat to bottom
  scrollToBottom() {
    // Find the chat box element in the DOM
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
      // Set scroll position to maximum (bottom)
      // scrollHeight is total height, scrollTop is current scroll position
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
}