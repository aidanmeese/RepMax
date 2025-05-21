import SignUpForm from "../components/SignUpForm";
import "../styles/SignUp.css";

export default function SignUp() {
  return (
    <div className="signup-container">
      <div className="account-creation-form">
        <SignUpForm />
      </div>
    </div>
  );
}
