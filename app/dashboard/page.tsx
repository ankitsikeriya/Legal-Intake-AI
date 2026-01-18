import { getCases } from "@/app/actions/cases";
import { CreateCaseForm } from "./create-case";
import { Card } from "@/app/components/ui/card";
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
    const cases = await getCases();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Case Management</h1>
                    <p className="text-slate-500">Manage your client intakes and review AI analysis.</p>
                </div>
                <CreateCaseForm />
            </div>

            <div className="grid gap-4">
                {cases.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                        <p className="text-slate-500">No cases yet. Create one to get started.</p>
                    </div>
                ) : (
                    cases.map((c) => (
                        <Card key={c.id} className="p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-lg text-slate-900">{c.clientName}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            c.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {c.status}
                                    </span>
                                    {/* Score Badge */}
                                    {(c.analysis as any)?.caseRating !== undefined && (
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${(c.analysis as any).caseRating >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            (c.analysis as any).caseRating >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            Score: {(c.analysis as any).caseRating}/100
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                    {c.email && <span>{c.email}</span>}
                                </div>
                                <div className="mt-2 text-xs font-mono bg-slate-100 inline-block px-2 py-1 rounded">
                                    {appUrl}/intake/{c.id}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/intake/${c.id}`}
                                    target="_blank"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Open Intake Chat
                                </Link>
                                <Link href={`/dashboard/case/${c.id}`} passHref>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        View Analysis <ArrowRight size={14} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

// Minimal Button/Input shim for server component reference if needed, 
// though we usually import from components/ui. 
// Assuming components/ui/button exists and exports a variant prop.
import { Button } from "@/app/components/ui/button";
