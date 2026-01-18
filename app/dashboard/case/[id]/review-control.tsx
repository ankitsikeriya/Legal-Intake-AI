'use client';

import { useState } from 'react';
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { CheckCircle, AlertCircle, Save, FileText } from "lucide-react";
import { updateCaseReview, addInternalNote, updateCaseSummary } from "@/app/actions/analysis";
import { useRouter } from 'next/navigation';

export function LawyerReviewControl({
    caseId,
    initialSummary,
    isReviewed,
    reviewedBy,
    reviewedAt,
    initialNotes
}: {
    caseId: number,
    initialSummary: string,
    isReviewed: boolean,
    reviewedBy: string | null,
    reviewedAt: Date | null,
    initialNotes: string | null
}) {
    const router = useRouter();
    const [summary, setSummary] = useState(initialSummary);
    const [notes, setNotes] = useState(initialNotes || '');
    const [isEditingSummary, setIsEditingSummary] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleMarkReviewed = async () => {
        setLoading(true);
        await updateCaseReview(caseId);
        setLoading(false);
        router.refresh();
    };

    const handleSaveSummary = async () => {
        if (!summary) return;
        setLoading(true);
        await updateCaseSummary(caseId, summary);
        setIsEditingSummary(false);
        setLoading(false);
        router.refresh();
    };

    const handleSaveNotes = async () => {
        setLoading(true);
        await addInternalNote(caseId, notes);
        setLoading(false);
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <Card className="p-6 border-l-4 border-l-indigo-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-900">Review Status</h3>
                        {isReviewed ? (
                            <div className="flex items-center gap-2 text-emerald-600 mt-1">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Reviewed by {reviewedBy} on {new Date(reviewedAt!).toLocaleDateString()}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-amber-600 mt-1">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">Pending Lawyer Review</span>
                            </div>
                        )}
                    </div>
                    {!isReviewed && (
                        <Button onClick={handleMarkReviewed} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Mark as Reviewed
                        </Button>
                    )}
                </div>
            </Card>

            {/* Editable Summary */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Executive Summary</h3>
                    {!isEditingSummary ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditingSummary(true)} disabled={isReviewed}>
                            Edit Summary
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingSummary(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleSaveSummary} disabled={loading} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
                        </div>
                    )}
                </div>
                {isEditingSummary ? (
                    <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="min-h-[200px] text-base leading-relaxed p-4"
                    />
                ) : (
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
                        {summary}
                    </p>
                )}
            </Card>

            {/* Internal Notes */}
            <Card className="p-6 bg-yellow-50/50 border-yellow-100">
                <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Internal Notes
                </h3>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Add private notes specific to this case..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="bg-white border-yellow-200 focus-visible:ring-yellow-500"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSaveNotes} disabled={loading} size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                            Save Notes
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
