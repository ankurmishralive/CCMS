import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { useAppContext } from "../../context/AppContext";

const CATEGORY_SELECTION_TASKS_URL =
  "http://localhost:8088/api/complaints/categorySelection/tasks";
const UPDATE_CATEGORY_URL =
  "http://localhost:8088/api/complaints/updateCategory";

const normalizeTask = (task = {}) => {
  const complaint = task.complaintDetails || {};

  return {
    ...task,
    ...complaint,
    complaintId: complaint.complaintId || task.complaintId || task.id || "",
    status: complaint.status || task.status || "Validated",
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

const ComplaintManager = () => {
  const { complaintData, updateComplaintData } = useAppContext();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const selectedComplaint = complaints.find(
    (complaint) => String(complaint.id) === String(taskId),
  );
  const [assignedTeam, setAssignedTeam] = useState(
    complaintData.assignedTeam || "",
  );
  const [assignedAgent, setAssignedAgent] = useState(
    complaintData.assignedAgent || "",
  );
  const [dueDate, setDueDate] = useState(complaintData.dueDate || "");
  const [assignmentNotes, setAssignmentNotes] = useState(
    complaintData.assignmentNotes || "",
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await api.get(CATEGORY_SELECTION_TASKS_URL);
        setComplaints(getTaskList(response));
      } catch (requestError) {
        setLoadError(
          requestError.message || "Unable to load validated complaints.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadComplaints();
  }, []);

  useEffect(() => {
    if (!selectedComplaint) return;

    setAssignedTeam(selectedComplaint.assignedTeam || "");
    setIsSaved(false);
  }, [selectedComplaint]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedComplaint || isSubmitting) return;

    const category = assignedTeam.replace(/ Team$/, "");
    const query = new URLSearchParams({
      taskId: selectedComplaint.id || "",
      processInstanceId: selectedComplaint.processInstanceId || "",
      category,
    });
    const requestBody = {
      customerName: selectedComplaint.customerName,
      customerEmail: selectedComplaint.customerEmail,
      mobileNumber: selectedComplaint.mobileNumber,
      complaintTitle: selectedComplaint.complaintTitle,
      complaintDescription: selectedComplaint.complaintDescription,
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await api.post(`${UPDATE_CATEGORY_URL}?${query.toString()}`, requestBody);
      updateComplaintData({
        assignedTeam,
        assignedComplaint: {
          ...selectedComplaint,
          assignedTeam,
          category: assignedTeam,
        },
      });
      setIsSaved(true);
      navigate("/support-engineer");
    } catch (requestError) {
      setSubmitError(
        requestError.message || "Unable to assign this complaint.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-teal complaint-panel"
        aria-labelledby="complaint-manager-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Complaint manager</p>
            <h1 id="complaint-manager-title">
              {selectedComplaint
                ? "Assign the next action."
                : "Validated complaints."}
            </h1>
            {!selectedComplaint && (
              <p className="welcome-copy">
                Review validated complaints waiting for category selection and
                assign the next action.
              </p>
            )}
          </div>
          <span className="complaint-count">
            {complaints.length} complaints
          </span>
        </div>

        {!taskId ? (
          <div className="complaint-list supervisor-list" role="tabpanel">
            {isLoading ? (
              <p>Loading validated complaints...</p>
            ) : loadError ? (
              <p role="alert">{loadError}</p>
            ) : complaints.length === 0 ? (
              <div className="empty-list">
                <strong>No validated complaints found.</strong>
                <span>
                  Validated complaints will appear here when ready for
                  assignment.
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
                          <span className="complaint-status is-validated">
                            {complaint.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="detail-button"
                            onClick={() =>
                              navigate(`/complaint-manager/${complaint.id}`)
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
                <p className="eyebrow">Validated complaint details</p>
                <h2>
                  {selectedComplaint.complaintTitle || "Untitled complaint"}
                </h2>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/complaint-manager")}
              >
                Back to list
              </button>
            </div>
            <dl
              className="complaint-details"
              aria-label="Selected complaint details"
            >
              <div>
                <dt>Complaint ID</dt>
                <dd>{selectedComplaint.complaintId || "-"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className="complaint-status is-validated">
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
            <form className="complaint-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="complaint-id">Complaint ID</label>
                <input
                  id="complaint-id"
                  name="complaintId"
                  type="text"
                  value={
                    selectedComplaint.complaintId ||
                    complaintData.complaintId ||
                    "Not assigned"
                  }
                  readOnly
                />
              </div>
              <div className="form-field">
                <label htmlFor="assigned-team">Assigned team</label>
                <select
                  id="assigned-team"
                  name="assignedTeam"
                  value={assignedTeam}
                  onChange={(event) => {
                    setAssignedTeam(event.target.value);
                    setIsSaved(false);
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a team
                  </option>
                  <option value="Billing Team">Billing Team</option>
                  <option value="Delivery Team">Delivery Team</option>
                  <option value="Product Team">Product Team</option>
                  <option value="General Team">General Team</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Assigning..." : "Assign team"}
                </button>
              </div>
              {submitError && <p role="alert">{submitError}</p>}
              <p className="field-hint" role="status" aria-live="polite">
                {isSaved ? "Assignment details saved." : " "}
              </p>
            </form>
          </div>
        ) : (
          <div className="empty-list" role="alert">
            <strong>Complaint details unavailable.</strong>
            <button
              type="button"
              onClick={() => navigate("/complaint-manager")}
            >
              Back to validated complaints
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default ComplaintManager;
