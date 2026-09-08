import { useEffect, useState } from "react";
import api from "../../api/api";

const COMPLAINTS_API_URL = "http://localhost:8088/api/complaints";

const ComplaintSupervisor = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [pendingAction, setPendingAction] = useState("");
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

  const openActionConfirmation = (action) => {
    setPendingAction(action);
  };

  const closeActionConfirmation = () => {
    setPendingAction("");
  };

  const confirmAction = () => {
    const nextStatus = pendingAction === "validate" ? "Validated" : "Invalid Complaint";
    const complaintId = selectedComplaint.complaintId || selectedComplaint.id;
    const updateComplaintStatus = (complaint) => (
      (complaint.complaintId || complaint.id) === complaintId
        ? { ...complaint, status: nextStatus }
        : complaint
    );

    setComplaints((currentComplaints) => currentComplaints.map(updateComplaintStatus));
    setSelectedComplaint((complaint) => ({ ...complaint, status: nextStatus }));
    closeActionConfirmation();
  };

  const getStatusClassName = (status) => (
    status === "Validated" ? "complaint-status is-validated" : status === "Invalid Complaint" ? "complaint-status is-invalid" : "complaint-status"
  );

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-blue complaint-panel"
        aria-labelledby="complaint-supervisor-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Complaint supervisor</p>
            <h1 id="complaint-supervisor-title">Review initiated complaints.</h1>
          </div>
          <span className="complaint-count">{complaints.length} complaints</span>
        </div>

        {selectedComplaint ? (
          <div className="supervisor-detail-panel">
            <div className="supervisor-detail-heading">
              <div>
                <p className="eyebrow">Complaint details</p>
                <h2>{selectedComplaint.complaintTitle || "Untitled complaint"}</h2>
              </div>
              <button type="button" className="secondary-button" onClick={() => setSelectedComplaint(null)}>
                Back to list
              </button>
            </div>
            <dl className="complaint-details" aria-label="Selected complaint details">
              <div><dt>Complaint ID</dt><dd>{selectedComplaint.complaintId || selectedComplaint.id || "-"}</dd></div>
              <div><dt>Status</dt><dd><span className={getStatusClassName(selectedComplaint.status || "Initiated")}>{selectedComplaint.status || "Initiated"}</span></dd></div>
              <div><dt>Customer</dt><dd>{selectedComplaint.customerName || "-"}</dd></div>
              <div><dt>Email</dt><dd>{selectedComplaint.customerEmail || "-"}</dd></div>
              <div><dt>Mobile</dt><dd>{selectedComplaint.mobileNumber || "-"}</dd></div>
              <div><dt>Description</dt><dd>{selectedComplaint.complaintDescription || "-"}</dd></div>
            </dl>
            {(selectedComplaint.status || "Initiated") === "Initiated" && <div className="supervisor-actions">
              <button type="button" className="validate-button" onClick={() => openActionConfirmation("validate")}>Validate</button>
              <button type="button" className="invalid-button" onClick={() => openActionConfirmation("invalid")}>Invalid Complaint</button>
            </div>}
          </div>
        ) : (
          <div className="complaint-list supervisor-list">
            {isLoading ? <p>Loading complaints...</p> : error ? <p role="alert">{error}</p> : complaints.length === 0 ? <div className="empty-list"><strong>No initiated complaints found.</strong></div> : <div className="complaint-table-wrapper"><table className="complaint-table"><thead><tr><th scope="col">Complaint ID</th><th scope="col">Customer</th><th scope="col">Title</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead><tbody>{complaints.map((complaint, index) => <tr key={`${complaint.complaintId || complaint.id || index}`}>
              <td className="complaint-id">{complaint.complaintId || complaint.id || "-"}</td>
              <td>{complaint.customerName || "-"}</td>
              <td>{complaint.complaintTitle || "-"}</td>
              <td><span className={getStatusClassName(complaint.status || "Initiated")}>{complaint.status || "Initiated"}</span></td>
              <td><button type="button" className="detail-button" onClick={() => setSelectedComplaint(complaint)}>View details</button></td>
            </tr>)}</tbody></table></div>}
          </div>
        )}

        {pendingAction && <div className="confirmation-backdrop" role="presentation" onClick={closeActionConfirmation}>
          <div className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="confirmation-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="confirmation-title">{pendingAction === "validate" ? "Are you sure you want to validate this complaint?" : "Are you sure you want to mark this complaint as invalid?"}</h2>
            <div className="confirmation-actions">
              <button type="button" className="secondary-button" onClick={closeActionConfirmation}>No</button>
              <button type="button" className={pendingAction === "validate" ? "validate-button" : "invalid-button"} onClick={confirmAction}>Yes</button>
            </div>
          </div>
        </div>}
      </section>
    </main>
  );
};

export default ComplaintSupervisor;
