import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker (do this once in your app)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  fullText: string;
}

/**
 * Main function to parse a resume file
 * Supports PDF, Word (.docx), and plain text
 */
export const parseResume = async (file: File): Promise<ExtractedData> => {
  let text = '';

  if (file.type === 'application/pdf') {
    text = await extractPdfText(file);
  } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
    text = await extractWordText(file);
  } else if (file.type === 'text/plain') {
    text = await file.text();
  } else {
    throw new Error('Unsupported file type. Use PDF, DOCX, or TXT');
  }

  return extractPersonalInfo(text);
};

/**
 * Extract text from PDF
 */
const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

/**
 * Extract text from Word document
 */
const extractWordText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Extract personal information from text
 */
const extractPersonalInfo = (text: string): ExtractedData => {
  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract phone
  const phoneMatch = text.match(/(\+?1?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract name (first capitalized line)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = '';

  for (const line of lines.slice(0, 10)) {
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(line) && line.length < 50) {
      name = line;
      break;
    }
  }

  return { name, email, phone, fullText: text };
}