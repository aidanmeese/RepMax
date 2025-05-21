import LoginForm from "../components/LoginForm";
import "../styles/SignUp.css";

export default function Login() {
  return (
    <div className="signup-container">
      <div className="account-creation-form">
        <LoginForm />
      </div>
    </div>
  );
}
