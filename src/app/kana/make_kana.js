'use strict';
const fs = require('fs');

const hiragana = JSON.parse(fs.readFileSync('hiragana.json'));
const katakana = JSON.parse(fs.readFileSync('katakana.json'));
let kana = {};

for (const row of hiragana) {
    const rom = row[0];
    if (rom in kana) {
        console.error("Duplicate hiragana: " + rom);
        return;
    }
    kana[rom] = {'h': row[1]};
    if (row.length === 3) {
        kana[rom].alt = row[2];
    }
}

for (const row of katakana) {
    const rom = row[0];
    if (rom in kana) {
        if ('k' in kana[rom]) {
            console.error("Duplicate Katakana: " + rom);
            return;
        }
        kana[rom].k = row[1];
    } else {
        kana[rom] = {'k': row[1]};
    }

    if (row.length === 3) {
        if ("alt" in kana[rom]) {
            if (kana[rom].alt !== row[2]) {
                console.error("Mismatching alt for " + rom);
                return;
            }
        } else {
            kana[rom].alt = row[2];
        }
    }
}

let table = [];
for (const key in kana) {
    let row = [key];
    const val = kana[key];
    if ("h" in val) {
        row.push(val.h);
    } else {
        row.push(null);
    }
    if ("k" in val) {
        row.push(val.k);
    } else {
        row.push(null);
    }

    if ("alt" in val) {
        row.push(val.alt);
    }

    table.push(row);
}

let output = "export const KANA = [\n";
let first = true;
for (const row of table) {
    if (first) {
        first = false;
    } else {
        output += ",\n";
    }
    output += "    [";

    let romaji = row[0];
    let hira = row[1];
    let kata = row[2];

    output += "'" + romaji + "', "
    if (romaji.length < 3) {
        output += " ";
        if (romaji.length < 2) {
            output += " ";
        }
    }

    if (hira === null) {
        output += "null,  ";
    } else {
        output += "'" + hira + "', ";
        if (hira.length < 2) {
            output += "  ";
        }
    }

    if (kata === null) {
        output += "null";
    } else {
        output += "'" + kata + "'";
    }

    if (row.length == 4) {
        output += ", '" + row[3] + "'"
    }

    output += "]";
}

output += "\n];\n\n";
output += "export const enum CharacterSet {\n";
output += "    Romaji = 0,\n";
output += "    Hiragana = 1,\n";
output += "    Katakana = 2\n";
output += "}\n\n";
output += "export const ROMAJI   = KANA.map((row) => row[CharacterSet.Romaji]) as string[];\n";
output += "export const HIRAGANA = KANA.map((row) => row[CharacterSet.Hiragana]) as string[];\n";
output += "export const KATAKANA = KANA.map((row) => row[CharacterSet.Katakana]) as string[];\n";

console.log(output);
