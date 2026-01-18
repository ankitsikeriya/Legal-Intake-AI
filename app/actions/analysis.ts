'use server';

import { db } from "@/lib/db";
import { cases, caseLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { analyzeEvidence } from "@/lib/ai/analysis-agent";
import { revalidatePath } from "next/cache";

export async function generateCaseAnalysis(caseId: number) {
    try {
        // 1. Fetch case chat history
        const [caseData] = await db.select().from(cases).where(eq(cases.id, caseId));

        if (!caseData || !caseData.chatHistory) {
            return { error: "Case not found or no chat history available." };
        }

        // 2. Format history for AI
        const history = caseData.chatHistory as any[];
        const transcript = history
            .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join("\n\n");

        // 3. Run Analysis
        const analysisResult = await analyzeEvidence(transcript);

        // 4. Save to DB
        await db.update(cases)
            .set({
                analysis: analysisResult,
                // Optional: update status if needed
                // status: 'reviewed' 
            })
            .where(eq(cases.id, caseId));

        // 5. Log Action
        await db.insert(caseLogs).values({
            caseId,
            action: 'AI_ANALYSIS',
            details: 'Generated case readiness report',
            actor: 'AI Assistant'
        });

        revalidatePath(`/dashboard/case/${caseId}`);
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error("Analysis generation failed:", error);
        return { error: "Failed to generate analysis." };
    }
}

// Lawyer Actions

export async function updateCaseSummary(caseId: number, newSummary: string) {
    // 1. Update Case
    const [existingCase] = await db.select().from(cases).where(eq(cases.id, caseId));
    const currentAnalysis: any = existingCase.analysis || {};

    await db.update(cases)
        .set({
            analysis: { ...currentAnalysis, summary: newSummary }
        })
        .where(eq(cases.id, caseId));

    // 2. Log Action
    await db.insert(caseLogs).values({
        caseId,
        action: 'SUMMARY_EDITED',
        details: 'Lawyer updated the executive summary',
        actor: 'Lawyer (You)'
    });

    revalidatePath(`/dashboard/case/${caseId}`);
}

export async function addInternalNote(caseId: number, note: string) {
    if (!note) return;

    await db.update(cases)
        .set({ internalNotes: note })
        .where(eq(cases.id, caseId));

    await db.insert(caseLogs).values({
        caseId,
        action: 'NOTE_ADDED',
        details: 'Internal note updated',
        actor: 'Lawyer (You)'
    });

    revalidatePath(`/dashboard/case/${caseId}`);
}

export async function updateCaseReview(caseId: number) {
    await db.update(cases)
        .set({
            isReviewed: true,
            reviewedBy: 'You', // In real app, get from session
            reviewedAt: new Date()
        })
        .where(eq(cases.id, caseId));

    await db.insert(caseLogs).values({
        caseId,
        action: 'REVIEW_COMPLETED',
        details: 'Case marked as reviewed',
        actor: 'Lawyer (You)'
    });

    revalidatePath(`/dashboard/case/${caseId}`);
}
