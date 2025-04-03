"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Loader2, Mic, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  language?: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSubmit(undefined, transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Auto-detect language if possible
      const detectedLanguage = text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/) ? 'ja-JP' :
        text.match(/[\u0900-\u097F]/) ? 'hi-IN' : 'en-US';
      utterance.lang = detectedLanguage;

      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, voiceInput?: string) => {
    e?.preventDefault();
    const messageText = voiceInput || input.trim();
    if ((!messageText && !voiceInput) || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          // Add a delay and retry once
          await new Promise(resolve => setTimeout(resolve, 2000));
          const retryResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
          });
          
          if (!retryResponse.ok) {
            throw new Error('Still experiencing high traffic. Please try again in a moment.');
          }
          
          const retryData = await retryResponse.json();
          const assistantMessage = { role: 'assistant' as const, content: retryData.message };
          setMessages(prev => [...prev, assistantMessage]);
          speakMessage(retryData.message);
          return;
        }
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage = { role: 'assistant' as const, content: data.message };
      setMessages(prev => [...prev, assistantMessage]);
      speakMessage(data.message);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage = 
        error.message === 'Still experiencing high traffic. Please try again in a moment.' ?
          error.message :
          'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 bg-green-600 hover:bg-green-500"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-20 right-4 w-[350px] z-50"
          >
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Farm Assistant</h2>
                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={stopSpeaking}
                      className="hover:bg-neutral-700"
                    >
                      <VolumeX className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakMessage(messages[messages.length - 1]?.content || '')}
                      className="hover:bg-neutral-700"
                      disabled={!messages.length}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-neutral-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                {isListening && (
                  <div className="absolute top-0 left-0 right-0 bg-green-600/10 text-green-500 py-2 px-4 flex items-center justify-center gap-2">
                    <div className="relative">
                      <Mic className="h-5 w-5 animate-pulse" />
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                    </div>
                    <span className="text-sm">Listening...</span>
                  </div>
                )}
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-neutral-700 text-neutral-100'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-neutral-700 rounded-lg px-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-700">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask about farming or weather..."}
                    className="bg-neutral-700 border-neutral-600"
                    disabled={isListening}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "transition-colors duration-200",
                      isListening 
                        ? "bg-red-600 hover:bg-red-500 border-red-500" 
                        : "bg-neutral-700 hover:bg-neutral-600"
                    )}
                    onClick={() => {
                      if (isListening) {
                        recognitionRef.current?.stop();
                      } else {
                        startListening();
                      }
                    }}
                  >
                    <div className="relative">
                      <Mic className={cn(
                        "h-5 w-5",
                        isListening && "animate-pulse"
                      )} />
                      {isListening && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
                      )}
                    </div>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || isListening}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 