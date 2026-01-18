
import { chatModel } from "./index";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// Schema for Case Readiness Report
const analysisSchema = z.object({
    summary: z.string().describe("Executive summary of the case (1 paragraph)"),
    caseRating: z.number().min(0).max(100).describe("Readiness score (0-100) based on merit, clarity, and winnability"),
    redFlags: z.array(z.string()).describe("List of critical weaknesses, inconsistencies, or statute of limitations issues"),
    missingInfo: z.array(z.string()).describe("List of critical information that is missing"),
    evidence: z.array(
        z.object({
            item: z.string().describe("Name of expected evidence (e.g., Police Report, Medical Records)"),
            status: z.enum(["available", "missing", "unclear"]).describe("Current status of this evidence"),
        })
    ).describe("Checklist of standard evidence for this case type"),
    timeline: z.array(
        z.object({
            date: z.string().describe("Date of the event"),
            description: z.string().describe("What happened"),
            type: z.enum(["fact", "witness", "medical", "legal"]).describe("Type of event"),
        })
    ),
});

const parser = StructuredOutputParser.fromZodSchema(analysisSchema);

export async function analyzeEvidence(text: string) {
    const prompt = new PromptTemplate({
        template: `You are a senior partner at a top law firm. Your job is to critically evaluate incoming potential cases.
    
    Don't just summarize. Grade the case. Look for holes.
    
    EVIDENCE TEXT:
    {text}
    
    INSTRUCTIONS:
    1. **Score**: Rate 0-100. <50 = weak/vague. >80 = solid facts/liability.
    2. **Red Flags**: Be cynical. What could lose us this case?
    3. **Evidence**: List what we have VS what standard personal injury/legal cases need (Medical records, photos, police report, etc).
    4. **Timeline**: Construct a clear chronological order.
    
    RESPONSE FORMAT:
    {format_instructions}
    
    Return ONLY the valid JSON.`,
        inputVariables: ["text"],
        partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const chain = prompt.pipe(chatModel).pipe(parser);

    try {
        const result = await chain.invoke({ text });
        return result;
    } catch (e) {
        console.error("Analysis failed:", e);
        // Return a safe fallback to prevent UI crash
        return {
            summary: "Analysis failed. Please try again.",
            caseRating: 0,
            redFlags: ["Analysis failed"],
            missingInfo: [],
            evidence: [],
            timeline: []
        };
    }
}
