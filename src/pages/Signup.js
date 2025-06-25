import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name:"",
    username: "",
    email: "",
    password: "",
    role: "employee",
    employeeId: "",
    managerId: "",
    teamId:"",
  });

const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", formData);
      setMessage("Signup successful!");
      console.log("Server response:", response.data);
      navigate("/login")
    } catch (error) {
      setMessage("Signup failed. Please try again.");
      console.error("Error submitting form:", error);
    }
  };


  return (
    <div className="home-background d-flex align-items-center justify-content-center vh-100">
      <div className="bg-white p-4 rounded shadow" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Signup</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Create Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            {formData.role === "employee" && (
              
              <div className="mb-3">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
              
            )}

            {formData.role === "manager" && (
              <div className="mb-3">
                <label className="form-label">Manager ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Team ID</label>
              <input
                type="text"
                className="form-control"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
