'use client';

import { useState, useRef, useEffect } from 'react';
import { askAI } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, CornerDownLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CryptoIcon from './crypto-icon';

interface AiAssistantProps {
  selectedCryptoSymbol: string;
  selectedCryptoName: string;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export default function AiAssistant({
  selectedCryptoSymbol,
  selectedCryptoName,
}: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askAI({
        query: input,
        symbol: selectedCryptoSymbol,
      });
      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: result.answer,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle>AI Crypto Assistant</CardTitle>
        <CardDescription>
          Ask anything about {selectedCryptoName} or other cryptocurrencies.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.sender === 'ai' ? (
                       <Bot className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                    message.sender === 'ai'
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 flex-row">
                 <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <Bot className="w-5 h-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-3 bg-secondary">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></span>
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></span>
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., What is the market cap?"
            disabled={isLoading}
            className="pr-12 h-12 text-base"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={isLoading || !input.trim()}
          >
            <CornerDownLeft className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
