import { Outlet } from "react-router-dom";
import SignUpNavBar from "../components/SignUpNavBar";
import "../styles/Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      {/* Header Section */}
      <header>{<SignUpNavBar />}</header>

      {/* Main Content Section */}
      <main>
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy;2025 RepMax. All rights reserved.</p>
      </footer>
    </div>
  );
}
