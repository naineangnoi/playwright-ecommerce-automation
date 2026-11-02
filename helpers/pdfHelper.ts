

import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import * as fs from 'node:fs/promises';
import { expect } from '@playwright/test';

export async function extractPdfText(filePath: string): Promise<string> {
    const pdfBuffer = await fs.readFile(filePath);

    const pdf = await getDocument({
        data: new Uint8Array(pdfBuffer),
        useSystemFonts: true,
        disableFontFace: true
    }).promise;

    const pages: string[] = [];

    try {
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            const content = await page.getTextContent();

            const pageText = content.items
                .filter(item => 'str' in item)
                .map(item => item.str)
                .join(' ');

            pages.push(pageText);
        }

        return pages.join('\n');
    } finally {
        await pdf.cleanup();
    }
}

export function expectPdfAmount(
    pdfText: string,
    label: string,
    amount: string
) {
    const escapedAmount = amount.replace('.', '\\.');

    const pattern = new RegExp(
        `\\b${label}\\s*:?\\s*\\$${escapedAmount}(?!\\d)`
    );

    expect(pdfText).toMatch(pattern);
}

export function extractOrderDate(pdfText: string): string {
    const match = pdfText.match(
        /Order Date\s+([A-Za-z]+ \d{1,2}, \d{4})/
    );

    if (!match) {
        throw new Error('Order Date not found in PDF');
    }

    return match[1];
}
