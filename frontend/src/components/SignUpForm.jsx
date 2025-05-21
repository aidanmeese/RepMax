import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpForm.css"; // Ensure this file exists for custom styling
import { signUpUser } from "../utils/api.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeLowVision } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";


const SignUpForm = () => {
    const [strength, setStrength] = useState(0);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e) => {
        console.log("Form submitted");

        e.preventDefault();
        if (strength < 4) {
            setError("Password is not strong enough.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
        } else {
            setError(null);
        }

        const { success, error } = await signUpUser( formData.username, formData.password );

        if (success) {
            navigate("/");
        } else if (error) {
            setError(error);
        } else {
            setError("Error creating account. Please try again.");
        }
    };

    useEffect(() => {
        const checkStrength = () => {
        const password = formData.password;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        setStrength(score);
        };

        checkStrength();
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Register</h2>
            <div className="form-subtitle">
                <span>Already have an account? </span>
                <Link to="/login" className="link">Log in</Link>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
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
            <div className="password-input-container">
                <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    required
                    placeholder="Password"
                />
                <button
                    type="button"
                    className="password-toggle-button"
                    onClick={togglePasswordVisibility}
                >
                {passwordVisible ? (
                    <FontAwesomeIcon icon={faEyeLowVision} />
                ) : (
                    <FontAwesomeIcon icon={faEye} />
                )}
                </button>
            </div>
            </div>

            <div className="input-container">
            <label>Confirm Password</label>
            <input
                type={passwordVisible ? "text" : "password"}
                name="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
                placeholder="Confirm Password"
            />

            <div className="guideline-container">
                <p className="guideline">
                    At least 1 letter, a number, a symbol, at least 8 characters
                </p>
            </div>

            <div className="strength-bar">
                <div className={`strength-indicator strength-${strength}`} />
            </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="create-account-button">
                Create Account
            </button>
        </form>
        </div>
    );
};

export default SignUpForm;
