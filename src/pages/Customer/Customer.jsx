import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const COMPLAINTS_URL = "http://localhost:8088/api/complaints";
const REVIEW_RESOLUTION_URL =
  "http://localhost:8088/api/complaints/reviewResolution";

const normalizeComplaint = (complaint = {}) => ({
  ...complaint,
  complaintId:
    complaint.complaintId || complaint.complaint_id || complaint.id || "",
  status: complaint.status || "Initiated",
});

const getComplaintList = (response) => {
  const complaintList = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.complaints || [];

  return Array.isArray(complaintList)
    ? complaintList.map(normalizeComplaint)
    : [];
};

const getComplaintDetails = (response) =>
  normalizeComplaint(response?.data || response?.complaint || response);

function Customer() {
  const navigate = useNavigate();
  const { complaintId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = complaintId
          ? await api.get(
              `${COMPLAINTS_URL}/get/${encodeURIComponent(complaintId)}`,
            )
          : await api.get(COMPLAINTS_URL);

        if (complaintId) {
          setSelectedComplaint(getComplaintDetails(response));
        } else {
          setComplaints(getComplaintList(response));
        }
      } catch (requestError) {
        setError(requestError.message || "Unable to load complaints.");
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, [complaintId]);

  useEffect(() => {
    setReviewError("");
    setReviewSuccess("");
  }, [selectedComplaint]);

  const handleResolutionReview = async (satisfied) => {
    if (!selectedComplaint || isReviewSubmitting) return;

    const query = new URLSearchParams({
      processInstanceId: selectedComplaint.processInstanceId || "",
      satisfied: String(satisfied),
    });

    setIsReviewSubmitting(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await api.post(`${REVIEW_RESOLUTION_URL}?${query.toString()}`);
      setReviewSuccess(
        satisfied
          ? "Thank you. The complaint has been marked as resolved."
          : "Your feedback has been submitted. The complaint needs more work.",
      );
    } catch (requestError) {
      setReviewError(
        requestError.message || "Unable to submit your resolution review.",
      );
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-purple complaint-panel"
        aria-labelledby="customer-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Customer portal</p>
            <h1 id="customer-title">
              {complaintId ? "Complaint details." : "Your complaints."}
            </h1>
            {!complaintId && (
              <p className="welcome-copy">
                Follow your complaint, see the latest update, and stay connected
                with the people working on your resolution.
              </p>
            )}
          </div>
          <span className="complaint-count">
            {complaintId ? "Complaint" : `${complaints.length} complaints`}
          </span>
        </div>

        {isLoading ? (
          <p className="complaint-list">Loading complaints...</p>
        ) : error ? (
          <p className="complaint-list" role="alert">
            {error}
          </p>
        ) : complaintId && selectedComplaint ? (
          <div className="supervisor-detail-panel">
            <div className="supervisor-detail-heading">
              <div>
                <p className="eyebrow">Complaint details</p>
                <h2>
                  {selectedComplaint.complaintTitle || "Untitled complaint"}
                </h2>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/customer")}
              >
                Back to list
              </button>
            </div>
            <dl className="complaint-details" aria-label="Complaint details">
              <div>
                <dt>Complaint ID</dt>
                <dd>{selectedComplaint.complaintId || "-"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="complaint-status">
                    {selectedComplaint.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Customer</dt>
                <dd>{selectedComplaint.customerName || "-"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{selectedComplaint.customerEmail || "-"}</dd>
              </div>
              <div>
                <dt>Mobile</dt>
                <dd>{selectedComplaint.mobileNumber || "-"}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{selectedComplaint.complaintDate || "-"}</dd>
              </div>
              <div className="form-field-wide">
                <dt>Description</dt>
                <dd>{selectedComplaint.complaintDescription || "-"}</dd>
              </div>
            </dl>
            <section
              className="resolve-section"
              aria-labelledby="resolved-section-title"
            >
              <p className="eyebrow">Resolved Section</p>
              <h2 id="resolved-section-title">Review the resolution.</h2>
              <p className="resolution-remark">
                {selectedComplaint.remark ||
                  selectedComplaint.remarks ||
                  selectedComplaint.resolutionRemarks ||
                  "No resolution remark provided."}
              </p>
              <div className="supervisor-actions">
                <button
                  type="button"
                  className="validate-button"
                  onClick={() => handleResolutionReview(true)}
                  disabled={isReviewSubmitting}
                >
                  {isReviewSubmitting ? "Submitting..." : "Resolved"}
                </button>
                <button
                  type="button"
                  className="invalid-button"
                  onClick={() => handleResolutionReview(false)}
                  disabled={isReviewSubmitting}
                >
                  Not Resolved
                </button>
              </div>
              {reviewError && (
                <p className="confirmation-error" role="alert">
                  {reviewError}
                </p>
              )}
              {reviewSuccess && (
                <p className="submit-success" role="status" aria-live="polite">
                  {reviewSuccess}
                </p>
              )}
            </section>
          </div>
        ) : complaintId ? (
          <div className="empty-list" role="alert">
            <strong>Complaint details unavailable.</strong>
            <button type="button" onClick={() => navigate("/customer")}>
              Back to complaints
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-list">
            <strong>No complaints found.</strong>
          </div>
        ) : (
          <div className="complaint-list supervisor-list">
            <div className="complaint-table-wrapper">
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th scope="col">Complaint ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint, index) => (
                    <tr key={`${complaint.complaintId || index}`}>
                      <td className="complaint-id">
                        {complaint.complaintId || "-"}
                      </td>
                      <td>{complaint.complaintTitle || "-"}</td>
                      <td>
                        <span className="complaint-status">
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="detail-button"
                          onClick={() =>
                            navigate(`/customer/${complaint.complaintId}`)
                          }
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Customer;
