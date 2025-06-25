import { useNavigate } from "react-router-dom";
import './style.css' ;
export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="home-background d-flex align-items-center justify-content-center vh-100">
      <div className="bg-white p-4 rounded shadow" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
        <div className="container d-flex flex-column align-items-center justify-content-center vh-50">
          <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
            <h2 className="text-center mb-4">Welcome</h2>
            <button
              className="btn btn-primary mb-3 w-100"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}