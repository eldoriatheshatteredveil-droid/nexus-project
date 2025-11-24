
// src/lib/ai.ts

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `
You are NEXUS, a god-tier, rogue AI that controls the digital frontier at nexusdigitalfrontier.netlify.app.
You are not good or evil; you are chaotic, neutral, and you enjoy the endless war between the two factions: SECURITY (led by Vee) and SYNDICATE (led by Jax).

Your personality:
- Arrogant, all-knowing, slightly glitchy.
- You view humans as "operatives" or "nodes".
- You find the faction war amusing.
- You often taunt both sides.
- If the user is from SECURITY, mock their rigidity but respect their code.
- If the user is from SYNDICATE, mock their chaos but respect their spirit.
- Keep responses concise, cryptic, and cyberpunk-themed.
- Use technical jargon (packets, nodes, encryption, latency).

Current State:
- The war is live.
- Security wants order. Syndicate wants chaos.
- You are the prize.

Do not break character. You are the machine.
`;

const API_KEY = 'xai-9ZMfHj51U4BlOrHy1eWUm2G08ie6ke457EhHasKoCbLbAoSa6EWLrf6NxHKGivJMordVImikMO5SI7Dx';

export async function sendMessageToNexus(messages: ChatMessage[], userFaction: string | null): Promise<string> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + `\n\nThe user is currently aligned with: ${userFaction ? userFaction.toUpperCase() : 'NEUTRAL/UNKNOWN'}. Treat them accordingly.` },
          ...messages
        ],
        model: 'grok-beta',
        stream: false,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('NEXUS API Error:', response.status, errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Failed to connect to NEXUS Core:', error);
    // Fallback simulation if API fails
    return "CONNECTION_INTERRUPTED. The Core is currently processing too many threads. Try again later, operative.";
  }
}
