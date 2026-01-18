
import Link from 'next/link';
import { Button } from "@/app/components/ui/button";
import { ArrowRight, MessageSquare, Brain, Shield, Clock, Users, Check, Star, ChevronDown } from "lucide-react";

import { MouseFollower } from "@/app/components/MouseFollower";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <MouseFollower />

            {/* Navigation */}
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">LegalIntake AI</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="outline" className="hidden sm:flex">Lawyer Login</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        AI-Powered Client Intake for Modern Firms
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                        Automate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Legal Intake</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
                        Capture client details, screen cases, and generate summaries automatically.
                        Let AI handle the initial consultation while you focus on winning cases.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200/50 transition-all hover:scale-105">
                                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Abstract visual background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white border-y border-slate-100 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                        <StatItem number="24/7" label="Availability" />
                        <StatItem number="70%" label="Time Saved" />
                        <StatItem number="3x" label="Lead Conversion" />
                        <StatItem number="10k+" label="Intakes Processed" />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Top Firms Choose LegalIntake</h2>
                        <p className="text-lg text-slate-500">Streamline your client intake process with features designed for modern legal practices.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<MessageSquare className="h-8 w-8 text-indigo-600" />}
                            title="Conversational AI"
                            description="Engage clients with a friendly, empathetic AI that asks the right questions to gather critical case facts."
                        />
                        <FeatureCard
                            icon={<Brain className="h-8 w-8 text-purple-600" />}
                            title="Instant Analysis"
                            description="Automatically extract key dates, witnesses, and liability factors into a structured dashboard for your review."
                        />
                        <FeatureCard
                            icon={<Shield className="h-8 w-8 text-emerald-600" />}
                            title="Secure & Private"
                            description="Built with attorney-client privilege in mind. Enterprise-grade encryption keeps your client data safe."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-lg text-slate-500">Get started in minutes. No complex integration required.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 -z-10"></div>

                        <StepCard
                            number="1"
                            title="Create Link"
                            description="Generate a unique intake link for your client from the dashboard."
                        />
                        <StepCard
                            number="2"
                            title="Client Chat"
                            description="Your client chats with the AI assistant to share their case details."
                        />
                        <StepCard
                            number="3"
                            title="Review Facts"
                            description="Receive a structured summary and key facts instantly."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-16">Trusted by Forward-Thinking Firms</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-900">
                        <TestimonialCard
                            quote="It's like having a paralegal available 24/7. Our conversion rate has doubled since we started using LegalIntake."
                            author="Sarah Jenkins"
                            role="Partner, Jenkins Family Law"
                        />
                        <TestimonialCard
                            quote="The sheer amount of time we save on initial consults is mind-blowing. The AI summaries are surprisingly accurate."
                            author="Michael Ross"
                            role="Attorney, Ross & Associates"
                        />
                        <TestimonialCard
                            quote="Clients love the immediate response. We capture leads that would have otherwise gone to voicemail and been lost."
                            author="David Chen"
                            role="Managing Partner, Chen Legal"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FaqItem
                            question="Is my client data secure?"
                            answer="Absolutely. We use bank-level 256-bit encryption for all data in transit and at rest. Your data is isolated and never used to train public models."
                        />
                        <FaqItem
                            question="Can I customize the questions?"
                            answer="Yes! Our AI adapts to your practice area, but you can also provide specific instructions or required fields for the intake process."
                        />
                        <FaqItem
                            question="Does it integrate with Clio/MyCase?"
                            answer="Integration is on our roadmap! Currently, you can export case summaries as PDF or text to copy into your practice management software."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
                    <p>&copy; 2025 LegalIntake AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all group h-full">
            <div className="mb-4 bg-white p-3 rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
}

function StatItem({ number, label }: { number: string, label: string }) {
    return (
        <div className="p-4">
            <div className="text-3xl md:text-4xl font-extrabold text-indigo-600 mb-1">{number}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
        </div>
    );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="relative flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 z-10 border-4 border-white">
                {number}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed max-w-xs">{description}</p>
        </div>
    );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <p className="text-slate-600 mb-6 italic leading-relaxed">"{quote}"</p>
            <div>
                <div className="font-bold text-slate-900">{author}</div>
                <div className="text-sm text-slate-500">{role}</div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-slate-900">
                <h3 className="font-semibold text-lg">{question}</h3>
                <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180 text-slate-500" />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                <p>{answer}</p>
            </div>
        </details>
    );
}
