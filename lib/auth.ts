
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            barCouncilState: {
                type: "string",
                required: false,
            },
            enrollmentNumber: {
                type: "string",
                required: false,
            },
            yearOfEnrollment: {
                type: "string",
                required: false,
            },
            practiceArea: {
                type: "string",
                required: false,
            },
            firmName: {
                type: "string",
                required: false,
            },
            phoneNumber: {
                type: "string",
                required: false,
            },
            verificationStatus: {
                type: "string",
                required: false,
                defaultValue: "pending",
            },
        }
    },
    session: {
        additionalFields: {
            verificationStatus: {
                type: "string",
                required: false,
            }
        }
    }
});
