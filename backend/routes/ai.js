const express = require('express');
const requireAuth = require('../middleware/auth');

const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/assist', requireAuth, async (req, res) => {
  const { prompt, context = '', mode = 'ideas' } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  }

  const modeGuide = {
    ideas: 'Give concise, practical brainstorming ideas for writing.',
    rewrite: 'Rewrite the provided text for clarity, tone, and flow while preserving meaning.',
    continue: 'Continue the writing in the same voice and style.',
  };

  try {
    const completionResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content:
              'You are Ink AI, a writing assistant inside a document editor. Keep responses actionable and easy to apply.' +
              ` ${modeGuide[mode] || modeGuide.ideas}`,
          },
          {
            role: 'user',
            content: `User request:\n${prompt}\n\nDocument context (optional):\n${context || 'No context provided.'}`,
          },
        ],
      }),
    });

    const data = await completionResponse.json().catch(() => null);

    if (!completionResponse.ok) {
      const error =
        data?.error?.message || data?.error || 'AI provider request failed. Please try again.';
      return res.status(502).json({ error });
    }

    const suggestion = data?.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      return res.status(502).json({ error: 'Empty AI response. Please try again.' });
    }

    return res.json({ suggestion });
  } catch (error) {
    console.error('AI assist error:', error);
    return res.status(500).json({ error: 'Unable to generate AI response right now.' });
  }
});

module.exports = router;
