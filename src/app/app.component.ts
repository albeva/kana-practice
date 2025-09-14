import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
})
export class AppComponent {
    title = 'kana-practice';

    private mode = window.matchMedia('(prefers-color-scheme: dark)');

    constructor() {
        this.updateTheme();
        this.mode.addEventListener('change', () => {
            this.updateTheme();
        });
    }

    private updateTheme() {
        this.setTheme('auto');
    }

    private setTheme(theme: string) {
        if (theme === 'auto') {
            document.documentElement.setAttribute(
                'data-bs-theme',
                this.systemTheme()
            );
        } else {
            document.documentElement.setAttribute('data-bs-theme', theme);
        }
    }

    private systemTheme() {
        return this.mode.matches ? 'dark' : 'light';
    }
}
