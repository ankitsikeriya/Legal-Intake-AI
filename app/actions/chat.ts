'use server';

import { runIntakeAgent } from "@/lib/ai/intake-agent";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function submitMessage(caseId: number, history: any[], message: string) {
    const langChainHistory = history.map((msg) =>
        msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    langChainHistory.push(new HumanMessage(message));

    try {
        const response = await runIntakeAgent(langChainHistory);
        let content = typeof response.content === 'string' ? response.content : "";
        let toolCalls = response.tool_calls || [];

        // Fix: Detect leaked XML tool calls (Groq/Llama3 quirk) - Global match
        const functionRegex = /<function=(\w+)>([\s\S]*?)<\/function>/g;
        const matches = [...content.matchAll(functionRegex)];

        let assistantMessage: any = {
            role: 'assistant',
            content: content.replace(functionRegex, '').trim() || "I processed that.",
            tool_calls: []
        };

        // Handle Tool Calls
        if (matches.length > 0) {
            for (const match of matches) {
                const [fullMatch, name, argsString] = match;
                try {
                    const args = JSON.parse(argsString);

                    if (name === 'request_info') {
                        // Return the structured question to the UI
                        assistantMessage = {
                            ...assistantMessage,
                            content: args.question,
                            inputType: args.inputType,
                            options: args.options,
                            tool_call_id: 'manual_' + Date.now()
                        };
                    }

                    if (name === 'save_witness') {
                        const ack = `(System: Saved witness ${args.name})`;
                        if (assistantMessage.inputType) {
                            // If there's already a question, prepend the ack
                            assistantMessage.content = `${ack} ${assistantMessage.content}`;
                        } else {
                            // If no question yet, just show ack
                            assistantMessage.content = `${ack} Thanks. I've noted down ${args.name}.`;
                        }
                    }

                    if (name === 'save_case_details') {
                        const ack = `(System: Updated case details)`;
                        if (assistantMessage.inputType) {
                            assistantMessage.content = `${ack} ${assistantMessage.content}`;
                        } else {
                            assistantMessage.content = `${ack}`;
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse leaked tool call:", e);
                }
            }
        } else if (toolCalls.length > 0) {
            // Fallback for native tool calls if they ever start working
            const toolCall = toolCalls[0];
            if (toolCall.name === 'save_witness') {
                assistantMessage.content = `(System: Saved witness ${toolCall.args.name}) Thanks. I've noted down ${toolCall.args.name}.`;
            }
        }

        // Save to DB
        const newHistory = [...history, { role: 'user', content: message }, assistantMessage];
        await db.update(cases)
            .set({
                chatHistory: newHistory,
                status: 'active'
            })
            .where(eq(cases.id, caseId));

        return assistantMessage;
    } catch (error) {
        console.error("Agent Error:", error);
        return {
            role: 'assistant',
            content: "I'm having trouble connecting to my brain right now. Please try again."
        };
    }
}
