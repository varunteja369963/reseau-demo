import { X, Send, MessageSquare, Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useState, useRef } from "react";

interface ChatPanelProps {
  onToggle: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export const ChatPanel = ({ onToggle }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I assist you today?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I received your message. How can I help you further?',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="bg-card rounded-3xl shadow-soft h-[700px] flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">AI Assistant</h3>
          </div>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close chat panel"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-[hsl(var(--teal))] to-[hsl(var(--blue))] text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                console.log('Files selected:', Array.from(files).map(f => f.name));
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-11 w-11 rounded-2xl border-border hover:bg-muted transition-smooth flex-shrink-0 p-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="rounded-2xl border-border bg-background h-11"
          />
          <Button 
            onClick={handleSend}
            className="h-11 w-11 rounded-2xl gradient-teal text-white shadow-soft hover:shadow-medium transition-smooth flex-shrink-0 p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
