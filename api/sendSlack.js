import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { webhookUrl, message, sender } = req.body;

  if (!webhookUrl || !message || !sender) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const slackMessage = `From ${sender}'s Slack Bot: ${message}`;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: slackMessage }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: `Slack API Error: ${text}` });
    }

    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    return res.status(500).json({ error: `Error sending message: ${error.message}` });
  }
}