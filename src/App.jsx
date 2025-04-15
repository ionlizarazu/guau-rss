import { useState } from 'react';
import './App.css';
import rss from './assets/rss.json';

function App() {
  const [searched, setSearched] = useState('');

  return (
    <>
      <h1>GUAU RSS zerrenda</h1>
      <input
        type="text"
        value={searched}
        onChange={(e) => setSearched(e.target.value)}
      />
      <div className="series">
        {Object.entries(rss)
          .filter(
            ([key, data]) =>
              data.title?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.media_title?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.description?.match(new RegExp(`.*${searched}.*`, 'gi')) ||
              data.media_desc?.match(new RegExp(`.*${searched}.*`, 'gi')),
          )
          .map(([key, data]) => (
            <div className="card" key={key}>
              <img
                loading="lazy"
                src={data.img}
                alt={`${data.title ?? data.media_title} - ${data.media_type}`}
              />
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
