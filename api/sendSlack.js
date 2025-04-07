const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { webhookUrl, message, sender } = req.body;
    console.log("req.body: ", req.body);
    

    // Check for missing fields
    if (!webhookUrl || !message || !sender) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Prepare the Slack message with the required prefix
    const slackMessage = `From ${sender}'s Slack Bot: ${message}`;
    console.log("slackMessage: ", slackMessage);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: slackMessage,
        }),
      });
      console.log("response: ", response);

      if (!response.ok) {
        // Slack returned an error
        const errorDetails = await response.text();
        return res.status(500).json({ error: 'Slack API Error: ' + errorDetails });
      }

      return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
      // General error (e.g., network issues)
      return res.status(500).json({ error: 'Error sending message: ' + error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};