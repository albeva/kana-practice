import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

const MODES = ['kana', 'words'];
const READ = ['hiragana', 'katakana'];

const DEFAULTS = {
    kana: true,
    words: false,
    hiragana: true,
    katakana: false
};

const FORM_KEY = 'practice_form';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    form: UntypedFormGroup;

    constructor(builder: UntypedFormBuilder, private router: Router) {
        this.form = builder.group(this.getInitialFormValues());
        this.form.addValidators(this.validate.bind(this));
        this.form.valueChanges.subscribe(values => {
            localStorage.setItem(FORM_KEY, JSON.stringify(values));
        });
    }

    submit() {
        this.router.navigate(['/practice', this.flatten(MODES), this.flatten(READ)]);
    }

    private getInitialFormValues(): any {
        let existing = localStorage.getItem(FORM_KEY);
        return existing !== null ? JSON.parse(existing) : DEFAULTS;
    }

    private validate(control: AbstractControl): ValidationErrors | null {
        let mode = this.isAnySelected(MODES);
        let read = this.isAnySelected(READ)
        return mode && read ? null : {"src": "missing"};
    }

    private flatten(opts: string[]): string {
        let results: string[] = [];
        for (const key of opts) {
            if (this.form.value[key] === true) {
                results.push(key);
            }
        }
        return results.join(',');
    }

    private isAnySelected(opts: string[]): boolean {
        for (const key of opts) {
            if (this.form.value[key] === true) {
                return true;
            }
        }
        return false;
    }
}
