import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  fullText: string;
}


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
    // Pattern for Indian names:
    // - Single names (Ramesh, Priya)
    // - Multiple parts (Amit Kumar Singh, Priya Sharma)
    // - Names with periods (S. Ramesh, A.K. Singh)
    // - Mixed case (like surnames: KumarRao)
    const namePattern = /^[A-Z][A-Za-z\.]*(\s+[A-Z][A-Za-z\.]*){0,4}$/;
    
    if (namePattern.test(line) && 
        line.length >= 2 && 
        line.length < 50 &&
        !line.includes('@') && // Exclude emails
        !/\d/.test(line) && // Exclude any digits
        !/^[A-Z\s\.]+$/.test(line)) { // Exclude all caps (likely headers)
      name = line;
      break;
    }
  }

  return { name, email, phone, fullText: text };
}