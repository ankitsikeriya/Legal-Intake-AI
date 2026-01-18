'use client';

import { generateCaseAnalysis } from "@/app/actions/analysis";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/app/components/ui/card";

export function GenerateAnalysisButton({ caseId }: { caseId: number }) {
    const router = useRouter();
    const [error, setError] = useState("");

    useEffect(() => {
        const runAnalysis = async () => {
            // Add a small delay for UV polish so users see "Analyzing" state briefly rather than a flicker
            await new Promise(r => setTimeout(r, 800));

            try {
                const result = await generateCaseAnalysis(caseId);
                if (result.error) {
                    setError(result.error);
                } else {
                    router.refresh();
                }
            } catch (e) {
                setError("Failed to connect to analysis engine.");
            }
        };

        runAnalysis();
    }, [caseId, router]);

    if (error) {
        return (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full h-64 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="bg-white p-4 rounded-full shadow-lg border border-indigo-50 relative">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            </div>
            <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">AI is analyzing case files...</h3>
                <p className="text-slate-500 text-sm">Extracting facts, timeline, and liability.</p>
            </div>
        </div>
    );
}
