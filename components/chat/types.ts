export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }
  
  export interface ChatProps {
    className?: string;
    placeholder?: string;
    welcomeMessage?: string;
  }