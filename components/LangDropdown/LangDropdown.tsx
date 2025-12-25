"use client";

import React, { useEffect, useRef, useState } from "react";
import US from "country-flag-icons/react/3x2/US";
import DE from "country-flag-icons/react/3x2/DE";
import styles from "./LangDropdown.module.scss";

export type Lang = "en" | "de";

export default function LangDropdown({
    value,
    onChange,
}: {
    value: Lang;
    onChange: (v: Lang) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    return (
        <div className={styles.langDropdown} ref={ref}>
            <button
                type="button"
                className={styles.langToggle}
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={styles.flag} aria-hidden>
                    {value === "en" ? <US /> : <DE />}
                </span>
                <span className={styles.langLabel}>{value.toUpperCase()}</span>
            </button>
            {open ? (
                <ul className={styles.langList} role="listbox">
                    <li
                        role="option"
                        aria-selected={value === "en"}
                        onClick={() => {
                            onChange("en");
                            setOpen(false);
                        }}
                    >
                        <span className={styles.flag} aria-hidden>
                            <US />
                        </span>
                        EN
                    </li>
                    <li
                        role="option"
                        aria-selected={value === "de"}
                        onClick={() => {
                            onChange("de");
                            setOpen(false);
                        }}
                    >
                        <span className={styles.flag} aria-hidden>
                            <DE />
                        </span>
                        DE
                    </li>
                </ul>
            ) : null}
        </div>
    );
}
