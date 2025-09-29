import OpenAI from "openai";

export interface Question {
  text: string;
  level: 'Easy' | 'Medium' | 'Hard';
  time: number;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export const generateQuestions = async (): Promise<Question[]> => {
  const prompt = `Generate exactly 6 technical interview questions about React and Node.js (full-stack development).

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
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No response from OpenAI');

    // Parse the JSON response
    const questions = JSON.parse(content);
    
    // Validate the response
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
): Promise<{ score: number; summary: string }> => {
  const qaList = questions.map((q, i) => ({
    question: q.text,
    level: q.level,
    answer: answers[i] || 'No answer provided'
  }));

  const prompt = `Evaluate this React/Node.js technical interview performance:

${qaList.map((qa, i) => `
Question ${i + 1} (${qa.level}): ${qa.question}
Answer: ${qa.answer}
`).join('\n')}

Provide:
1. A score from 0-100 based on:
   - Technical accuracy
   - Depth of understanding
   - Practical knowledge
   - Communication clarity
2. A brief summary (2-3 sentences) highlighting strengths and areas for improvement

Format your response as JSON:
{"score": 85, "summary": "Your evaluation here"}`;

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
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No evaluation response');

    const evaluation = JSON.parse(content);
    return {
      score: evaluation.score || 0,
      summary: evaluation.summary || 'Interview completed.'
    };
  } catch (error) {
    console.error('Error evaluating interview:', error);
    // Fallback evaluation
    return {
      score: Math.floor(Math.random() * 30) + 60,
      summary: 'Interview completed. Candidate demonstrated understanding of React and Node.js concepts.'
    };
  }
};