import { Component, Input } from '@angular/core';
import { KANA, ROMAJI } from '@app/kana/kana';

export interface KanaTableTemplate {
    characters: string[];
    name: string;
    cols: string[];
    rows: string[];
    map: Record<string, string>;
}

@Component({
    selector: 'kana-table',
    templateUrl: './kana-table.component.html',
    styleUrls: ['./kana-table.component.scss'],
    standalone: false,
})
export class KanaTableComponent {
    @Input('template') template!: KanaTableTemplate;

    romaji(col: string, row: string): string {
        const index = this.find(col, row);
        if (index === undefined) {
            return '';
        }

        if (!this.template.characters[index]) {
            return '';
        }

        const kana = KANA[index];
        if (kana.length === 4) {
            return kana[0] + ' / ' + kana[3];
        } else {
            return kana[0] ?? '';
        }
    }

    kana(col: string, row: string): string {
        const index = this.find(col, row);
        if (index === undefined) {
            return '';
        }
        return this.template.characters[index] ?? '';
    }

    private find(col: string, row: string): number | undefined {
        let romaji = row + col;
        if (romaji in this.template.map) {
            romaji = this.template.map[romaji];
        }
        const idx = ROMAJI.indexOf(romaji);
        if (idx === -1) {
            return undefined;
        }
        return idx;
    }
}
