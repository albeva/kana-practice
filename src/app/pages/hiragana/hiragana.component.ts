import { Component } from '@angular/core';
import { KanaTableTemplate } from '@app/components/kana-table/kana-table.component';
import { HIRAGANA } from '@app/kana/kana';

@Component({
    selector: 'app-hiragana',
    templateUrl: './hiragana.component.html',
    styleUrls: ['./hiragana.component.scss'],
    standalone: false,
})
export class HiraganaComponent {
    hiragana: KanaTableTemplate = {
        characters: HIRAGANA,
        name: 'Hiragana characters',
        cols: ['a', 'i', 'u', 'e', 'o'],
        rows: ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
        map: {
            si: 'shi',
            ti: 'chi',
            tu: 'tsu',
            hu: 'fu',
        },
    };

    diacritical: KanaTableTemplate = {
        characters: HIRAGANA,
        name: 'Hiragana diacritical marks',
        cols: ['a', 'i', 'u', 'e', 'o'],
        rows: ['g', 'z', 'd', 'b', 'p'],
        map: {
            zi: 'ji',
            di: 'dji',
            du: 'dzu',
        },
    };

    combos: KanaTableTemplate = {
        characters: HIRAGANA,
        name: 'Hiragana combos',
        cols: ['a', 'u', 'o'],
        rows: [
            'ky',
            'sh',
            'ch',
            'ny',
            'hy',
            'my',
            'ry',
            'gy',
            'j',
            'dj',
            'by',
            'py',
        ],
        map: {},
    };
}
