/**
 * POST /api/analyze
 * Accepts a resume file (PDF/DOCX) and job description text.
 * Returns a detailed ATS score analysis.
 */

import { NextResponse } from "next/server";
import { parseResume } from "@/lib/parser";
import { analyzeResume } from "@/lib/scorer";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("resume");
        const jobDescription = formData.get("jobDescription");

        // Validation
        if (!file || typeof file === "string") {
            return NextResponse.json(
                { error: "Please upload a resume file (PDF or DOCX)." },
                { status: 400 }
            );
        }

        if (!jobDescription || jobDescription.trim().length < 20) {
            return NextResponse.json(
                { error: "Please provide a job description (at least 20 characters)." },
                { status: 400 }
            );
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File is too large. Maximum size is 10MB." },
                { status: 400 }
            );
        }

        // Parse resume
        const resumeText = await parseResume(file);

        // Analyze
        const result = analyzeResume(resumeText, jobDescription);

        return NextResponse.json({
            success: true,
            fileName: file.name,
            ...result,
        });
    } catch (err) {
        console.error("Analysis error:", err);
        return NextResponse.json(
            { error: err.message || "An unexpected error occurred during analysis." },
            { status: 500 }
        );
    }
}
