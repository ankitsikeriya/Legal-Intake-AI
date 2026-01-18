'use server';

import { db } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export async function createCase(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    const clientName = formData.get('clientName') as string;
    const email = formData.get('email') as string;

    if (!clientName) {
        return { error: "Client name is required" };
    }

    try {
        const [newCase] = await db.insert(cases).values({
            clientName,
            email,
            status: 'pending',
            userId: session.user.id,
        }).returning();

        revalidatePath('/dashboard');
        return { success: true, caseId: newCase.id };
    } catch (error) {
        console.error('Failed to create case:', error);
        return { error: "Failed to create case" };
    }
}

export async function getCases() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return [];
    }

    try {
        const userCases = await db.select()
            .from(cases)
            .where(eq(cases.userId, session.user.id))
            .orderBy(desc(cases.createdAt));

        return userCases;
    } catch (error) {
        console.error('Failed to fetch cases:', error);
        return [];
    }
}
