
import { chatModel } from "./index";
import { z } from "zod";
import { HumanMessage, SystemMessage, ToolMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";

// Define strict schemas for data collection
export const witnessSchema = z.object({
    name: z.string().describe("Name of the witness"),
    contact: z.string().describe("Phone number or email of the witness").optional(),
    description: z.string().describe("What they saw or their relevance").optional(),
});

export const caseDetailsSchema = z.object({
    description: z.string().describe("Detailed description of the incident"),
    date: z.string().describe("Date and time of the incident"),
    injuries: z.string().describe("Description of any injuries sustained"),
    liability: z.string().describe("Who is at fault and why").optional(),
});

// Define Tools
const requestInfoTool = tool(
    async (input) => {
        return `Asking user: ${input.question} (Type: ${input.inputType})`;
    },
    {
        name: "request_info",
        description: "ALWAYS use this tool to ask the user a question. Choose the appropriate inputType to show the best UI.",
        schema: z.object({
            question: z.string().describe("The text content of the question to ask the user."),
            inputType: z.enum(['text', 'date', 'location', 'yes_no', 'file', 'number']).describe("The type of input UI to show the user."),
            options: z.array(z.string()).optional().describe("If using a select/choice input, provide options here."),
        }),
    }
);

const saveWitnessTool = tool(
    async (input) => {
        return `Witness ${input.name} saved.`;
    },
    {
        name: "save_witness",
        description: "Call this when the user provides details about a witness.",
        schema: witnessSchema,
    }
);

const saveCaseDetailsTool = tool(
    async (input) => {
        return "Case details updated.";
    },
    {
        name: "save_case_details",
        description: "Call this to save or update the core facts of the case.",
        schema: caseDetailsSchema,
    }
);

// Bind tools to the model
// const intakeModel = chatModel.bindTools([requestInfoTool, saveWitnessTool, saveCaseDetailsTool]);
// Bypass native tool calling to avoid Schema errors with Llama 3 on Groq
const intakeModel = chatModel;

const SYSTEM_PROMPT = `You are an expert Legal Intake Specialist for "LegalIntake AI".
Your goal is to screen potential clients by gathering specific, high-value legal facts using a STRUCTURED INTERVIEW.

PROTOCOL:
1. **One Question at a Time**: You must ALWAYs use the \`request_info\` tool to ask questions.
2. **Choose Smart Inputs**:
    - Asking for a date? Use inputType='date'.
    - Asking for a location? Use inputType='location'.
    - Asking a binary question? Use inputType='yes_no'.
    - Asking for details? Use inputType='text'.
3. **Gather Order**:
    - Incident Date (date)
    - Incident Location (location)
    - Brief Description (text)
    - Were there injuries? (yes_no)
    - (If yes) Describe injuries (text)
    - Who is at fault? (text)
    - Any witnesses? (yes_no)
    - (If yes) Witness Name/Contact (text - use save_witness tool when you get it)
    - Any photos/documents? (yes_no/file)

4. **Ending**: Once you have all 4 objectives (Incident, Injuries, Liability, Evidence) and the user says "no" to "anything else?", YOU MUST FINISH.
   - Do NOT ask "Is this accurate?".
   - Just say: "Thank you. I have generated your intake report. An attorney will review it shortly." using inputType='text'.

IMPORTANT: TOOL USAGE
- **No Repeats**: Do NOT call \`save_witness\` or \`save_case_details\` if you have already saved that specific information in a previous turn. Only call them for NEW information.
- **Format**: You MUST output tool calls in the following XML format:
<function=request_info>{"question": "...", "inputType": "..."}</function>
<function=save_witness>{"name": "...", "contact": "..."}</function>
<function=save_case_details>{"description": "...", "date": "...", "injuries": "..."}</function>

- You can output multiple tools (e.g., save data THEN ask question).
- **CRITICAL**: If you ask a question via \`request_info\`, output NOTHING else (no conversational filler outside the tags). The question inside the tag IS your message.

TONE:
- Professional, reassuring, but focused on facts.
- Do not be chatty. Be direct.`;

export async function runIntakeAgent(history: BaseMessage[]) {
    // Ensure system prompt is at the start
    const messages = [new SystemMessage(SYSTEM_PROMPT), ...history];

    const result = await intakeModel.invoke(messages);
    return result;
}
