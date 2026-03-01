"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Upload,
  Briefcase,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Scan,
} from "lucide-react";
import Header from "./components/Header";
import UploadZone from "./components/UploadZone";
import ScoreDashboard from "./components/ScoreDashboard";
import styles from "./page.module.css";

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const canAnalyze = file && jobDescription.trim().length >= 20 && !loading;

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
  }

  return (
    <div className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero}>
        {/* Floating Orbs */}
        <div className={`${styles.orb} ${styles.orb1}`} aria-hidden="true" />
        <div className={`${styles.orb} ${styles.orb2}`} aria-hidden="true" />
        <div className={`${styles.orb} ${styles.orb3}`} aria-hidden="true" />

        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles size={13} />
            <span>AI-Powered Analysis</span>
          </motion.div>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Score your resume for{" "}
            <span className="gradient-text">Tech Jobs</span>
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Upload your resume, paste the job description, and get an instant
            ATS compatibility score with actionable feedback.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainSection}>
        <div className={styles.mainContainer}>
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="input"
                className={styles.inputSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Upload */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                    <Upload size={16} />
                    Upload Resume
                  </label>
                  <span className={styles.inputHint}>
                    PDF or DOCX • max 10MB
                  </span>
                  <UploadZone
                    file={file}
                    onFileSelect={setFile}
                    onRemove={() => setFile(null)}
                  />
                </div>

                {/* Job Description */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel} htmlFor="jd-textarea">
                    <Briefcase size={16} />
                    Job Description
                  </label>
                  <span className={styles.inputHint}>
                    Paste the full JD for best results
                  </span>
                  <textarea
                    id="jd-textarea"
                    className={styles.jdTextarea}
                    placeholder={"Paste the job description here...\n\nExample: We are looking for a Senior Frontend Engineer with experience in React, TypeScript, Next.js..."}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                  />
                  <div className={styles.charCount}>
                    {jobDescription.length} chars
                    {jobDescription.length > 0 && jobDescription.length < 20 && (
                      <span> — min 20 required</span>
                    )}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className={styles.errorBox}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  className={styles.analyzeBtn}
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  id="analyze-button"
                >
                  <Scan size={19} />
                  Analyze Resume
                  <ArrowRight size={17} />
                </button>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div
                key="loading"
                className={styles.loadingOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Analyzing your resume...</p>
                <p className={styles.loadingSub}>
                  Matching keywords · checking sections · scoring impact
                </p>
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ScoreDashboard result={result} />
                <div className={styles.resetRow}>
                  <button
                    className={styles.resetBtn}
                    onClick={handleReset}
                    id="reset-button"
                  >
                    <RotateCcw size={15} />
                    Analyze Another Resume
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGlow} aria-hidden="true" />
        <p>
          Built with ♥ — <strong>ATS Resume Scorer</strong> for Tech Jobs
        </p>
      </footer>
    </div>
  );
}
