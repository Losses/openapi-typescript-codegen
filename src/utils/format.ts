import { EOL } from 'os';

import prettier from 'prettier/standalone';
import parserTypeScript from "prettier/parser-typescript";

export function format(s: string): string {
    return prettier.format(s, {
        parser: "typescript",
        plugins: [parserTypeScript],
    }) + EOL;
}
