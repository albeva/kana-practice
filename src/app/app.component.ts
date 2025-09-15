import { Component } from '@angular/core';

type Theme = 'light' | 'dark' | 'auto';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
})
export class AppComponent {
    private static readonly THEME_KEY = 'theme';

    readonly icons = {
        auto: 'bi-circle-half',
        light: 'bi-brightness-high',
        dark: 'bi-moon',
    };

    theme: Theme = 'auto';

    private readonly mediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
    );

    constructor() {
        this.setTheme(
            (localStorage.getItem(AppComponent.THEME_KEY) as Theme) ?? 'auto'
        );
        this.mediaQuery.addEventListener('change', () => {
            this.updateTheme();
        });
    }

    private updateTheme() {
        this.setTheme(this.theme);
    }

    setTheme(theme: Theme) {
        this.theme = theme;
        localStorage.setItem(AppComponent.THEME_KEY, theme);
        document.documentElement.setAttribute(
            'data-bs-theme',
            theme === 'auto' ? this.systemTheme() : theme
        );
    }

    private systemTheme(): Theme {
        return this.mediaQuery.matches ? 'dark' : 'light';
    }
}
