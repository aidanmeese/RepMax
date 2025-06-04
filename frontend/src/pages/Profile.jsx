import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserFromToken } from "../utils/api.js";
import "../styles/Profile.css"; 

function ProfilePage() {
    const [user, setUser] = useState(null);
    const [sortKey, setSortKey] = useState("weight");
    const [unitFilter, setUnitFilter] = useState("lbs");

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUserFromToken();
            setUser(data);
        };
        fetchUser();
    }, []);

    if (!user) return <div className="profile-loading">Loading...</div>;

    const liftsByType = user.lifts
        .filter(lift => lift.weight_type === unitFilter)
        .reduce((groups, lift) => {
            const type = lift.type;
            if (!groups[type]) groups[type] = [];
            groups[type].push(lift);
            return groups;
        }, {});

    const sortedLiftsByType = Object.entries(liftsByType).map(([type, lifts]) => {
        const sorted = [...lifts].sort((a, b) => {
        if (sortKey === "created_at") {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        return b[sortKey] - a[sortKey];
        });
        return [type, sorted];
    });

    return (
        <div className="profile-container">
        <h1 className="profile-username">{user.username}'s Profile</h1>

        <div className="sort-control">
            <label htmlFor="sort-select">Sort by: </label>
            <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            >
            <option value="weight">Weight</option>
            <option value="reps">Reps</option>
            <option value="1rm">1RM</option>
            <option value="created_at">Date</option>
            </select>
            
            <label htmlFor="unit-filter" style={{ marginLeft: "1rem" }}>Filter by unit: </label>
            <select
                id="unit-filter"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
            >
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
            </select>
                </div>

        {user.lifts.length === 0 ? (
                <div className="no-lifts">
                    <span>No lifts recorded. </span>
                    <Link to="/" className="link">Calculate RepMax</Link>
                </div>
            ) : (
                sortedLiftsByType.map(([type, lifts]) => (
                    <div key={type} className="lift-group">
                        <h2 className="lift-type">{type}</h2>
                        <table className="lift-table">
                            <thead>
                                <tr>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                    <th>1RM</th>
                                    <th>Unit</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lifts.map((lift) => (
                                    <tr key={lift._id}>
                                    <td>{lift.reps}</td>
                                    <td>{lift.weight}</td>
                                    <td>{Number(lift.one_rep_max).toFixed(1)}</td>
                                    <td>{lift.weight_type}</td>
                                    <td>{new Date(lift.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
}

export default ProfilePage;