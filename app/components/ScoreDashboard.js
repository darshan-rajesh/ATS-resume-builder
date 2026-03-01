"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Target,
    Code2,
    LayoutList,
    FileCheck2,
    Flame,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./ScoreDashboard.module.css";

const categoryIcons = {
    keyword: Target,
    skills: Code2,
    sections: LayoutList,
    formatting: FileCheck2,
    impact: Flame,
};

function AnimatedScore({ value, duration = 1.5 }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const step = value / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.round(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [value, duration]);

    return display;
}

function getScoreLevel(score) {
    if (score >= 80) return "excellent";
    if (score >= 65) return "good";
    if (score >= 50) return "average";
    return "poor";
}

function CategoryCard({ id, data, index }) {
    const [expanded, setExpanded] = useState(false);
    const Icon = categoryIcons[id] || Target;
    const level = getScoreLevel(data.score);

    return (
        <motion.div
            className={styles.categoryCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
        >
            <div
                className={styles.categoryHeader}
                onClick={() => setExpanded(!expanded)}
                role="button"
                tabIndex={0}
                id={`category-${id}`}
            >
                <div className={styles.categoryLeft}>
                    <div className={`${styles.categoryIcon} ${styles[level]}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className={styles.categoryName}>{data.label}</h3>
                        <span className={styles.categoryWeight}>{data.weight} weight</span>
                    </div>
                </div>
                <div className={styles.categoryRight}>
                    <span className={`${styles.categoryScore} ${styles[level]}`}>
                        {data.score}%
                    </span>
                    <div className={styles.expandIcon}>
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressTrack}>
                <div
                    className={`${styles.progressFill} ${styles[level]}`}
                    style={{ width: `${data.score}%` }}
                />
            </div>

            {/* Expanded details */}
            {expanded && (
                <motion.div
                    className={styles.details}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Keyword details */}
                    {id === "keyword" && (
                        <div className={styles.detailContent}>
                            <p className={styles.detailStat}>
                                Matched <strong>{data.matched?.length || 0}</strong> of{" "}
                                <strong>{data.total || 0}</strong> keywords
                            </p>
                            {data.matched?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>✓ Found</span>
                                    <div className={styles.tags}>
                                        {data.matched.map((kw) => (
                                            <span key={kw} className={`tag tag-success`}>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.missing?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>✗ Missing</span>
                                    <div className={styles.tags}>
                                        {data.missing.slice(0, 20).map((kw) => (
                                            <span key={kw} className={`tag tag-danger`}>
                                                {kw}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Skills details */}
                    {id === "skills" && (
                        <div className={styles.detailContent}>
                            <p className={styles.detailStat}>
                                Matched <strong>{data.matchedCount || 0}</strong> of{" "}
                                <strong>{data.requiredCount || 0}</strong> required skills
                            </p>
                            {data.required?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>Required Skills</span>
                                    <div className={styles.tags}>
                                        {data.required.map((s) => (
                                            <span
                                                key={s.skill}
                                                className={`tag ${s.found ? "tag-success" : "tag-danger"}`}
                                            >
                                                {s.found ? "✓" : "✗"} {s.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.extra?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>Extra Skills on Resume</span>
                                    <div className={styles.tags}>
                                        {data.extra.map((s) => (
                                            <span key={s.skill} className={`tag tag-info`}>
                                                {s.skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sections details */}
                    {id === "sections" && (
                        <div className={styles.detailContent}>
                            <p className={styles.detailStat}>
                                Found <strong>{data.foundCount || 0}</strong> of{" "}
                                <strong>{data.total || 0}</strong> recommended sections
                            </p>
                            <div className={styles.sectionList}>
                                {data.sections?.map((s) => (
                                    <div key={s.name} className={styles.sectionItem}>
                                        {s.found ? (
                                            <CheckCircle2 size={16} className={styles.sectionFound} />
                                        ) : (
                                            <XCircle size={16} className={styles.sectionMissing} />
                                        )}
                                        <span>{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Formatting details */}
                    {id === "formatting" && (
                        <div className={styles.detailContent}>
                            <p className={styles.detailStat}>
                                Word count: <strong>{data.wordCount || 0}</strong>
                            </p>
                            <div className={styles.sectionList}>
                                <div className={styles.sectionItem}>
                                    {data.hasEmail ? (
                                        <CheckCircle2 size={16} className={styles.sectionFound} />
                                    ) : (
                                        <XCircle size={16} className={styles.sectionMissing} />
                                    )}
                                    <span>Email address</span>
                                </div>
                                <div className={styles.sectionItem}>
                                    {data.hasPhone ? (
                                        <CheckCircle2 size={16} className={styles.sectionFound} />
                                    ) : (
                                        <XCircle size={16} className={styles.sectionMissing} />
                                    )}
                                    <span>Phone number</span>
                                </div>
                                <div className={styles.sectionItem}>
                                    {data.hasURL ? (
                                        <CheckCircle2 size={16} className={styles.sectionFound} />
                                    ) : (
                                        <XCircle size={16} className={styles.sectionMissing} />
                                    )}
                                    <span>LinkedIn / GitHub link</span>
                                </div>
                            </div>
                            {data.tips?.length > 0 && (
                                <div className={styles.tipsList}>
                                    {data.tips.map((tip, i) => (
                                        <div key={i} className={styles.tipItem}>
                                            <AlertTriangle size={14} />
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Impact details */}
                    {id === "impact" && (
                        <div className={styles.detailContent}>
                            <p className={styles.detailStat}>
                                Found <strong>{data.actionVerbs?.length || 0}</strong> action
                                verbs, <strong>{data.quantifiedAchievements || 0}</strong>{" "}
                                quantified achievements
                            </p>
                            {data.actionVerbs?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>Action Verbs Used</span>
                                    <div className={styles.tags}>
                                        {data.actionVerbs.map((v) => (
                                            <span key={v} className={`tag tag-purple`}>
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.weakPhrases?.length > 0 && (
                                <div className={styles.tagGroup}>
                                    <span className={styles.tagLabel}>Weak Phrases to Replace</span>
                                    <div className={styles.tags}>
                                        {data.weakPhrases.map((p) => (
                                            <span key={p} className={`tag tag-warning`}>
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.tips?.length > 0 && (
                                <div className={styles.tipsList}>
                                    {data.tips.map((tip, i) => (
                                        <div key={i} className={styles.tipItem}>
                                            <AlertTriangle size={14} />
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

export default function ScoreDashboard({ result }) {
    const level = getScoreLevel(result.overall);

    const colorMap = {
        excellent: "#34d399",
        good: "#60a5fa",
        average: "#fb923c",
        poor: "#f87171",
    };

    const trailMap = {
        excellent: "rgba(34, 211, 153, 0.1)",
        good: "rgba(96, 165, 250, 0.1)",
        average: "rgba(251, 146, 60, 0.1)",
        poor: "rgba(248, 113, 113, 0.1)",
    };

    return (
        <div className={styles.dashboard} id="score-dashboard">
            {/* Overall Score */}
            <motion.div
                className={styles.overallCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.scoreCircle}>
                    <CircularProgressbar
                        value={result.overall}
                        text={`${result.overall}`}
                        strokeWidth={8}
                        styles={buildStyles({
                            textSize: "28px",
                            textColor: colorMap[level],
                            pathColor: colorMap[level],
                            trailColor: trailMap[level],
                            pathTransitionDuration: 1.5,
                        })}
                    />
                </div>
                <div className={styles.scoreInfo}>
                    <h2 className={styles.scoreTitle}>ATS Compatibility Score</h2>
                    <div className={styles.gradeRow}>
                        <span
                            className={styles.gradeBadge}
                            style={{ background: result.gradeColor + "20", color: result.gradeColor }}
                        >
                            Grade {result.grade}
                        </span>
                        <span className={styles.gradeLabel} style={{ color: result.gradeColor }}>
                            {result.gradeLabel}
                        </span>
                    </div>
                    <p className={styles.fileName}>
                        Analyzed: <strong>{result.fileName}</strong>
                    </p>
                </div>
            </motion.div>

            {/* Category Breakdown */}
            <div className={styles.categories}>
                <h2 className={styles.sectionTitle}>Score Breakdown</h2>
                {Object.entries(result.categories).map(([id, data], index) => (
                    <CategoryCard key={id} id={id} data={data} index={index} />
                ))}
            </div>

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
                <motion.div
                    className={styles.suggestionsCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2 className={styles.sectionTitle}>💡 Improvement Suggestions</h2>
                    <div className={styles.suggestionsList}>
                        {result.suggestions.map((s, i) => (
                            <motion.div
                                key={i}
                                className={styles.suggestionItem}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + i * 0.05 }}
                            >
                                <div className={styles.suggestionHeader}>
                                    <span
                                        className={`tag ${s.priority === "high"
                                                ? "tag-danger"
                                                : s.priority === "medium"
                                                    ? "tag-warning"
                                                    : "tag-info"
                                            }`}
                                    >
                                        {s.priority}
                                    </span>
                                    <span className={styles.suggestionCategory}>{s.category}</span>
                                </div>
                                <p className={styles.suggestionText}>{s.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
