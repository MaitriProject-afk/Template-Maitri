import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
                sketch: ['"Architects Daughter"', 'cursive'],
                mono: ['"Space Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                ink: {
                    DEFAULT: '#0f172a',
                    light: '#1e293b',
                    muted: '#64748b',
                },
                paper: {
                    DEFAULT: '#f8fafc',
                    card: '#ffffff',
                    dark: '#f1f5f9',
                },
                brand: {
                    DEFAULT: 'var(--color-brand, #2563eb)',
                    accent: 'var(--color-brand-accent, #38bdf8)',
                    hover: 'var(--color-brand-hover, #1d4ed8)',
                    subtle: 'var(--color-brand-subtle, #e0f2fe)',
                    navy: 'var(--color-brand-navy, #1e40af)',
                },
                sketch: {
                    yellow: '#fef08a',
                    coral: '#fda4af',
                    sky: '#7dd3fc',
                    purple: '#d8b4fe',
                    orange: '#fdba74',
                }
            },
            boxShadow: {
                'sketch-xs': '2px 2px 0px #0f172a',
                'sketch-sm': '3px 3px 0px #0f172a',
                'sketch': '4px 4px 0px #0f172a',
                'sketch-lg': '6px 6px 0px #0f172a',
                'sketch-brand': '4px 4px 0px var(--color-brand, #2563eb)',
            },
        },
    },

    plugins: [forms],
};
