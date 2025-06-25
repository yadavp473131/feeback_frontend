import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      // When username changes, update both username and email

      setFormData((prev) => ({
        ...prev,
        username: value,
        email: value,
      }
      ));
    } else {
      // For password or other fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // console.log(formData);
  };

  const handleLogin = async () => {

    try {
      const response = await axios.post("http://localhost:8000/api/signin/", formData);
      setMessage("Login successful!");

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user_role', response.data.role);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('name', response.data.name);

      // Optional: Set axios headers for future requests
      // axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    } catch (error) {
      setMessage("Signin failed. Please try again.");
      console.error("Error submitting form:", error);
    }
    if (localStorage.getItem("user_role") === "employee") {
      navigate("/dashboard/employee");
    } else {
      navigate("/dashboard/manager");
    }

  };

  return (
    <div className="home-background d-flex align-items-center justify-content-center vh-100">
      <div className="bg-white p-4 rounded shadow" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
        <div className="container mt-5">
          <div className="card p-4 mx-auto" style={{ maxWidth: "400px", width: "100%" }}>

            <h1 className="text-center mb-3">Login</h1>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="form-control mb-2"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control mb-2"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              Login
            </button>
            {message && <p className="text-center mt-3 text-danger">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
