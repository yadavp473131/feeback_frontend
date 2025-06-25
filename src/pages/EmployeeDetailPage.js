import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EmployeeDetailPage = () => {
  const { id } = useParams(); // employee ID
  const [reports, setReports] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [comment, setComment] = useState("");
  const [sentiment, setSentiment] = useState("");
  // const [selectedEmployeeId, setSelectedEmployeeId] = useState(id);
const [editFeedbackId, setEditFeedbackId] = useState(null);
const [editComment, setEditComment] = useState('');
const [editSentiment, setEditSentiment] = useState('');

  const navigate = useNavigate();


  useEffect(() => {

    axios.get(`http://localhost:8000/api/manager/employee/${id}/reports/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(res => {
      // Extract and set employee info and reports
      const { employee, reports } = res.data;
      setEmployeeInfo(employee);     // optional but useful
      setReports(reports);          // main usage

    }).catch(err => console.error(err));

    axios.get(`http://localhost:8000/api/manager/employee/${id}/feedbacks/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
      }
    }).then(res => setFeedbacks(res.data)).catch(err => console.error(err));
  }, [id]);

  const handleUpdateFeedback = async (id) => {
  try {
    await axios.put(`http://localhost:8000/api/manager/feedback/${id}/`, {
      comment: editComment,
      sentiment: editSentiment,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    // Refresh or update local state
    const updated = feedbacks.map(fb => fb.id === id ? { ...fb, comment: editComment, sentiment: editSentiment } : fb);
    setFeedbacks(updated);
    setEditFeedbackId(null);
  } catch (error) {
    console.error("Error updating feedback:", error);
  }
};


  const submitFeedback = async (reportId) => {

    // const reportId = "RPT-5929BF85";
    const payload = {
      employee_id: id,
      report_id: reportId,
      comment,
      sentiment,
    };

    await axios.post("http://localhost:8000/api/manager/feedback/", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then(res => setFeedbacks([...feedbacks, res.data]));
    setComment("");
    setSentiment("");
    // alert("Feedback submitted");
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // returns "6/22/2025, 2:15:30 PM"
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleGoToEmployeeList = () => {
    navigate("/dashboard/manager");
  };

  return (
    <>
      <div className="dashboard-wrapper bg-light py-4 min-vh-10">
        <div className="container">
          {/* Dashboard Header Section */}
          <div className="bg-white rounded-4 shadow-sm p-4 mb-5 border border-2 border-primary-subtle">
            <div className="row align-items-center justify-content-between">

              {/* Dashboard - Left Side */}
              <div className="col-md-5 text-center text-md-start mb-3 mb-md-0">
                <h1 className="text-primary fw-bold mb-2">
                  <i className="bi bi-speedometer2 me-2"></i>Reports Dashboard
                </h1>
                <p className="text-muted fs-5 mb-3">Welcome to your personalized dashboard</p>
                <button className="btn btn-outline-primary w-100" onClick={handleGoToEmployeeList}>
                  <i className="bi bi-people me-2"></i>Employee List
                </button>
              </div>

              {/* Profile - Right Side */}
              <div className="col-md-4 d-flex justify-content-md-end justify-content-center">
                <div className="card shadow-sm border-0 rounded-4 bg-light w-100" style={{ maxWidth: '320px' }}>
                  <div className="card-body">
                    <h5 className="text-center text-primary mb-3 border-bottom pb-2">My Profile</h5>
                    <p className="mb-2"><strong>Name:</strong> {localStorage.getItem("name")}</p>
                    <p className="mb-2"><strong>Role:</strong> <span className="badge bg-primary">{localStorage.getItem("user_role")}</span></p>
                    <p className="mb-3"><strong>Username:</strong> {localStorage.getItem("username")}</p>
                    <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>



        </div>
      </div>

      <div className="container mt-5">

        {reports.map(r => (
          <div key={r.id} className="card shadow-sm mb-5 border-primary">
            {/* Selected Employee Info Section */}
            {employeeInfo && (
              <div className="bg-white rounded-4 shadow-sm p-4 mb-4 mt-4 m-4 border-start border-4 border-primary d-flex align-items-center gap-3">
                {/* Avatar */}
                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                  style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 'bold' }}
                >
                  {employeeInfo.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>

                {/* Employee Info */}
                <div>
                  <h5 className="text-primary fw-bold mb-1">{employeeInfo.name}</h5>
                  <p className="mb-0 text-muted"><strong>Email:</strong> {employeeInfo.email}</p>
                  <p className="mb-0 text-muted"><strong>Team ID:</strong> {employeeInfo.teamId}</p>
                </div>
              </div>
            )}
            {/* <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Report Submitted by Employee</h5>
            </div> */}

            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item">
                  <strong>Submitted On:</strong> {formatDate(r.submitted_at)}
                </li>
                <li className="list-group-item">
                  <strong>Report Number:</strong> <span className="badge bg-secondary">{r.id}</span> &nbsp;
                  <strong>Report ID:</strong> <span className="badge bg-info text-dark">{r.report_id}</span>
                </li>
                <li className="list-group-item">
                  <strong>Work Summary:</strong>
                  <p className="mb-0">{r.work_summary}</p>
                </li>
                <li className="list-group-item">
                  <strong>Description:</strong>
                  <p className="mb-0">{r.description}</p>
                </li>
                <li className="list-group-item">
                  <strong>Other Contributions:</strong>
                  <p className="mb-0">{r.judgment_parameters}</p>
                </li>
              </ul>

       
              <div className="mt-4">
                <h5 className="text-primary">Feedbacks</h5>
                <ul className="list-group mt-3">
                  {feedbacks.filter(fb => fb.report_id === r.report_id).length === 0 ? (
                    <li className="list-group-item text-muted">No feedback given for this report.</li>
                  ) : (
                    feedbacks
                      .filter(fb => fb.report_id === r.report_id)
                      .map(fb => (
                        <li className="list-group-item" key={fb.id}>
                          <div>
                            <strong>Feedback #{fb.id}</strong> &nbsp;
                            
                          </div>
                          <div>
                            <strong>Sentiment: </strong><span className={`badge ${fb.sentiment === 'positive' ? 'bg-success' : fb.sentiment === 'neutral' ? 'bg-secondary' : 'bg-danger'}`}>
                              {fb.sentiment.toUpperCase()}
                            </span>
                          </div>
                          {editFeedbackId === fb.id ? (
                            <div>
                              <textarea
                                className="form-control my-2"
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                              />
                              <select
                                className="form-select mb-2"
                                value={editSentiment}
                                onChange={(e) => setEditSentiment(e.target.value)}
                              >
                                <option value="positive">Positive</option>
                                <option value="neutral">Neutral</option>
                                <option value="negative">Negative</option>
                              </select>
                              <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdateFeedback(fb.id)}>Save</button>
                              <button className="btn btn-sm btn-secondary" onClick={() => setEditFeedbackId(null)}>Cancel</button>
                            </div>
                          ) : (
                            <>
                              <div><strong>Comment:</strong> {fb.comment}</div>
                              {fb.acknowledged ? (
                                <div><strong>Acknowledged By Employee: </strong>&#10004;</div>
                              ) : (
                                <div><strong>Acknowledgement: </strong>Pending</div>
                              )}
                              <div><small className="text-muted">Given at: {formatDate(fb.created_at)}</small></div>
                              <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => {
                                setEditFeedbackId(fb.id);
                                setEditComment(fb.comment);
                                setEditSentiment(fb.sentiment);
                              }}>
                                Edit
                              </button>
                            </>
                          )}
                        </li>
                      ))
                  )}
                </ul>
              </div>


              <div className="mt-5">
                <h5 className="text-success">Give New Feedback</h5>

                <div className="mb-3 mt-3">
                  <label className="form-label fw-semibold">Sentiment</label>
                  <select className="form-select" value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
                    <option value="">Select</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Comment</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={comment}
                    placeholder="Enter your feedback here..."
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button className="btn btn-outline-primary" onClick={() => submitFeedback(r.report_id)}>
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeDetailPage;
