import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ManagerView() {
const [team, setTeam] = useState([]);
const [error, setError] = useState("");

const navigate = useNavigate();


useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/team-members/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTeam(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch team members.");
      }
    };
    fetchTeam();
  }, []);

const handleMemberClick = (id) => {
    navigate(`/manager/team/${id}`);
  };

  return (
     <>
  
    <div className="container mt-5">

  {/* Team Section */}
  <div>
    <h3 className="mb-4 text-center text-success border-bottom pb-2">My Team</h3>
    <div className="row">
      {team
        .filter((member) => member.role === "employee")
        .map((member) => (
          <div className="col-md-6 col-lg-4 mb-4" key={member.employeeId}>
            <div
              className="card shadow-sm h-100 border-0 rounded-4 hover-shadow"
              onClick={() => handleMemberClick(member.employeeId)}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
            >
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold">{member.name}</h5>
                <p className="text-muted mb-1">
                  <strong>Email:</strong> {member.email}
                </p>
                <p className="text-muted mb-1">
                  <strong>Employee ID:</strong> {member.employeeId}
                </p>
                <p className="text-muted mb-0">
                  <strong>Team ID:</strong> {member.teamId}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>


    </>
  );
}
