import React, { useState } from 'react';
import axios from 'axios';

function ChatGPT() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const askQuestion = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/ask`, { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error interacting with ChatGPT', error);
    }
  };

  return (
    <div>
      <h1>Ask ChatGPT</h1>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
      />
      <button onClick={askQuestion}>Ask</button>
      <div>
        <h2>Answer:</h2>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default ChatGPT;
