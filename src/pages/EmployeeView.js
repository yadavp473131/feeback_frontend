import { useState, useEffect } from 'react';
import axios from "axios";

export default function EmployeeView({ data }) {
  const [workSummary, setWorkSummary] = useState("");
  const [description, setDescription] = useState("");
  const [judgment, setJudgment] = useState({});
  const [reportsHistory, setReportsHistory] = useState([]);
  const [message, setMessage] = useState("");
  const judgmentOptions = [
    "Took initiative",
    "Solved complex problem",
    "Helped team member",
    "Improved efficiency",
    "Learned new skill",
  ];
  const [feedbacksHistory, setFeedbacksHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbackHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employee/feedback-history/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setFeedbacksHistory(res.data);
    } catch (error) {
      console.error("Error fetching feedback history", error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeFeedback = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/employee/acknowledge-feedback/${id}/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      // Update UI to mark acknowledged
      setFeedbacksHistory(prev =>
        prev.map(fb => fb.id === id ? { ...fb, acknowledged: true } : fb)
      );
    } catch (error) {
      console.error("Error acknowledging feedback", error);
    }
  };

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);



  useEffect(() => {
    // Fetch feedback history
    axios.get("http://localhost:8000/api/employee/report-submission-history/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
      .then(res => setReportsHistory(res.data))
      .catch(err => console.error("Error fetching history:", err));
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        work_summary: workSummary,
        description: description,
        judgment_parameters: Object.keys(judgment).filter(k => judgment[k])
      };

      const response = await axios.post("http://localhost:8000/api/employee/report/", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      const newReport = response.data;
      console.log("New Report ID:", newReport.report_id);  // ✅ You get report_id here
      alert(`Report submitted successfully. ID: ${newReport.report_id}`);

      setMessage("Progress submitted successfully.");
      setWorkSummary("");
      setDescription("");
      setJudgment({});

      // Refresh history
      const res = await axios.get("http://localhost:8000/api/employee/report-submission-history/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setReportsHistory(res.data);

    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Failed to submit progress.");
    }
  };

  useEffect(() => {
    console.log("report submission history reportsHistory", reportsHistory);
    console.log("feedback submission history feedbbacksHistory", feedbacksHistory);
    console.log("judgment ", judgment);
  }, [reportsHistory, feedbacksHistory, judgment]);

  if (loading) return <div>Loading feedbacks...</div>;

  return (
    <>
<div className="container mt-4">
  <h2>Submit New Report</h2>
  <div className="card p-3">
    <h4>Describe Your Work</h4>
    <textarea
      className="form-control mb-2"
      placeholder="Summarize what you worked on..."
      value={workSummary}
      onChange={(e) => setWorkSummary(e.target.value)}
    />

    <textarea
      className="form-control mb-2"
      placeholder="What new did you do this time?"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />

    <h5>Select Achievements / Judgment Parameters</h5>
    <div className="mb-3">
      {judgmentOptions.map((option) => (
        <div key={option} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={option}
            checked={judgment[option] || false}
            onChange={(e) =>
              setJudgment({
                ...judgment,
                [option]: e.target.checked,
              })
            }
          />
          <label className="form-check-label" htmlFor={option}>
            {option}
          </label>
        </div>
      ))}
    </div>
    <div className="d-flex justify-content-end">
                  <button className="btn btn-outline-primary" onClick={handleSubmit}>
                    Submit to Manager
                  </button>
    </div>
  
    {message && <p className="mt-2 text-info">{message}</p>}
  </div>

  <div className="mt-5">
    <h4>Report Submission History with Feedback</h4>

    {reportsHistory.length === 0 ? (
      <p>No reports submitted yet.</p>
    ) : (
      reportsHistory.map((report, index) => {
        const relatedFeedbacks = feedbacksHistory.filter(
          fb => fb.report_id === report.report_id
        );

        return (
          <div key={index} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Report ID: {report.report_id}</h5>
              <p><strong>Summary:</strong> {report.work_summary}</p>
              <p><strong>Description:</strong> {report.description}</p>
              <p><strong>Judgments:</strong> {report.judgment_parameters.join(", ")}</p>

              <hr />
              <h6>Feedback(s):</h6>
              {relatedFeedbacks.length === 0 ? (
                <p className="text-muted">No feedback yet.</p>
              ) : (
                relatedFeedbacks.map(fb => (
                  <div key={fb.id} className="border rounded p-3 mb-2">
                    <p><strong>Feedback #{fb.id}</strong></p>
                    <p><strong>Manager:</strong> {fb.manager ? fb.manager : "Unknown"}</p>
                    <p><strong>Sentiment:</strong> <span className={`badge ${fb.sentiment === 'positive' ? 'bg-success' : fb.sentiment === 'neutral' ? 'bg-secondary' : 'bg-danger'}`}>{fb.sentiment}</span></p>
                    <p><strong>Comment:</strong> {fb.comment}</p>
                    <p className="text-muted"><small>Given on: {new Date(fb.created_at).toLocaleString()}</small></p>

                    {!fb.acknowledged ? (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => acknowledgeFeedback(fb.id)}
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="badge bg-success">Acknowledged</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })
    )}
  </div>
</div>
    </>
  );
}
