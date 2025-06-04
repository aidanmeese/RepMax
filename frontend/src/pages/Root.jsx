import { useState } from 'react';
import { createLift } from '../utils/api.js'; // Import the API function
import { useIsLoggedIn } from '../utils/hooks.js';
import '../styles/Root.css'; // Import the CSS file

const repMaxFormulas = (weight, reps, formula) => {
  const repMaxes = {};
  let oneRepMax = 0;

  // Formulas for estimating rep maxes
  if (formula == "epley") {
    oneRepMax = weight * (1 + reps / 30);
    for (let r = 1; r <= 16; r++) {
      repMaxes[r] = oneRepMax / (1 + r / 30);
    }
  } else if (formula == "brzycki") {
    oneRepMax = weight / (1.0278 - 0.0278 * reps);
    for (let r = 1; r <= 16; r++) {
      repMaxes[r] = oneRepMax * (37 - r) / 36;
    }
  } else if (formula == "lombardi") {
    oneRepMax = weight * Math.pow(reps, 0.10);
    for (let r = 1; r <= 16; r++) {
      repMaxes[r] = oneRepMax / Math.pow(r, 0.10);
    }
  } else if (formula == "oConnor") {
    oneRepMax = weight * (1 + 0.025 * reps);
    for (let r = 1; r <= 16; r++) {
      repMaxes[r] = oneRepMax / (1 + 0.025 * r);
    }
  } else if (formula == "wathan") {
    oneRepMax = (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
    for (let r = 1; r <= 16; r++) {
      repMaxes[r] = (oneRepMax * (48.8 + 53.8 * Math.exp(-0.075 * r))) / 100;
    }
  }
  return repMaxes;
};

const RepMaxCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [type, setType] = useState('Other');
  const [formula, setFormula] = useState('epley');
  const [results, setResults] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const isLoggedIn = useIsLoggedIn();

  const handleSubmit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || !r || r < 1 || r > 20) {
      alert('Enter a valid weight and reps between 1 and 20.');
      return;
    }

    // set saved to false to reset the save state
    setSaved(false);
    setSaveMessage('');

    const calculated = repMaxFormulas(w, r, formula);
    setResults(calculated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (!w || !r || r < 1 || r > 20) {
      setSaveMessage('Enter a valid weight and reps between 1 and 20.');
      return;
    }
    if (!isLoggedIn) {
      alert('You must be logged in to save a lift.');
      return;
    }

    console.log('Saving lift:', {
      type: type,
      reps: r,
      weight: w,
      weight_type: unit,
    });
    // Call the API to save the lift
    const apiResponse = await createLift(
      type,
      r,
      w,
      unit,
    );

    setSaved(!!apiResponse);
    setSaveMessage(apiResponse ? 'Lift saved successfully!' : 'Error saving lift.');
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
          <label>Reps (1-16)</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            max="16"
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
        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Bench Press">Bench Press</option>
            <option value="Squat">Squat</option>
            <option value="Deadlift">Deadlift</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Formula</label>
          <select value={formula} onChange={(e) => setFormula(e.target.value)}>
            <option value="epley">Epley (Default)</option>
            <option value="brzycki">Brzycki</option>
            <option value="wathan">Wathan</option>
            <option value="oConnor">O'Connor</option>
            <option value="lombardi">Lombardi</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Calculate</button>
      </form>
      

      {results && (
        <div className="results">
          <div className="header-container">
            <h3>Estimated Maxes</h3>
            <button 
              type="button" 
              className="save-button" 
              onClick={handleSave}
              disabled={saved || !isLoggedIn}
              title={!isLoggedIn ? "You must be logged in to save lifts." : ""}
            > Save Lift </button>
          </div>
          {saveMessage && (
          <div className={saved ? "success-message" : "error-message"}>
            {saveMessage}
          </div>
      )}
          <ul>
            {Object.entries(results).map(([rep, maxWeight]) => (
              <li key={rep}>
                <div className="rep-label">{rep} Rep(s)</div>
                <strong className="weight">{Number(maxWeight).toFixed(1)} {unit}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepMaxCalculator;