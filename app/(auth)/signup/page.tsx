'use client';

import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Loader2, Check } from 'lucide-react';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);
        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => setLoading(true),
            onSuccess: () => router.push("/dashboard"),
            onError: (ctx) => {
                alert(ctx.error.message);
                setLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Visual/Brand */}
            <div className="hidden lg:flex flex-col justify-between bg-indigo-900 p-12 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-3 text-lg font-bold">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Scale className="w-5 h-5 text-indigo-200" />
                    </div>
                    LegalIntake AI
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-3xl font-bold mb-8">Ready to modernize your legal practice?</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-indigo-100">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-200">
                                <Check className="w-4 h-4" />
                            </div>
                            Automated client intake 24/7
                        </li>
                        <li className="flex items-center gap-3 text-indigo-100">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-200">
                                <Check className="w-4 h-4" />
                            </div>
                            Instant case summaries & analysis
                        </li>
                        <li className="flex items-center gap-3 text-indigo-100">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-200">
                                <Check className="w-4 h-4" />
                            </div>
                            Bank-level data security
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm text-indigo-300">
                    &copy; 2024 LegalIntake AI Inc.
                </div>

                {/* Decorative Background Elements */}
                <Scale className="absolute -right-12 -bottom-12 w-96 h-96 text-white/5 rotate-12" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90 z-0" />
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-6 shadow-lg shadow-indigo-200 lg:hidden">
                            <Scale className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create your account</h1>
                        <p className="text-slate-500 mt-2">Start automating your intake today</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Full Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="lawyer@firm.com"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>

                        <Button
                            onClick={handleSignUp}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
