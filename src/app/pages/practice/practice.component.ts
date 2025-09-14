import {
    Component,
    ElementRef,
    HostListener,
    ViewChild,
    ChangeDetectorRef,
    effect,
    input,
} from '@angular/core';
import {
    CharacterSet,
    KANA,
    COMBO,
    ROMAJI,
    HIRAGANA,
    KATAKANA,
} from '@app/kana/kana';
import { WORDS_HIRAGANA } from '@app/kana/words_hiragana';
import { WORDS_KATAKANA } from '@app/kana/words_katakana';

const enum Mode {
    Kana = 0,
    Words = 1,
}

interface CharacterState {
    guess: string;
    expect: string;
    css: string;
}

interface PracticeRound {
    word: boolean;
    guess: string;
    parts: CharacterState[];
    expected: string;
}

type CharResult = { char: string; partial: boolean };

const KEY_BEST_SCORE = 'bestScore';

@Component({
    selector: 'app-practice',
    templateUrl: './practice.component.html',
    styleUrls: ['./practice.component.scss'],
    standalone: false,
})
export class PracticeComponent {
    // Text input element.
    @ViewChild('guessInput', { static: true }) guessInputEl!: ElementRef;

    // Route parameters.
    modeParams = input('', { alias: 'mode' });
    readParams = input('', { alias: 'read' });

    // Current guessing mode and character sets.
    read!: CharacterSet[];
    modes!: Mode[];
    game!: PracticeRound;
    previous?: string;

    // Current state of the guess.
    input = '';
    invalid = false;
    disabled = false;
    failed = false;
    success = false;

    // Score statistics.
    failures = 0;
    successes = 0;
    best = 0;

    constructor(private cdr: ChangeDetectorRef) {
        effect(this.reset.bind(this));
    }

    @HostListener('window:focus')
    private focus() {
        this.guessInputEl.nativeElement.focus();
    }

    skip() {
        if (!this.failed) {
            this.failures += 1;
        }
        this.next();
    }

    update() {
        if (this.disabled) {
            return;
        }
        const parts = this.game.parts;

        const input = this.input.toLowerCase().trim();
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
                this.cdr.markForCheck();
            }, 500);
        }
    }

    private reset() {
        this.read = [];
        const read = this.readParams().split(',');
        if (read.indexOf('hiragana') != -1) {
            this.read.push(CharacterSet.Hiragana);
        }
        if (read.indexOf('katakana') != -1) {
            this.read.push(CharacterSet.Katakana);
        }

        this.modes = [];
        const modes = this.modeParams().split(',');
        if (modes.indexOf('kana') != -1) {
            this.modes.push(Mode.Kana);
        }
        if (modes.indexOf('words') != -1) {
            this.modes.push(Mode.Words);
        }

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

        this.focus();
    }

    private getRandomKana(read: CharacterSet): PracticeRound {
        const kana = KANA.randomElement();
        const guess = kana[read];
        if (!guess) {
            return this.getRandomKana(read);
        }
        const expected = kana[CharacterSet.Romaji];

        if (guess === null || expected === null || this.previous === guess) {
            return this.getRandomKana(read);
        }

        return {
            word: false,
            guess,
            expected,
            parts: [{ guess: guess, expect: expected, css: 'text-muted' }],
        };
    }

    private getRandomWord(read: CharacterSet): PracticeRound {
        const words =
            read == CharacterSet.Hiragana ? WORDS_HIRAGANA : WORDS_KATAKANA;
        const word = words.randomElement();

        if (word === this.previous) {
            return this.getRandomWord(read);
        }

        const set = read == CharacterSet.Hiragana ? HIRAGANA : KATAKANA;
        let expected = '';
        let parts: CharacterState[] = [];

        const len = word.length;
        for (let pos = 0; pos < len; pos++) {
            const nextCh = () => (pos + 1 < len ? word[pos + 1] : '');

            let ch = word[pos];
            let guess = ch;

            let prefix = false;
            let suffix = false;

            while (true) {
                let nch = nextCh();
                if (COMBO.indexOf(nch) !== -1) {
                    pos += 1;
                    ch += nch;
                    guess += nch;
                    continue;
                }
                if (ch === 'っ' || ch === 'ッ') {
                    pos += 1;
                    ch = nch;
                    prefix = true;
                    guess += nch;
                    continue;
                }
                if (nch === 'ー') {
                    pos += 1;
                    suffix = true;
                    guess += nch;
                    continue;
                }
                break;
            }

            const idx = set.indexOf(ch);
            if (idx === -1) {
                console.error('Not found for ' + ch);
                throw 'Not found for ' + ch;
            }

            let romaji = ROMAJI[idx];
            if (prefix) {
                romaji = romaji[0] + romaji;
            }

            if (suffix) {
                romaji += romaji[romaji.length - 1];
            }

            expected += romaji;
            parts.push({
                guess,
                expect: romaji,
                css: 'text-muted',
            });
        }

        return { word: true, guess: word, expected, parts };
    }
}
