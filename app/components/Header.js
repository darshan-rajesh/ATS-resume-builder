"use client";

import { FileText, Zap, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import styles from "./Header.module.css";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <FileText size={20} />
                    </div>
                    <span className={styles.logoText}>
                        ATS<span className={styles.logoAccent}>Score</span>
                    </span>
                </div>

                <div className={styles.right}>
                    <div className={styles.badge}>
                        <Zap size={12} />
                        <span>For Tech Jobs</span>
                    </div>

                    <button
                        className={styles.themeToggle}
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
                        id="theme-toggle"
                        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        <span className={`${styles.iconWrap} ${isDark ? styles.iconHidden : ""}`}>
                            <Sun size={16} />
                        </span>
                        <span className={`${styles.iconWrap} ${!isDark ? styles.iconHidden : ""}`}>
                            <Moon size={16} />
                        </span>
                    </button>
                </div>
            </div>
            <div className={styles.headerGlow} aria-hidden="true" />
        </header>
    );
}
