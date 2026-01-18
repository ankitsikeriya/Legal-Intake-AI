'use client';

import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Shield, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        setLoading(true);
        await authClient.signIn.email({
            email,
            password,
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
                    <h2 className="text-3xl font-bold mb-6">Transforming how law firms connect with clients.</h2>
                    <p className="text-indigo-200 text-lg leading-relaxed">
                        "Secure, intelligent, and available 24/7. The platform that gives you your time back."
                    </p>
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
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
                        <p className="text-slate-500 mt-2">Sign in to your dashboard to manage cases</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Email Address</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@firm.com"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-900">Password</label>
                                <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</Link>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                            />
                        </div>

                        <Button
                            onClick={handleSignIn}
                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                            Start free trial
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
