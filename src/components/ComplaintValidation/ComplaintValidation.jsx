import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ComplaintValidation = () => {
  const { complaintData, updateComplaintData } = useAppContext();
  const [validationStatus, setValidationStatus] = useState(
    complaintData.validationStatus || "",
  );
  const [validationNotes, setValidationNotes] = useState(
    complaintData.validationNotes || "",
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateComplaintData({ validationStatus, validationNotes });
    setIsSaved(true);
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-blue complaint-panel"
        aria-labelledby="complaint-validation-title"
      >
        <div className="role-copy">
          <p className="eyebrow">Complaint Supervisor</p>
          <h1 id="complaint-validation-title">Check the complaint details.</h1>
          <p className="welcome-copy">
            Review the available information and record whether this complaint
            is ready for the next step.
          </p>
        </div>

        <dl className="complaint-details" aria-label="Complaint details">
          <div>
            <dt>Complaint ID</dt>
            <dd>{complaintData.complaintId || "Not assigned"}</dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{complaintData.category || "Not provided"}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{complaintData.priority || "Not provided"}</dd>
          </div>
          <div>
            <dt>Assigned team</dt>
            <dd>{complaintData.assignedTeam || "Not assigned"}</dd>
          </div>
          <div>
            <dt>Assigned agent</dt>
            <dd>{complaintData.assignedAgent || "Not assigned"}</dd>
          </div>
          <div>
            <dt>Due date</dt>
            <dd>{complaintData.dueDate || "Not set"}</dd>
          </div>
        </dl>

        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="validation-status">Validation decision</label>
            <select
              id="validation-status"
              value={validationStatus}
              onChange={(event) => {
                setValidationStatus(event.target.value);
                setIsSaved(false);
              }}
              required
            >
              <option value="" disabled>
                Select a decision
              </option>
              <option value="Valid">Valid</option>
              <option value="Needs review">Needs review</option>
            </select>
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="validation-notes">Validation notes</label>
            <textarea
              id="validation-notes"
              value={validationNotes}
              onChange={(event) => {
                setValidationNotes(event.target.value);
                setIsSaved(false);
              }}
              rows="5"
              placeholder="Add any findings or follow-up required"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save validation</button>
          </div>
          <p className="field-hint" role="status" aria-live="polite">
            {isSaved ? "Complaint validation saved." : " "}
          </p>
        </form>
      </section>
    </main>
  );
};

export default ComplaintValidation;
