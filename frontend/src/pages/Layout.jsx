import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      {/* Header Section */}
      <header>{<NavBar />}</header>

      {/* Main Content Section */}
      <main>
        <Outlet />
      </main>

    </div>
  );
}
