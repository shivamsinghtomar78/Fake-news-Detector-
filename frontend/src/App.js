import React, { useState } from 'react';
import './App.css';

function App() {
  const [newsData, setNewsData] = useState({
    author: '',
    title: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewsData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newsData.author.trim() || !newsData.title.trim()) {
      setError('Please fill in both fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: `${newsData.author} ${newsData.title}` }),
      });
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      setError('Failed to connect to the server');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNewsData({ author: '', title: '' });
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <div className="scene">
        <div className="container">
          <header className="App-header parallax" data-speed="0.5" data-z="50px">
            <h1>Fake News Detection</h1>
            <p className="subtitle">AI-powered news authenticity analyzer</p>
          </header>

          <main className="main-content">
            <div className="input-section parallax" data-speed="0.3" data-z="100px">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newsData.author}
                    onChange={handleChange}
                    placeholder="Enter author name..."
                    className={error && !newsData.author.trim() ? 'error' : ''}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="title">News Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newsData.title}
                    onChange={handleChange}
                    placeholder="Enter news title..."
                    className={error && !newsData.title.trim() ? 'error' : ''}
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="button-group">
                  <button type="submit" disabled={loading} className="primary-button">
                    {loading ? (
                      <span className="loading-spinner">
                        <span className="spinner"></span>
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze News'
                    )}
                  </button>
                  {result && (
                    <button type="button" onClick={handleReset} className="secondary-button">
                      Reset
                    </button>
                  )}
                </div>
              </form>
            </div>

            {result && (
              <div className="result-section parallax" data-speed="0.4" data-z="150px">
                <div className="result-details">
                  <h2 className={`result-text ${result.toLowerCase()}`}>
                    {result}
                  </h2>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
