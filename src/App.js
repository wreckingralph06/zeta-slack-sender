import React, { useState, useEffect } from 'react';

const DelayedSlackSender = () => {
  const [candidateName, setCandidateName] = useState('');
  const [delayAmount, setDelayAmount] = useState('');
  const [delayUnit, setDelayUnit] = useState('seconds');
  const [message, setMessage] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [buttonText, setButtonText] = useState('Send');
  const [isSending, setIsSending] = useState(false);

  const getDelayInMs = () => {
    const amount = parseInt(delayAmount, 10);
    if (isNaN(amount)) return 0;
    switch (delayUnit) {
      case 'seconds': return amount * 1000;
      case 'minutes': return amount * 60 * 1000;
      case 'hours': return amount * 60 * 60 * 1000;
      default: return 0;
    }
  };

  useEffect(() => {
    if (!delayAmount) {
      setButtonText('Send');
    } else {
      setButtonText(`Send in ${delayAmount} ${delayUnit}`);
    }
  }, [delayAmount, delayUnit]);

  const isFormValid = candidateName && delayAmount && message && webhookUrl;

  const handleSend = () => {
    setIsSending(true);
    const delay = getDelayInMs();

    setTimeout(() => {
      fetch('/api/sendSlack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl,
          message,
          sender: candidateName,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Slack message failed to send.');
          }
          alert('Message sent!');
        })
        .catch(err => {
          alert(`Error: ${err.message}`);
        })
        .finally(() => {
          setIsSending(false);
        });
    }, delay);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Delayed Slack Message Sender</h2>

      <label>Candidate Name:</label>
      <input
        type="text"
        value={candidateName}
        onChange={e => setCandidateName(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <label>Delay:</label>
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <input
          type="number"
          min="0"
          value={delayAmount}
          onChange={e => setDelayAmount(e.target.value)}
          style={{ flex: 1 }}
        />
        <select value={delayUnit} onChange={e => setDelayUnit(e.target.value)}>
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <label>Slack Message:</label>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <label>Slack Webhook URL:</label>
      <input
        type="text"
        value={webhookUrl}
        onChange={e => setWebhookUrl(e.target.value)}
        style={{ width: '100%', marginBottom: 20 }}
      />

      <button
        onClick={handleSend}
        disabled={!isFormValid || isSending}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: isFormValid ? '#007bff' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default DelayedSlackSender;