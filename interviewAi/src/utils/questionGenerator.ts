import OpenAI from "openai";

export interface Question {
  text: string;
  level: 'Easy' | 'Medium' | 'Hard';
  time: number;
}

export interface EvaluationResult {
  score: number;
  summary: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export const generateQuestions = async (): Promise<Question[]> => {
  const prompt = `Generate exactly 6 technical interview questions about React and Node.js (full-stack development). The questions should be clear and have definitive technical answers.

Requirements:
- Mix of React and Node.js questions
- 2 Easy questions (20 seconds each) - fundamental concepts
- 2 Medium questions (60 seconds each) - practical application
- 2 Hard questions (120 seconds each) - advanced concepts and problem-solving

Return ONLY a valid JSON array in this exact format, with no additional text:
[
  {"text": "question here", "level": "Easy", "time": 20},
  {"text": "question here", "level": "Easy", "time": 20},
  {"text": "question here", "level": "Medium", "time": 60},
  {"text": "question here", "level": "Medium", "time": 60},
  {"text": "question here", "level": "Hard", "time": 120},
  {"text": "question here", "level": "Hard", "time": 120}
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer specializing in React and Node.js. Generate questions in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No response from OpenAI');
    }

    const questions = JSON.parse(content);
    
    if (!Array.isArray(questions) || questions.length !== 6) {
      throw new Error('Invalid questions format');
    }

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};

export const evaluateInterview = async (
  questions: Question[],
  answers: string[]
): Promise<EvaluationResult> => {
  const qaList = questions.map((q, i) => ({
    question: q.text,
    level: q.level,
    answer: answers[i] || 'No answer provided'
  }));

  const prompt = `Evaluate the following technical interview performance on React and Node.js.

Interview Details:
${qaList.map((qa, i) => `
Question ${i + 1} (${qa.level}): ${qa.question}
Candidate's Answer: ${qa.answer}
`).join('\n')}

Instructions for Evaluation:
1.  **If the answers are nonsensical, incomplete, or unrelated**, the score should be very low (e.g., 0-10).
2.  Assess the candidate's answers based on **technical accuracy, depth, and clarity**.
3.  Provide a score from 0-100.
4.  Write a brief, honest summary (2-3 sentences) highlighting strengths and areas for improvement.

Return a valid JSON object with the following format, with no other text:
{"score": number, "summary": "string"}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a technical interviewer evaluating React and Node.js candidates. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('No evaluation response');
    }

    const evaluation = JSON.parse(content);

    // Validate the parsed object to ensure it has the correct properties
    if (typeof evaluation.score !== 'number' || typeof evaluation.summary !== 'string') {
        throw new Error('Invalid evaluation format from OpenAI');
    }

    return {
      score: evaluation.score,
      summary: evaluation.summary
    };
  } catch (error) {
    console.error('Error evaluating interview:', error);
    // Be transparent about the failure
    return {
      score: 0,
      summary: 'Evaluation failed due to an error. Please try again with valid answers.'
    };
  }
};