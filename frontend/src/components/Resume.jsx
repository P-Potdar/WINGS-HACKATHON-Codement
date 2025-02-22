import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Resume.css";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tempSelectedJob, setTempSelectedJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch job data from the database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!selectedJob) {
      setError("Please select a job first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const rdata = await response.text();

        try {
          const compatibilityResponse = await fetch(
            "http://localhost:3000/compatibility",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: selectedJob.id,
                rdata,
              }),
            }
          );

          if (compatibilityResponse.ok) {
            const data = await compatibilityResponse.json();
            console.log(data.val);

            if (data.val === "true" || !data.val) {
              navigate("/congrats");
            } else {
              navigate("/rejects");
            }
          } else {
            setError("Error evaluating compatibility. Please try again.");
          }

          const saveJobResponse = await fetch("http://localhost:3000/save-job", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedJob),
          });

          if (!saveJobResponse.ok) {
            const errorText = await saveJobResponse.text();
            setError("Error saving job details: " + errorText);
          }
        } catch (err) {
          setError("Error: " + err.message);
        }
      } else {
        setError("Error uploading file. Please try again.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleCardClick = (job) => {
    setTempSelectedJob(job); // Store the job temporarily
    setShowPopup(true);
  };

  const handleSelectJob = () => {
    setSelectedJob(tempSelectedJob); // Confirm job selection
    setShowPopup(false);
  };

  return (
    <div className="resume-upload-container">
      {/* Job Selection Section */}
      <div className="job-selection">
        <h2 className="job-heading">Select a Job to Apply</h2>
        <div className="job-cards pb-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={job-card ${selectedJob?.id === job.id ? "selected" : ""}}
              onClick={() => handleCardClick(job)}
            >
              <h3>{job.role}</h3>
              <p>
                <strong>Experience:</strong> {job.exp}
              </p>
              <p>
                <strong>Deadline:</strong> {job.deadline}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="upload-card">
        <h2 className="upload-heading">Please Upload Your Resume</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button type="submit" disabled={!selectedJob || !file}>
            {file ? "Submit" : "Upload"}
          </button>
        </form>
      </div>

      {/* Popup for Job Details */}
      {showPopup && tempSelectedJob && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <h2>{tempSelectedJob.role}</h2>
            <p>
              <strong>Experience:</strong> {tempSelectedJob.experience} years
            </p>
            <p>
              <strong>Deadline:</strong> {tempSelectedJob.deadline}
            </p>
            <p>
              <strong>Requirements:</strong>
            </p>
            <ul>
              {Array.isArray(tempSelectedJob.requirements)
                ? tempSelectedJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))
                : tempSelectedJob.requirements}
            </ul>
            <p>
              <strong>Job Description:</strong> {tempSelectedJob.description}
            </p>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={selectedJob?.id === tempSelectedJob?.id}
                  onChange={handleSelectJob}
                />
                Job Selected
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;