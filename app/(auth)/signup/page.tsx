'use client';

import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Loader2, Check, ArrowRight, ArrowLeft, Shield, BadgeCheck, Phone, Building2, GraduationCap, FileCheck } from 'lucide-react';

const STATE_BAR_COUNCILS = [
    { code: "AP", name: "Andhra Pradesh" },
    { code: "AR", name: "Arunachal Pradesh" },
    { code: "AS", name: "Assam" },
    { code: "BR", name: "Bihar" },
    { code: "CG", name: "Chhattisgarh" },
    { code: "D", name: "Delhi" },
    { code: "GA", name: "Goa" },
    { code: "GJ", name: "Gujarat" },
    { code: "HR", name: "Haryana" },
    { code: "HP", name: "Himachal Pradesh" },
    { code: "JH", name: "Jharkhand" },
    { code: "KA", name: "Karnataka" },
    { code: "KL", name: "Kerala" },
    { code: "MP", name: "Madhya Pradesh" },
    { code: "MH", name: "Maharashtra" },
    { code: "MN", name: "Manipur" },
    { code: "ML", name: "Meghalaya" },
    { code: "MZ", name: "Mizoram" },
    { code: "NL", name: "Nagaland" },
    { code: "OD", name: "Odisha" },
    { code: "PB", name: "Punjab" },
    { code: "RJ", name: "Rajasthan" },
    { code: "SK", name: "Sikkim" },
    { code: "TN", name: "Tamil Nadu" },
    { code: "TS", name: "Telangana" },
    { code: "TR", name: "Tripura" },
    { code: "UP", name: "Uttar Pradesh" },
    { code: "UK", name: "Uttarakhand" },
    { code: "WB", name: "West Bengal" },
    { code: "JK", name: "Jammu & Kashmir" },
];

const PRACTICE_AREAS = [
    "Criminal Law",
    "Civil Law",
    "Corporate & Commercial Law",
    "Constitutional Law",
    "Family & Matrimonial Law",
    "Property & Real Estate Law",
    "Labour & Employment Law",
    "Tax Law",
    "Intellectual Property Law",
    "Banking & Finance Law",
    "Environmental Law",
    "Cyber Law & IT Law",
    "Immigration Law",
    "Human Rights Law",
    "Arbitration & Mediation",
    "Consumer Protection Law",
    "Insurance Law",
    "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const ENROLLMENT_YEARS = Array.from({ length: CURRENT_YEAR - 1959 }, (_, i) => CURRENT_YEAR - i);

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Step 1 fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    // Step 2 fields
    const [barCouncilState, setBarCouncilState] = useState('');
    const [enrollmentNumber, setEnrollmentNumber] = useState('');
    const [yearOfEnrollment, setYearOfEnrollment] = useState('');
    const [practiceArea, setPracticeArea] = useState('');
    const [firmName, setFirmName] = useState('');

    // Created user id (after step 1)
    const [userId, setUserId] = useState('');

    const validateStep1 = () => {
        if (!name.trim()) return 'Full name is required';
        if (!email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!phone.trim()) return 'Phone number is required';
        const phoneClean = phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
        if (!/^[6-9]\d{9}$/.test(phoneClean)) return 'Invalid Indian mobile number';
        return null;
    };

    const validateStep2 = () => {
        if (!barCouncilState) return 'Please select your State Bar Council';
        if (!enrollmentNumber.trim()) return 'Enrollment number is required';
        const pattern = /^[A-Za-z]{1,3}\/\d{1,6}\/\d{4}$/;
        if (!pattern.test(enrollmentNumber.trim())) return 'Invalid enrollment format. Use: STATE/NUMBER/YEAR (e.g., D/1234/2023)';
        if (!yearOfEnrollment) return 'Year of enrollment is required';
        if (!practiceArea) return 'Primary practice area is required';
        return null;
    };

    const handleStep1Submit = async () => {
        const validationError = validateStep1();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (result.error) {
                setError(result.error.message || 'Signup failed. Please try again.');
                setLoading(false);
                return;
            }

            if (result.data?.user?.id) {
                setUserId(result.data.user.id);
                setStep(2);
            } else {
                setError('Account creation failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2Submit = async () => {
        const validationError = validateStep2();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/verify-lawyer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    barCouncilState,
                    enrollmentNumber: enrollmentNumber.trim(),
                    yearOfEnrollment,
                    practiceArea,
                    firmName: firmName.trim() || 'Independent Practice',
                    phoneNumber: phone.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Verification submission failed.');
                setLoading(false);
                return;
            }

            router.push('/dashboard');
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    <h2 className="text-3xl font-bold mb-8">Verified lawyers. Trusted platform.</h2>
                    <ul className="space-y-5">
                        <li className="flex items-start gap-4 text-indigo-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-200 shrink-0 mt-0.5">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">BCI Enrollment Verification</p>
                                <p className="text-sm text-indigo-300 mt-0.5">Every lawyer is verified against Bar Council of India records</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 text-indigo-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-200 shrink-0 mt-0.5">
                                <BadgeCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Fraud Prevention</p>
                                <p className="text-sm text-indigo-300 mt-0.5">Multi-step verification ensures only genuine advocates register</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4 text-indigo-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-200 shrink-0 mt-0.5">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Automated Client Intake</p>
                                <p className="text-sm text-indigo-300 mt-0.5">AI-powered case analysis available 24/7</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10 text-sm text-indigo-300">
                    &copy; 2024 LegalIntake AI Inc.
                </div>

                {/* Decorative Background */}
                <Scale className="absolute -right-12 -bottom-12 w-96 h-96 text-white/5 rotate-12" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90 z-0" />
            </div>

            {/* Right: Form */}
            <div className="flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile logo */}
                    <div className="text-center">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-lg shadow-indigo-200 lg:hidden">
                            <Scale className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {step === 1 ? 'Create your account' : 'Professional Verification'}
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            {step === 1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Bar Council details'}
                        </p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-1.5 rounded-full bg-indigo-600 transition-all duration-500" />
                        <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-in">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Step 1: Account Details */}
                    {step === 1 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    id="signup-name"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); setError(''); }}
                                    placeholder="Adv. Rajesh Kumar"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="advocate@lawfirm.com"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    id="signup-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                                    placeholder="+91 98765 43210"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder="Minimum 8 characters"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                                <p className="text-xs text-slate-400">Must be at least 8 characters</p>
                            </div>

                            <Button
                                id="signup-step1-submit"
                                onClick={handleStep1Submit}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {loading ? 'Creating Account...' : (
                                    <>Continue to Verification <ArrowRight className="w-4 h-4" /></>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Professional Verification */}
                    {step === 2 && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                            {/* Gov verification badge */}
                            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <Shield className="w-5 h-5 text-amber-600 shrink-0" />
                                <p className="text-xs text-amber-800">
                                    <span className="font-semibold">Government Verification:</span> Your enrollment number will be verified against Bar Council of India records.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    State Bar Council <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="signup-bar-council"
                                    value={barCouncilState}
                                    onChange={(e) => { setBarCouncilState(e.target.value); setError(''); }}
                                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select your State Bar Council</option>
                                    {STATE_BAR_COUNCILS.map((council) => (
                                        <option key={council.code} value={council.name}>
                                            Bar Council of {council.name} ({council.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <FileCheck className="w-3.5 h-3.5" /> BCI Enrollment Number <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    id="signup-enrollment"
                                    value={enrollmentNumber}
                                    onChange={(e) => { setEnrollmentNumber(e.target.value.toUpperCase()); setError(''); }}
                                    placeholder="D/1234/2023"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all font-mono tracking-wider"
                                />
                                <p className="text-xs text-slate-400">Format: STATE_CODE/SERIAL_NUMBER/YEAR — as issued by Bar Council of India</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5" /> Year of Enrollment <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="signup-enrollment-year"
                                    value={yearOfEnrollment}
                                    onChange={(e) => { setYearOfEnrollment(e.target.value); setError(''); }}
                                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select year</option>
                                    {ENROLLMENT_YEARS.map((year) => (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    Primary Practice Area <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="signup-practice-area"
                                    value={practiceArea}
                                    onChange={(e) => { setPracticeArea(e.target.value); setError(''); }}
                                    className="flex h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select practice area</option>
                                    {PRACTICE_AREAS.map((area) => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-3.5 h-3.5" /> Law Firm / Organization
                                </label>
                                <Input
                                    id="signup-firm"
                                    value={firmName}
                                    onChange={(e) => setFirmName(e.target.value)}
                                    placeholder="Sharma & Associates (or leave blank for independent)"
                                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    id="signup-step2-back"
                                    onClick={() => { setStep(1); setError(''); }}
                                    variant="outline"
                                    className="h-11 px-4 border-slate-300 text-slate-600 hover:bg-slate-100"
                                    disabled={loading}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    id="signup-step2-submit"
                                    onClick={handleStep2Submit}
                                    className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {loading ? 'Submitting...' : (
                                        <>
                                            <Shield className="w-4 h-4" />
                                            Submit for Verification
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                            Sign in
                        </Link>
                    </p>

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Shield className="w-3.5 h-3.5" />
                            BCI Verified
                        </div>
                        <div className="w-px h-3 bg-slate-300" />
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            GOI Compliant
                        </div>
                        <div className="w-px h-3 bg-slate-300" />
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Check className="w-3.5 h-3.5" />
                            256-bit SSL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
