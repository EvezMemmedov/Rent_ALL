import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check local storage or system preference
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme') as Theme | null;
            if (stored === 'dark' || stored === 'light') return stored;

            // Fallback to system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light'; // Default to light
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
