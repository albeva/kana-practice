import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { KANA, CharacterSet, ROMAJI, HIRAGANA, KATAKANA } from '@app/kana/kana';
import { WORDS_HIRAGANA } from '@app/kana/words_hiragana';
import { WORDS_KATAKANA } from '@app/kana/words_katakana';

const enum Mode {
    Kana = 0,
    Words = 1
}

interface CharacterState {
    guess: string;
    expect: string;
    css: string;
}

interface PracticeRound {
    guess: string;
    parts: CharacterState[]
    expected: string;
}

type CharResult = {char: string, partial: boolean};

const KEY_BEST_SCORE = 'bestScore';

const COMBO = ['ゃ', 'ゅ', 'ょ', 'ャ', 'ュ', 'ョ'];

@Component({
    selector: 'app-practice',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.scss'],
    standalone: false
})
export class PracticeComponent implements OnInit {
    @ViewChild('guessInput') guessInputEl!: ElementRef;

    read!: CharacterSet[];
    modes!: Mode[];
    game!: PracticeRound;
    previous?: string;
    input = '';

    invalid = false;
    disabled = false;
    failed = false;
    success = false;
    failures = 0;
    successes = 0;
    best = 0;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(this.reset.bind(this));
    }

    skip() {
        if (!this.failed) {
            this.failures += 1;
        }
        this.next();
    }

    update(input: string) {
        if (this.disabled) {
            return;
        }
        const parts = this.game.parts;

        input = input.toLowerCase();
        let start = 0;
        let failed = false;

        for (let idx = 0; idx < parts.length; idx++) {
            const part = parts[idx];
            if (start >= input.length) {
                part.css = 'text-muted';
                continue;
            }

            const len = part.expect.length;
            const ch = input.substring(start, start + len);
            start += len;

            if (ch === part.expect) {
                part.css = 'text-success';
            } else if (ch.length < len && part.expect.search(ch) === 0) {
                part.css = 'text-wip';
            } else {
                part.css = 'text-danger';
                failed = true;
            }
        }

        if (failed && !this.failed) {
            this.failed = true;
            this.failures += 1;
        }

        this.invalid = failed;

        if (input == this.game.expected) {
            if (!this.failed) {
                this.successes += 1;
                if (this.successes > this.best) {
                    this.best = this.successes;
                    localStorage.setItem(KEY_BEST_SCORE, this.best.toString());
                }
            }
            this.disabled = true;
            this.success = true;
            setTimeout(() => {
                this.next();
            }, 500);
        }
    }

    private reset(params: Params) {
        this.read = [];
        const read = params['read'].split(',');
        if (read.indexOf('hiragana') != -1) { this.read.push(CharacterSet.Hiragana); }
        if (read.indexOf('katakana') != -1) { this.read.push(CharacterSet.Katakana); }

        this.modes = [];
        const modes = params['mode'].split(',');
        if (modes.indexOf('kana') != -1) { this.modes.push(Mode.Kana); }
        if (modes.indexOf('words') != -1) { this.modes.push(Mode.Words); }

        this.failures = 0;
        this.successes = 0;

        const savedBest = localStorage.getItem(KEY_BEST_SCORE);
        if (savedBest !== null) {
            this.best = parseInt(savedBest);
        }

        this.next();
    }

    private next() {
        this.input = '';
        this.invalid = false;
        this.disabled = false;
        this.failed = false;
        this.success = false;
        this.previous = this.game?.guess;

        const read = this.read.randomElement();
        switch (this.modes.randomElement()) {
            case Mode.Kana:
                this.game = this.getRandomKana(read);
                break;
            case Mode.Words:
                this.game = this.getRandomWord(read);
                break;
        }

        setTimeout(() => {
            this.guessInputEl.nativeElement.focus();
        });
    }

    private getRandomKana(read: CharacterSet): PracticeRound {
        const kana = KANA.randomElement();
        const guess = kana[read];
        const expected = kana[CharacterSet.Romaji];

        if (guess === null || expected === null || this.previous === guess) {
            return this.getRandomKana(read);
        }

        return {
            guess,
            expected,
            parts: [
                {guess: guess, expect: expected, css: 'text-muted'}
            ]
        };
    }

    private getRandomWord(read: CharacterSet): PracticeRound {
        const words = read == CharacterSet.Hiragana ? WORDS_HIRAGANA : WORDS_KATAKANA;
        const word = words.randomElement();
        if (word === this.previous) {
            return this.getRandomWord(read);
        }

        const set = read == CharacterSet.Hiragana ? HIRAGANA : KATAKANA;
        let expected = '';
        let parts: CharacterState[] = [];

        const len = word.length;
        for (let pos = 0; pos < len; pos++) {
            let ch = word[pos];
            let guess = ch;
            const nch = pos + 1 < len ? word[pos + 1] : '';

            let prefix = false;
            let suffix = false;
            if (COMBO.indexOf(nch) !== -1) {
                pos += 1;
                ch += nch;
                guess += nch;
            } else if (nch === 'ー') {
                pos += 1;
                suffix = true;
                guess += nch;
            } else if (ch === 'っ') {
                pos += 1;
                ch = nch;
                prefix = true;
                guess += nch;
            }

            const idx = set.indexOf(ch);
            if (idx === -1) {
                throw "Not found for " + ch;
            }

            let romaji = ROMAJI[idx];
            if (prefix) {
                romaji = romaji[0] + romaji;
            } else if (suffix) {
                romaji += romaji[romaji.length - 1];
            }

            expected += romaji;
            parts.push({
                guess,
                expect: romaji,
                css: 'text-muted'
            });
        }

        return {guess: word, expected, parts}
    }
}
