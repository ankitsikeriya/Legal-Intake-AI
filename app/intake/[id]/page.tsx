'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { Button } from "@/app/components/ui/button";
import { submitMessage } from "@/app/actions/chat";
import ReactMarkdown from 'react-markdown';
import { Send, ShieldCheck, Scale } from "lucide-react";
import { SmartInput } from "@/app/components/chat/SmartInput";

type Message = {
    role: 'user' | 'assistant';
    content: string;
    inputType?: string;
};

export default function IntakePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const caseId = parseInt(resolvedParams.id);
    const [hasStarted, setHasStarted] = useState(false);

    const [messages, setMessages] = useState<any[]>([
        {
            role: 'assistant',
            content: "I’ll ask you a few simple questions to understand what happened.\nYou don’t need legal knowledge — just answer in your own words.",
            inputType: 'text' // Fallback
        }
    ]);
    const [currentInputType, setCurrentInputType] = useState<string>('text');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, hasStarted]);

    const handleQuickStart = (category: string) => {
        setHasStarted(true);
        // Seed the chat with the category as a user message, then get AI response
        const userMsg = { role: 'user', content: category };
        setMessages(prev => [...prev, userMsg]);
        processMessage(category, [...messages, userMsg]);
    };

    const processMessage = async (msgContent: string, history: any[]) => {
        setIsLoading(true);
        try {
            const response = await submitMessage(caseId, history, msgContent);

            // Should render the response
            setMessages(prev => [...prev, response]);

            // Update input type for the NEXT turn
            if (response.inputType) {
                setCurrentInputType(response.inputType);
            } else {
                setCurrentInputType('text');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (value: string) => {
        const userMsg = { role: 'user', content: value };
        setMessages(prev => [...prev, userMsg]);
        processMessage(value, [...messages, userMsg]);
    };

    // Initial Category Screen
    if (!hasStarted) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-indigo-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Scale className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">LegalIntake AI</h1>
                        <p className="text-indigo-100">Your secure legal assistant</p>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <p className="text-lg text-slate-700 font-medium mb-2">
                                "I’ll ask you a few simple questions to understand what happened."
                            </p>
                            <p className="text-sm text-slate-500">
                                You don’t need legal knowledge — just answer in your own words.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { icon: "🚗", label: "Accident" },
                                { icon: "🏠", label: "Property / Theft" },
                                { icon: "💼", label: "Employment Issue" },
                                { icon: "👨‍👩‍👧", label: "Family Matter" },
                                { icon: "📄", label: "Other" }
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => handleQuickStart(item.label)}
                                    className="w-full p-4 flex items-center gap-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all group text-left"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                    <span className="font-semibold text-slate-700 group-hover:text-indigo-700">{item.label}</span>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Chat Interface
    return (
        <div className="fixed inset-0 bg-slate-100 flex flex-col items-center justify-center sm:p-4">
            <div className="w-full max-w-2xl bg-white sm:rounded-2xl shadow-xl flex flex-col h-full sm:h-[90vh] overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-indigo-700 p-4 flex items-center justify-between text-white shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                                <Scale className="w-6 h-6 text-indigo-100" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg leading-tight">LegalIntake AI</h1>
                                <div className="flex items-center gap-1.5 text-xs text-indigo-200">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></span>
                                    Online • Secure Chat
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="bg-indigo-800/50 p-2 rounded-lg backdrop-blur-md border border-indigo-600/30 hidden sm:block">
                        <ShieldCheck className="w-5 h-5 text-indigo-300" />
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm transition-all ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                                        : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm border border-slate-100'
                                        }`}
                                >
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex justify-start w-full">
                            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <SmartInput
                        inputType={currentInputType as any}
                        onSend={handleSend}
                        disabled={isLoading}
                    />
                    <div className="text-center mt-3">
                        <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-3 h-3" />
                            Your conversation is privately secured and encrypted.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
