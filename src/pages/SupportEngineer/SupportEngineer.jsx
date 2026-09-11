import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const RESOLUTION_TASKS_URL =
  "http://localhost:8088/api/complaints/resolution/tasks";
const RESOLUTION_CATEGORIES = ["Product", "Billing", "Delivery", "General"];

const normalizeTask = (task = {}) => {
  const complaint = task.complaintDetails || {};
  return {
    ...task,
    ...complaint,
    complaintId: complaint.complaintId || task.complaintId || task.id || "",
    status: complaint.status || task.status || "Assigned",
  };
};

const getTaskList = (response) => {
  const taskList = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.tasks || [];

  return Array.isArray(taskList)
    ? taskList
        .map(normalizeTask)
        .filter((task) => task.status.toLowerCase() !== "withdrawn")
    : [];
};

function SupportEngineer() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [resolutionCategory, setResolutionCategory] = useState("General");
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const selectedComplaint = complaints.find(
    (complaint) => String(complaint.id) === String(taskId),
  );

  useEffect(() => {
    const loadComplaints = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await api.get(RESOLUTION_TASKS_URL, {
          params: { category: resolutionCategory },
        });
        setComplaints(getTaskList(response));
      } catch (requestError) {
        setLoadError(
          requestError.message || "Unable to load resolution complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, [resolutionCategory]);

  useEffect(() => {
    setRemark("");
    setSubmitError("");
    setSubmitSuccess("");
  }, [selectedComplaint]);

  const handleResolve = async (event) => {
    event.preventDefault();
    if (!selectedComplaint || isSubmitting) return;

    const query = new URLSearchParams({
      taskId: selectedComplaint.id || "",
      processInstanceId: selectedComplaint.processInstanceId || "",
      remarks: remark,
    });

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await api.post(
        `http://localhost:8088/api/complaints/resolveComplaint?${query.toString()}`,
      );
      setSubmitSuccess("Resolution submitted successfully.");
    } catch (requestError) {
      setSubmitError(requestError.message || "Unable to submit resolution.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-blue complaint-panel"
        aria-labelledby="support-engineer-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Support engineer</p>
            <h1 id="support-engineer-title">
              {selectedComplaint
                ? "Solve the issue behind the issue."
                : "Resolution complaints."}
            </h1>
            {!selectedComplaint && (
              <p className="welcome-copy">
                Review complaints assigned to the Product team and resolve the
                next issue in the queue.
              </p>
            )}
          </div>
          <span className="complaint-count">
            {complaints.length} complaints
          </span>
        </div>

        {!taskId && (
          <div className="complaint-filter">
            <div className="complaint-filter-copy">
              <span className="process-kicker">Queue filter</span>
              <label htmlFor="resolution-category">Resolution category</label>
              <small>Showing complaints waiting for the selected team.</small>
            </div>
            <div className="complaint-filter-control">
              <select
                id="resolution-category"
                value={resolutionCategory}
                onChange={(event) => setResolutionCategory(event.target.value)}
                aria-label="Filter complaints by resolution category"
              >
                {RESOLUTION_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <span className="complaint-filter-value" aria-hidden="true">
                {complaints.length} in queue
              </span>
            </div>
          </div>
        )}

        {!taskId ? (
          <div className="complaint-list supervisor-list" role="tabpanel">
            {isLoading ? (
              <p>Loading resolution complaints...</p>
            ) : loadError ? (
              <p role="alert">{loadError}</p>
            ) : complaints.length === 0 ? (
              <div className="empty-list">
                <strong>No resolution complaints found.</strong>
                <span>
                  Product complaints waiting for resolution will appear here.
                </span>
              </div>
            ) : (
              <div className="complaint-table-wrapper">
                <table className="complaint-table">
                  <thead>
                    <tr>
                      <th scope="col">Complaint ID</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint, index) => (
                      <tr
                        key={`${complaint.id || complaint.complaintId}-${index}`}
                      >
                        <td className="complaint-id">
                          {complaint.complaintId || "-"}
                        </td>
                        <td>{complaint.customerName || "-"}</td>
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
                              navigate(`/support-engineer/${complaint.id}`)
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
            )}
          </div>
        ) : isLoading ? (
          <p className="complaint-list">Loading complaint details...</p>
        ) : selectedComplaint ? (
          <div className="supervisor-detail-panel">
            <div className="supervisor-detail-heading">
              <div>
                <p className="eyebrow">Resolution complaint</p>
                <h2>
                  {selectedComplaint.complaintTitle || "Untitled complaint"}
                </h2>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/support-engineer")}
              >
                Back to list
              </button>
            </div>
            <dl
              className="complaint-details"
              aria-label="Resolution complaint details"
            >
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
              <div className="form-field-wide">
                <dt>Description</dt>
                <dd>{selectedComplaint.complaintDescription || "-"}</dd>
              </div>
            </dl>

            <section
              className="resolve-section"
              aria-labelledby="resolve-section-title"
            >
              <p className="eyebrow">Resolve Section</p>
              <h2 id="resolve-section-title">Record the resolution.</h2>
              <form className="complaint-form" onSubmit={handleResolve}>
                <div className="form-field form-field-wide">
                  <label htmlFor="resolution-remark">Remark</label>
                  <textarea
                    id="resolution-remark"
                    name="remark"
                    rows="5"
                    value={remark}
                    onChange={(event) => {
                      setRemark(event.target.value);
                      setSubmitError("");
                      setSubmitSuccess("");
                    }}
                    placeholder="Enter the resolution remark"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit resolution"}
                  </button>
                </div>
                {submitError && <p role="alert">{submitError}</p>}
                {submitSuccess && (
                  <p
                    className="submit-success"
                    role="status"
                    aria-live="polite"
                  >
                    {submitSuccess}
                  </p>
                )}
              </form>
            </section>
          </div>
        ) : (
          <div className="empty-list" role="alert">
            <strong>Complaint details unavailable.</strong>
            <button type="button" onClick={() => navigate("/support-engineer")}>
              Back to resolution complaints
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default SupportEngineer;
