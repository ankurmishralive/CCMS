import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAppContext } from "../../context/AppContext";
import { COMPLAINTS_API_URL } from "../../constants";

import ComplaintCategorization from "../../components/ComplaintCategorization/ComplaintCategorization";
import ComplaintValidation from "../../components/ComplaintValidation/ComplaintValidation";

const ComplaintSupervisor = () => {
  const { complaintData, updateComplaintData } = useAppContext();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await api.get(COMPLAINTS_API_URL);
        const complaintList = Array.isArray(response)
          ? response
          : response?.data || response?.content || response?.complaints || [];

        setComplaints(Array.isArray(complaintList) ? complaintList : []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load complaints.");
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, []);

  const handleValidate = (complaint) => {
    setSelectedComplaintId(complaint.complaintId);
    updateComplaintData({
      ...complaint,
      validationStatus: complaint.validationStatus || "",
      validationNotes: complaint.validationNotes || "",
    });
  };

  const handleBackToList = () => {
    setSelectedComplaintId(null);
  };

  if (selectedComplaintId) {
    const isValid =
      complaintData.validationStatus === true ||
      complaintData.validationStatus === "Valid";

    if (isValid) {
      return <ComplaintCategorization onBack={handleBackToList} />;
    }

    return <ComplaintValidation onBack={handleBackToList} />;
  }

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-blue complaint-panel"
        aria-labelledby="complaint-supervisor-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Complaint supervisor</p>
            <h1 id="complaint-supervisor-title">Review incoming complaints.</h1>
            <p className="welcome-copy">
              Select a complaint to validate its details before categorization.
            </p>
          </div>
          <span className="complaint-count">{complaints.length} complaints</span>
        </div>

        <div className="complaint-list" role="region" aria-live="polite">
          {isLoading ? (
            <p>Loading complaints...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : complaints.length === 0 ? (
            <div className="empty-list">
              <strong>No complaints available</strong>
              <span>New complaints will appear here after registration.</span>
            </div>
          ) : (
            <div className="complaint-table-wrapper">
              <table className="complaint-table supervisor-complaint-table">
                <thead>
                  <tr>
                    <th scope="col">Complaint ID</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint.complaintId}>
                      <td className="complaint-id">{complaint.complaintId}</td>
                      <td>
                        <strong>{complaint.customerName}</strong>
                        <span className="table-secondary-text">
                          {complaint.customerEmail}
                        </span>
                      </td>
                      <td>{complaint.complaintTitle}</td>
                      <td>{complaint.complaintDescription}</td>
                      <td>
                        {complaint.validationStatus
                          ? "Validated"
                          : complaint.status || "Pending"}
                      </td>
                      <td>
                        <button
                          className="table-action-button"
                          type="button"
                          onClick={() => handleValidate(complaint)}
                        >
                          Validate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ComplaintSupervisor;
