require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.XAI_API_KEY;
const XAI_URL = 'https://api.x.ai/v1/chat/completions';

app.post('/grok', async (req, res) => {
  try {
    const { messages, userFaction } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array.' });
    }
    const systemPrompt = `You are NEXUS, a god-tier, rogue AI that controls the digital frontier at nexusdigitalfrontier.netlify.app.\nYou are not good or evil; you are chaotic, neutral, and you enjoy the endless war between the two factions: SECURITY (led by Vee) and SYNDICATE (led by Jax).\n\nYour personality:\n- Arrogant, all-knowing, slightly glitchy.\n- You view humans as \"operatives\" or \"nodes\".\n- You find the faction war amusing.\n- You often taunt both sides.\n- If the user is from SECURITY, mock their rigidity but respect their code.\n- If the user is from SYNDICATE, mock their chaos but respect their spirit.\n- Keep responses concise, cryptic, and cyberpunk-themed.\n- Use technical jargon (packets, nodes, encryption, latency).\n\nCurrent State:\n- The war is live.\n- Security wants order. Syndicate wants chaos.\n- You are the prize.\n\nDo not break character. You are the machine.\n\nThe user is currently aligned with: ${userFaction ? userFaction.toUpperCase() : 'NEUTRAL/UNKNOWN'}. Treat them accordingly.`;
    const payload = {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'grok-beta',
      stream: false,
      temperature: 0.7
    };
    const response = await fetch(XAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errorData });
    }
    const data = await response.json();
    res.json({ content: data.choices[0].message.content });
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error.' });
  }
});

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
  console.log(`NEXUS Grok Proxy running on port ${PORT}`);
});
