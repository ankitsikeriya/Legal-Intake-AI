import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card } from "@/app/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, FileText, XCircle, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

import { GenerateAnalysisButton } from "./generate-button";
import { LawyerReviewControl } from "./review-control";
import { AuditTrail } from "./audit-trail";
import { ExportPDFButton } from "./export-pdf-button";

export default async function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch case with parsed analysis
    const [caseData] = await db.select().from(cases).where(eq(cases.id, parseInt(id)));

    if (!caseData) {
        notFound();
    }

    const analysis: any = caseData.analysis || {};
    const hasAnalysis = !!caseData.analysis;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 print:p-0 print:max-w-none">
            {/* Header */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{caseData.clientName}</h1>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <span>{caseData.email}</span>
                            <span>•</span>
                            <span>{new Date(caseData.createdAt!).toLocaleDateString()}</span>
                            {caseData.isReviewed && (
                                <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold border border-emerald-100">
                                    <CheckCircle className="w-3 h-3" /> Reviewed
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {hasAnalysis && (
                        <ExportPDFButton />
                    )}
                    {!hasAnalysis && (
                        <GenerateAnalysisButton caseId={caseData.id} />
                    )}
                </div>
            </div>

            {/* Print Header (Visible only when printing) */}
            <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold text-slate-900">LegalIntake AI - Case Report</h1>
                <div className="flex justify-between mt-2 text-sm text-slate-600">
                    <div>Client: <span className="font-semibold">{caseData.clientName}</span></div>
                    <div>Date: {new Date().toLocaleDateString()}</div>
                </div>
            </div>

            {hasAnalysis && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Key Metrics & Review */}
                    <div className="space-y-6">
                        {/* Score Card */}
                        <Card className="p-6 text-center">
                            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Case Readiness Score</h3>
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle
                                        className="text-slate-100"
                                        strokeWidth="12"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="70"
                                        cx="80"
                                        cy="80"
                                    />
                                    <circle
                                        className={
                                            analysis.caseRating >= 80 ? 'text-emerald-500' :
                                                analysis.caseRating >= 50 ? 'text-yellow-500' : 'text-red-500'
                                        }
                                        strokeWidth="12"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * analysis.caseRating) / 100}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="70"
                                        cx="80"
                                        cy="80"
                                    />
                                </svg>
                                <span className="absolute text-4xl font-bold text-slate-900">{analysis.caseRating}</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-600">
                                {analysis.caseRating >= 80 ? "Strong liability and clear facts." :
                                    analysis.caseRating >= 50 ? "Merit exists but gaps present." : "High risk / weak case."}
                            </p>
                        </Card>

                        {/* Red Flags */}
                        <Card className="p-6 border-red-100 bg-red-50/50">
                            <h3 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-4">
                                <ShieldAlert className="w-4 h-4" />
                                Critical Red Flags
                            </h3>
                            <ul className="space-y-3">
                                {analysis.redFlags?.map((flag: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-red-700 bg-white p-2 rounded border border-red-100 shadow-sm">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        {flag}
                                    </li>
                                ))}
                                {!analysis.redFlags?.length && <li className="text-sm text-slate-500">None detected.</li>}
                            </ul>
                        </Card>
                    </div>

                    {/* Middle: Summary, Checks, Review Control */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Lawyer Review Control Panel */}
                        <LawyerReviewControl
                            caseId={caseData.id}
                            initialSummary={analysis.summary}
                            isReviewed={caseData.isReviewed || false}
                            reviewedBy={caseData.reviewedBy}
                            reviewedAt={caseData.reviewedAt}
                            initialNotes={caseData.internalNotes}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Evidence Checklist */}
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Evidence Checklist
                                </h3>
                                <div className="space-y-3">
                                    {analysis.evidence?.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                                            <span className="text-sm font-medium text-slate-700">{item.item}</span>
                                            {item.status === 'available' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded"><CheckCircle className="w-3 h-3" /> Have</span>}
                                            {item.status === 'missing' && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded"><XCircle className="w-3 h-3" /> Missing</span>}
                                            {item.status === 'unclear' && <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded"><AlertTriangle className="w-3 h-3" /> Unclear</span>}
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Missing Info */}
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> Missing Information
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.missingInfo?.map((info: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                                            <span className="text-indigo-400">•</span> {info}
                                        </li>
                                    ))}
                                    {!analysis.missingInfo?.length && <li className="text-sm text-slate-500 italic">No critical info missing.</li>}
                                </ul>
                            </Card>
                        </div>

                        {/* Timeline */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" /> Case Timeline
                            </h3>
                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pb-4">
                                {analysis.timeline?.map((event: any, i: number) => (
                                    <div key={i} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600"></div>
                                        <div className="text-sm font-bold text-indigo-600 mb-1">{event.date}</div>
                                        <div className="text-slate-900 font-medium">{event.description}</div>
                                        <div className="text-xs text-slate-500 uppercase mt-1 tracking-wider">{event.type}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Audit Trail */}
                        <AuditTrail caseId={caseData.id} />
                    </div>
                </div>
            )}
        </div>
    );
}
