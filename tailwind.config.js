/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                sidebarText: 'rgb(42, 53, 71)',
                sidebarItemHover: '#dff1ff',
                sidebarItemTextHover: '#48adff',
                textBlue: '#539BFF',
                primaryBlue: '#5D87FF',
                secondaryBlue: '#ECF2FF',
                sidebarBorder: '#EAEFF4',
                pageBackground: 'rgb(245,250,250)',
                popUpBackground: '#1116264d',
                primaryText: '#2A3547',
                textSecondary: '#7C8FAC',
                tableTop: '#F2F6FA',
                tableTopText: '#5A6A85',
                listItemHover: '#F8FAFC',
                actionButtonHover: '#EAEFF4',
                listBackground: '#F8FAFC',
            },
            container: {
                center: true,
            },
            writingMode: {
                'vertical-rl': 'vertical-rl',
                'vertical-lr': 'vertical-lr',
                'sideways-rl': 'sideways-rl',
                'sideways-lr': 'sideways-lr',
            },
        },
    },
    plugins: [forms],
};
