import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";

export const metadata = {
  title: "ATS Resume Scorer — Score Your Resume for Tech Jobs",
  description:
    "Upload your resume and paste a job description to get an instant ATS compatibility score with actionable feedback for tech roles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="grid-overlay" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
