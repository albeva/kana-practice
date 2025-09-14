import { Component, signal, effect } from '@angular/core';
import { Router } from '@angular/router';

interface State {
    kana: boolean;
    words: boolean;
    hiragana: boolean;
    katakana: boolean;
}

const DEFAULTS: State = {
    kana: true,
    words: false,
    hiragana: true,
    katakana: false,
};

const FORM_KEY = 'practice_form';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false,
})
export class HomeComponent {
    state = signal<State>(DEFAULTS);

    constructor(private router: Router) {
        const saved = this.getSavedState();
        if (saved) {
            this.state.set(saved);
        }

        effect(() => {
            localStorage.setItem(FORM_KEY, JSON.stringify(this.state()));
        });
    }

    submit() {
        if (!this.isValid()) {
            return;
        }

        const state = this.state();
        const flatten = (...keys: (keyof State)[]): string => {
            return keys.filter(k => state[k]).join(',');
        };

        this.router.navigate(['/practice', flatten('kana', 'words') , flatten('hiragana', 'katakana')]);
    }

    toggle(key: keyof State) {
        this.state.update(s => ({ ...s, [key]: !s[key] }));
    }

    isValid(): boolean {
        const state = this.state();
        return (state.kana || state.words) && (state.hiragana || state.katakana);
    }

    private getSavedState(): State | undefined {
        let existing = localStorage.getItem(FORM_KEY);
        return existing !== null ? JSON.parse(existing) : undefined;
    }
}
