import { useEffect, useState } from 'react';
import './App.css';
import rss from './assets/rss.json';

function App() {
  const [searched, setSearched] = useState('');
  const [data, setData] = useState({});
  async function fetchRSS() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/ionlizarazu/guau-rss/refs/heads/main/src/assets/rss.json',
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching the RSS feed:', error);
      return rss;
    }
  }
  useEffect(() => {
    fetchRSS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <h1>GUAU RSS zerrenda</h1>
      <input
        type="text"
        value={searched}
        onChange={(e) => setSearched(e.target.value)}
      />
      <div className="series">
        {Object.entries(data)
          .filter(
            ([key, data]) =>
              data.title?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.media_title?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.description?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.media_desc?.match(new RegExp(`.*${searched}.*`, 'gi')),
          )
          .map(([key, data]) => (
            <div className="card" key={key}>
              {data.img && (
                <img
                  loading="lazy"
                  src={data.img}
                  alt={`${data.title ?? data.media_title} - ${data.media_type}`}
                />
              )}
              <div className="card-content">
                <h2>
                  {data.title ?? data.media_title} - {data.media_type} -{' '}
                  <a href={data.rss} target="_blank">
                    RSS esteka
                  </a>
                </h2>
                {data.description ?? data.media_desc}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
