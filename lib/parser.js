/**
 * Resume Parser
 * Extracts text from PDF and DOCX files
 */

import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function parseResume(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
        return parsePDF(buffer);
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
        return parseDOCX(buffer);
    } else {
        throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
    }
}

async function parsePDF(buffer) {
    try {
        const data = await pdf(buffer);
        const text = data.text;
        if (!text || text.trim().length < 50) {
            throw new Error(
                "Could not extract enough text from the PDF. The file may be image-based. Try a text-based PDF or DOCX."
            );
        }
        return text;
    } catch (err) {
        if (err.message.includes("extract")) throw err;
        throw new Error("Failed to parse PDF file. Please ensure it's a valid PDF document.");
    }
}

async function parseDOCX(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;
        if (!text || text.trim().length < 50) {
            throw new Error("Could not extract enough text from the DOCX file.");
        }
        return text;
    } catch (err) {
        if (err.message.includes("extract")) throw err;
        throw new Error("Failed to parse DOCX file. Please ensure it's a valid Word document.");
    }
}
