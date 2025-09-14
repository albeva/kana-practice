import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface State {
    kana: boolean;
    words: boolean;
    hiragana: boolean;
    katakana: boolean;
}

const FORM_KEY = 'practice_form';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false,
})
export class HomeComponent {
    state: State;

    constructor(private router: Router) {
        this.state = this.getSavedState() ?? {
            kana: true,
            words: false,
            hiragana: true,
            katakana: false,
        };
    }

    submit() {
        if (!this.isValid()) {
            return;
        }

        const params = (...keys: (keyof State)[]): string => {
            return keys.filter((k) => this.state[k]).join(',');
        };

        this.router.navigate([
            '/practice',
            params('kana', 'words'),
            params('hiragana', 'katakana'),
        ]);
    }

    toggle(key: keyof State) {
        this.state[key] = !this.state[key];
        localStorage.setItem(FORM_KEY, JSON.stringify(this.state));
    }

    isValid(): boolean {
        return (
            (this.state.kana || this.state.words) &&
            (this.state.hiragana || this.state.katakana)
        );
    }

    private getSavedState(): State | undefined {
        let existing = localStorage.getItem(FORM_KEY);
        return existing !== null ? JSON.parse(existing) : undefined;
    }
}
