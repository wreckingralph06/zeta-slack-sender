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

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'border-color 0.3s',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '50px auto',
        padding: 30,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
        Scheduled Slack Message Sender
      </h2>

      <label style={labelStyle}>Candidate Name:</label>
      <div style={{ display: 'flex', marginBottom: 15, gap: '10px'}}>
        <input
          type="text"
          value={candidateName}
          onChange={e => setCandidateName(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          placeholder="Enter your name"
        />
      </div>

      <label style={labelStyle}>Delay:</label>
      <div style={{ display: 'flex', marginBottom: 15, gap: '10px'}}>
        <input
          type="number"
          min="0"
          value={delayAmount}
          onChange={e => setDelayAmount(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          placeholder="0"
        />
        <select
          value={delayUnit}
          onChange={e => setDelayUnit(e.target.value)}
          style={{
            ...inputStyle,
            marginBottom: 0,
            flex: 1,
            cursor: 'pointer',
            appearance: 'none',
          }}
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <label style={labelStyle}>Slack Message:</label>
      <div style={{ display: 'flex', marginBottom: 15, gap: '10px'}}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={inputStyle}
          placeholder="Type your message here"
        />
      </div>

      <label style={labelStyle}>Slack Webhook URL:</label>
      <div style={{ display: 'flex', marginBottom: 15, gap: '10px'}}>
        <input
          type="text"
          value={webhookUrl}
          onChange={e => setWebhookUrl(e.target.value)}
          style={inputStyle}
          placeholder="https://hooks.slack.com/..."
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!isFormValid || isSending}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isFormValid ? '#007bff' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.3s',
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default DelayedSlackSender;