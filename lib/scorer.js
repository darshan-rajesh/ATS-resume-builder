/**
 * ATS Resume Scoring Engine
 * Analyzes resume text against job description and produces a detailed score.
 */

import {
    TECH_SKILLS,
    ALL_TECH_KEYWORDS,
    ACTION_VERBS,
    REQUIRED_SECTIONS,
} from "./keywords.js";

/* ─── helpers ────────────────────────────────────── */

function normalize(text) {
    return text
        .toLowerCase()
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[\r\n]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(text) {
    return normalize(text)
        .split(/[\s,;:()\[\]{}<>\/\\|]+/)
        .filter((t) => t.length > 1);
}

function extractNGrams(text, n) {
    const words = tokenize(text);
    const ngrams = [];
    for (let i = 0; i <= words.length - n; i++) {
        ngrams.push(words.slice(i, i + n).join(" "));
    }
    return ngrams;
}

/* ─── 1. Keyword Match Score (40%) ───────────────── */

function scoreKeywordMatch(resumeText, jdText) {
    const resumeNorm = normalize(resumeText);
    const jdNorm = normalize(jdText);

    // Extract meaningful words from JD (3+ chars, not stop words)
    const stopWords = new Set([
        "the", "and", "for", "are", "but", "not", "you", "all", "can", "her",
        "was", "one", "our", "out", "has", "have", "had", "will", "with",
        "this", "that", "from", "they", "been", "said", "each", "she",
        "which", "their", "about", "would", "make", "like", "just", "over",
        "such", "take", "than", "them", "very", "some", "could", "into",
        "other", "then", "these", "more", "also", "what", "when", "where",
        "who", "how", "its", "your", "able", "must", "should", "work",
        "working", "looking", "role", "position", "team", "company",
        "experience", "years", "strong", "knowledge", "understanding",
        "responsibilities", "requirements", "qualifications", "preferred",
        "required", "including", "using", "used", "join", "opportunity",
    ]);

    const jdWords = tokenize(jdText).filter(
        (w) => w.length >= 3 && !stopWords.has(w)
    );

    // Deduplicate
    const jdKeywords = [...new Set(jdWords)];

    const matched = [];
    const missing = [];

    for (const kw of jdKeywords) {
        if (resumeNorm.includes(kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    }

    const score =
        jdKeywords.length > 0
            ? Math.round((matched.length / jdKeywords.length) * 100)
            : 0;

    return {
        score: Math.min(score, 100),
        matched: matched.slice(0, 40),
        missing: missing.slice(0, 30),
        total: jdKeywords.length,
    };
}

/* ─── 2. Skills Match Score (25%) ────────────────── */

function scoreSkillsMatch(resumeText, jdText) {
    const resumeNorm = normalize(resumeText);
    const jdNorm = normalize(jdText);

    // Also check bigrams for multi-word skills like "react native"
    const resumeBigrams = new Set(extractNGrams(resumeText, 2));
    const jdBigrams = new Set(extractNGrams(jdText, 2));

    const jdSkills = [];
    const resumeSkills = [];

    for (const category of Object.keys(TECH_SKILLS)) {
        for (const skill of TECH_SKILLS[category]) {
            const skillLower = skill.toLowerCase();
            const inJD =
                jdNorm.includes(skillLower) || jdBigrams.has(skillLower);
            const inResume =
                resumeNorm.includes(skillLower) || resumeBigrams.has(skillLower);

            if (inJD) {
                jdSkills.push({ skill, category, found: inResume });
            }
            if (inResume && !jdSkills.find((s) => s.skill === skill)) {
                resumeSkills.push({ skill, category });
            }
        }
    }

    const requiredCount = jdSkills.length;
    const matchedCount = jdSkills.filter((s) => s.found).length;
    const score =
        requiredCount > 0
            ? Math.round((matchedCount / requiredCount) * 100)
            : 50; // if JD has no identifiable tech skills, give average

    return {
        score: Math.min(score, 100),
        required: jdSkills,
        extra: resumeSkills.slice(0, 20),
        matchedCount,
        requiredCount,
    };
}

/* ─── 3. Section Completeness Score (15%) ────────── */

function scoreSections(resumeText) {
    const resumeNorm = normalize(resumeText);
    const results = [];

    for (const section of REQUIRED_SECTIONS) {
        const found = section.patterns.some((p) => resumeNorm.includes(p));
        results.push({ name: section.name, found });
    }

    const foundCount = results.filter((s) => s.found).length;
    const score = Math.round((foundCount / REQUIRED_SECTIONS.length) * 100);

    return { score, sections: results, foundCount, total: REQUIRED_SECTIONS.length };
}

/* ─── 4. Formatting & Readability Score (10%) ────── */

function scoreFormatting(resumeText) {
    const words = resumeText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const tips = [];
    let deductions = 0;

    // Word count check
    if (wordCount < 200) {
        tips.push("Resume is too short. Add more details about your experience and projects.");
        deductions += 30;
    } else if (wordCount < 300) {
        tips.push("Resume could be more detailed. Aim for 400-800 words.");
        deductions += 15;
    } else if (wordCount > 1200) {
        tips.push("Resume may be too long. Consider being more concise.");
        deductions += 10;
    }

    // Check for email
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
    if (!hasEmail) {
        tips.push("Add your email address for contact information.");
        deductions += 10;
    }

    // Check for phone
    const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(resumeText);
    if (!hasPhone) {
        tips.push("Consider adding a phone number.");
        deductions += 5;
    }

    // Check for URLs (LinkedIn/GitHub)
    const hasURL = /(linkedin|github|portfolio|http|www)/i.test(resumeText);
    if (!hasURL) {
        tips.push("Add links to your LinkedIn profile and GitHub to strengthen your resume.");
        deductions += 5;
    }

    // Check for excessive special characters (may indicate tables or bad formatting)
    const specialCharRatio =
        (resumeText.replace(/[a-zA-Z0-9\s.,;:!?'"()-]/g, "").length) /
        resumeText.length;
    if (specialCharRatio > 0.1) {
        tips.push("Resume may contain formatting that ATS systems struggle to parse (tables, images, special characters).");
        deductions += 15;
    }

    // Bullet points / line structure
    const lines = resumeText.split(/\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 10) {
        tips.push("Use bullet points to break up your experience into readable items.");
        deductions += 10;
    }

    const score = Math.max(0, 100 - deductions);

    return { score, tips, wordCount, hasEmail, hasPhone, hasURL };
}

/* ─── 5. Impact & Action Verbs Score (10%) ───────── */

function scoreImpact(resumeText) {
    const resumeNorm = normalize(resumeText);
    const tokens = new Set(tokenize(resumeText));

    // Action verbs
    const foundVerbs = ACTION_VERBS.filter(
        (v) => tokens.has(v) || resumeNorm.includes(v)
    );

    // Quantified achievements
    const numberMatches = resumeText.match(/\d+[%+xX]|\$\d+|\d+\s*(percent|users|customers|clients|projects|applications|servers|team members|engineers|developers)/gi) || [];
    const hasNumbers = numberMatches.length;

    // Weak phrases to penalize
    const weakPhrases = [
        "responsible for",
        "duties included",
        "assisted with",
        "helped with",
        "worked on",
        "participated in",
    ];
    const weakFound = weakPhrases.filter((p) => resumeNorm.includes(p));

    let score = 0;

    // Action verbs: up to 50 points
    if (foundVerbs.length >= 8) score += 50;
    else if (foundVerbs.length >= 5) score += 40;
    else if (foundVerbs.length >= 3) score += 25;
    else if (foundVerbs.length >= 1) score += 15;

    // Quantified achievements: up to 35 points
    if (hasNumbers >= 5) score += 35;
    else if (hasNumbers >= 3) score += 25;
    else if (hasNumbers >= 1) score += 15;

    // Bonus for no weak phrases: 15 points
    if (weakFound.length === 0) score += 15;
    else score += Math.max(0, 15 - weakFound.length * 5);

    const tips = [];
    if (foundVerbs.length < 5) {
        tips.push("Use more action verbs like 'Developed', 'Architected', 'Optimized', 'Led'.");
    }
    if (hasNumbers < 3) {
        tips.push("Quantify your achievements (e.g., 'Reduced load time by 40%', 'Managed team of 8').");
    }
    if (weakFound.length > 0) {
        tips.push(`Replace weak phrases like "${weakFound[0]}" with stronger action-oriented language.`);
    }

    return {
        score: Math.min(score, 100),
        actionVerbs: foundVerbs.slice(0, 15),
        quantifiedAchievements: hasNumbers,
        weakPhrases: weakFound,
        tips,
    };
}

/* ─── Main Scoring Function ──────────────────────── */

export function analyzeResume(resumeText, jobDescription) {
    const keyword = scoreKeywordMatch(resumeText, jobDescription);
    const skills = scoreSkillsMatch(resumeText, jobDescription);
    const sections = scoreSections(resumeText);
    const formatting = scoreFormatting(resumeText);
    const impact = scoreImpact(resumeText);

    // Weighted overall score
    const overall = Math.round(
        keyword.score * 0.4 +
        skills.score * 0.25 +
        sections.score * 0.15 +
        formatting.score * 0.1 +
        impact.score * 0.1
    );

    // Determine grade
    let grade, gradeLabel, gradeColor;
    if (overall >= 80) {
        grade = "A";
        gradeLabel = "Excellent";
        gradeColor = "#34d399";
    } else if (overall >= 65) {
        grade = "B";
        gradeLabel = "Good";
        gradeColor = "#60a5fa";
    } else if (overall >= 50) {
        grade = "C";
        gradeLabel = "Average";
        gradeColor = "#fb923c";
    } else if (overall >= 35) {
        grade = "D";
        gradeLabel = "Below Average";
        gradeColor = "#f87171";
    } else {
        grade = "F";
        gradeLabel = "Needs Improvement";
        gradeColor = "#ef4444";
    }

    // Compile all suggestions
    const suggestions = [];

    // Keyword suggestions
    if (keyword.score < 60) {
        suggestions.push({
            category: "Keywords",
            priority: "high",
            text: "Your resume is missing many keywords from the job description. Review the missing keywords below and naturally incorporate them.",
        });
    }

    // Skills suggestions
    const missingSkills = skills.required.filter((s) => !s.found);
    if (missingSkills.length > 0) {
        suggestions.push({
            category: "Skills",
            priority: missingSkills.length > 3 ? "high" : "medium",
            text: `Add these missing skills to your resume: ${missingSkills.slice(0, 8).map((s) => s.skill).join(", ")}.`,
        });
    }

    // Section suggestions
    const missingSections = sections.sections.filter((s) => !s.found);
    if (missingSections.length > 0) {
        suggestions.push({
            category: "Sections",
            priority: missingSections.length > 2 ? "high" : "medium",
            text: `Add these sections to your resume: ${missingSections.map((s) => s.name).join(", ")}.`,
        });
    }

    // Formatting suggestions
    for (const tip of formatting.tips) {
        suggestions.push({ category: "Formatting", priority: "low", text: tip });
    }

    // Impact suggestions
    for (const tip of impact.tips) {
        suggestions.push({ category: "Impact", priority: "medium", text: tip });
    }

    return {
        overall,
        grade,
        gradeLabel,
        gradeColor,
        categories: {
            keyword: { label: "Keyword Match", weight: "40%", ...keyword },
            skills: { label: "Skills Match", weight: "25%", ...skills },
            sections: { label: "Section Completeness", weight: "15%", ...sections },
            formatting: { label: "Formatting & Readability", weight: "10%", ...formatting },
            impact: { label: "Impact & Action Verbs", weight: "10%", ...impact },
        },
        suggestions,
    };
}
