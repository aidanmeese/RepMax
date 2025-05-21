import { useState } from "react";
import "../styles/SignUpForm.css";
import { loginUser } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });
    };

    async function submitForm(e) {
        e.preventDefault();
        const { success, error } = await loginUser(formData.username, formData.password);

        console.log(success, error);

        if (success) {
            navigate("/");
        } else if (error) {
            setError(error);
        } else {
            setError("Error logging in. Please try again.");
        }

        setFormData({ username: "", password: "" });
    }

    return (
        <div className="form-container">
        <h2 className="form-title">Log in to your account</h2>
            <div className="form-subtitle">
                <span>Don't have an account? </span>
                <Link to="/signup" className="link">Sign Up</Link>
            </div>
        <form onSubmit={submitForm}>
            <div className="input-container">
            <label>Username</label>
                        <input
                type="text"
                name="username"
                onChange={handleChange}
                value={formData.username}
                required
                placeholder="Username"
            />
            </div>

            <div className="input-container">
            <label>Password</label>
            <input
                name="password"
                type="password"
                onChange={handleChange}
                value={formData.password}
                required
                placeholder="Password"
            />
            </div>

            <button type="submit" className="create-account-button">
            Login
            </button>
        </form>
        </div>
    );
};

export default LoginForm;
