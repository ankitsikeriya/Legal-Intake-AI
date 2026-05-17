import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// List of valid State Bar Council codes
const STATE_BAR_COUNCILS: Record<string, string> = {
    "AP": "Andhra Pradesh",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "BR": "Bihar",
    "CG": "Chhattisgarh",
    "D": "Delhi",
    "GA": "Goa",
    "GJ": "Gujarat",
    "HR": "Haryana",
    "HP": "Himachal Pradesh",
    "JH": "Jharkhand",
    "KA": "Karnataka",
    "KL": "Kerala",
    "MP": "Madhya Pradesh",
    "MH": "Maharashtra",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "OD": "Odisha",
    "PB": "Punjab",
    "RJ": "Rajasthan",
    "SK": "Sikkim",
    "TN": "Tamil Nadu",
    "TS": "Telangana",
    "TR": "Tripura",
    "UP": "Uttar Pradesh",
    "UK": "Uttarakhand",
    "WB": "West Bengal",
    "JK": "Jammu & Kashmir",
};

// Validate enrollment number format: STATE_CODE/NUMBER/YEAR
function validateEnrollmentNumber(enrollmentNo: string): { valid: boolean; error?: string } {
    const trimmed = enrollmentNo.trim().toUpperCase();

    // Pattern: STATE_CODE/SERIAL_NUMBER/YEAR (e.g., D/1234/2023, MH/5678/2020)
    const pattern = /^([A-Z]{1,3})\/(\d{1,6})\/(\d{4})$/;
    const match = trimmed.match(pattern);

    if (!match) {
        return {
            valid: false,
            error: "Invalid format. Expected: STATE_CODE/NUMBER/YEAR (e.g., D/1234/2023)"
        };
    }

    const [, stateCode, , yearStr] = match;
    const year = parseInt(yearStr, 10);
    const currentYear = new Date().getFullYear();

    // Validate state code
    if (!STATE_BAR_COUNCILS[stateCode]) {
        return {
            valid: false,
            error: `Invalid State Bar Council code: ${stateCode}. Valid codes include: D, MH, UP, KA, etc.`
        };
    }

    // Validate year
    if (year < 1960 || year > currentYear) {
        return {
            valid: false,
            error: `Enrollment year must be between 1960 and ${currentYear}`
        };
    }

    return { valid: true };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            userId,
            barCouncilState,
            enrollmentNumber,
            yearOfEnrollment,
            practiceArea,
            firmName,
            phoneNumber,
        } = body;

        // Validate required fields
        if (!userId || !barCouncilState || !enrollmentNumber || !yearOfEnrollment || !practiceArea || !phoneNumber) {
            return NextResponse.json(
                { error: "All professional details are required" },
                { status: 400 }
            );
        }

        // Validate enrollment number format
        const validation = validateEnrollmentNumber(enrollmentNumber);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Validate phone number (Indian format)
        const phonePattern = /^(\+91[\s-]?)?[6-9]\d{9}$/;
        if (!phonePattern.test(phoneNumber.replace(/\s/g, ''))) {
            return NextResponse.json(
                { error: "Invalid phone number. Please enter a valid Indian mobile number." },
                { status: 400 }
            );
        }

        // Check if enrollment number is already registered
        const existingLawyer = await db
            .select()
            .from(user)
            .where(eq(user.enrollmentNumber, enrollmentNumber.trim().toUpperCase()))
            .limit(1);

        if (existingLawyer.length > 0 && existingLawyer[0].id !== userId) {
            return NextResponse.json(
                { error: "This enrollment number is already registered with another account." },
                { status: 409 }
            );
        }

        // Update user record with lawyer details
        await db
            .update(user)
            .set({
                barCouncilState,
                enrollmentNumber: enrollmentNumber.trim().toUpperCase(),
                yearOfEnrollment,
                practiceArea,
                firmName: firmName || "Independent Practice",
                phoneNumber: phoneNumber.replace(/\s/g, ''),
                verificationStatus: "verified",
            })
            .where(eq(user.id, userId));

        return NextResponse.json({
            success: true,
            message: "Professional details saved successfully.",
            verificationStatus: "verified"
        });

    } catch (error) {
        console.error("Verify lawyer error:", error);
        return NextResponse.json(
            { error: "An internal error occurred. Please try again." },
            { status: 500 }
        );
    }
}
