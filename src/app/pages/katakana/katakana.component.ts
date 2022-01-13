import { Component } from '@angular/core';
import { KanaTableTemplate } from '@app/components/kana-table/kana-table.component';
import { KATAKANA } from '@app/kana/kana';

@Component({
    selector: 'app-katakana',
    templateUrl: './katakana.component.html',
    styleUrls: ['./katakana.component.scss']
})
export class KatakanaComponent {
    hiragana: KanaTableTemplate = {
        characters: KATAKANA,
        name: 'Katakana characters',
        cols: ['a', 'i', 'u', 'e', 'o'],
        rows: ['', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w'],
        map: {
            si: 'shi',
            ti: 'chi',
            tu: 'tsu',
            hu: 'fu'
        }
    }

    diacritical: KanaTableTemplate = {
        characters: KATAKANA,
        name: 'Katakana diacritical marks',
        cols: ['a', 'i', 'u', 'e', 'o'],
        rows: ['g', 'z', 'd', 'b', 'p'],
        map: {
            zi: 'ji',
            di: 'dji',
            du: 'dzu'
        }
    }

    combos: KanaTableTemplate = {
        characters: KATAKANA,
        name: 'Katakana combos',
        cols: ['a', 'u', 'o'],
        rows: ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry', 'gy', 'j', 'dj', 'by', 'py'],
        map: { }
    }
}
