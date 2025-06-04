import React, { useEffect, useState } from "react";
import "../styles/Leaderboard.css"; // Style this to match your app
import { leaderboard } from "../utils/api"; // Adjust path to your actual API utility

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [weightType, setWeightType] = useState("lbs");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await leaderboard(weightType);
      setLeaderboardData(data || {});
      setLoading(false);
    };

    fetchData();
  }, [weightType]);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Top Lifts Leaderboard</h2>

      <div className="weight-type-toggle">
        <label>Weight Type: </label>
        <select
          value={weightType}
          onChange={(e) => setWeightType(e.target.value)}
        >
          <option value="lbs">Pounds (lbs)</option>
          <option value="kg">Kilograms (kg)</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Loading leaderboard...</p>
      ) : (
        Object.entries(leaderboardData).map(([liftType, lifts]) => (
          <div className="lift-section" key={liftType}>
            <h3 className="lift-type-title">{liftType}</h3>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>1RM</th>
                </tr>
              </thead>
              <tbody>
                {lifts.map((lift, index) => (
                  <tr key={lift._id}>
                    <td>{index + 1}</td>
                    <td>{lift.username}</td>
                    <td>{lift.reps}</td>
                    <td>
                      {lift.weight} {lift.weight_type}
                    </td>
                    <td>
                      {Number(lift.one_rep_max).toFixed(1)} {lift.weight_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Leaderboard;
