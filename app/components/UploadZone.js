"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import styles from "./UploadZone.module.css";

export default function UploadZone({ file, onFileSelect, onRemove }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "application/msword": [".doc"],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
    });

    if (file) {
        return (
            <div className={styles.selected}>
                <div className={styles.fileInfo}>
                    <div className={styles.fileIcon}>
                        <FileText size={20} />
                    </div>
                    <div className={styles.fileMeta}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>
                            {(file.size / 1024).toFixed(1)} KB
                        </span>
                    </div>
                    <CheckCircle size={18} className={styles.checkIcon} />
                </div>
                <button className={styles.removeBtn} onClick={onRemove} aria-label="Remove file">
                    <X size={16} />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}
            id="upload-zone"
        >
            <input {...getInputProps()} id="resume-upload-input" />
            <div className={styles.content}>
                <div className={styles.iconWrap}>
                    <Upload size={28} />
                </div>
                <p className={styles.title}>
                    {isDragActive ? "Drop your resume here" : "Drop your resume here"}
                </p>
                <p className={styles.subtitle}>or click to browse — PDF, DOCX supported</p>
                <span className={styles.maxSize}>Max 10MB</span>
            </div>
        </div>
    );
}
