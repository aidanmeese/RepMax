import React, { useState } from 'react';
import '../styles/Root.css'; // Import the CSS file

const repMaxFormulas = (weight, reps) => {
  // Epley formula for estimating rep maxes
  const oneRepMax = weight * (1 + reps / 30);
  const repMaxes = {};
  for (let r = 1; r <= 20; r++) {
    repMaxes[r] = Math.round(oneRepMax / (1 + r / 30));
  }
  return repMaxes;
};

const RepMaxCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || !r || r < 1 || r > 20) {
      alert('Enter a valid weight and reps between 1 and 20.');
      return;
    }
    const calculated = repMaxFormulas(w, r);
    setResults(calculated);
  };

  return (
    <div className="root-container">
      <h2 className="title">RepMax Calculator</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Weight</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Reps (1-20)</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            max="20"
            required
          />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Calculate</button>
      </form>

      {results && (
        <div className="results">
          <h3>Estimated Maxes</h3>
          <ul>
            {Object.entries(results).map(([rep, maxWeight]) => (
              <li key={rep}>
                {rep} Rep Max: <strong>{maxWeight} {unit}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepMaxCalculator;
