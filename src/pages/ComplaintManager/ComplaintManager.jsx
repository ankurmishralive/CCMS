import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ComplaintManager = () => {
  const { complaintData, updateComplaintData } = useAppContext();
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

  const handleSubmit = (event) => {
    event.preventDefault();
    updateComplaintData({
      assignedTeam,
      assignedAgent,
      dueDate,
      assignmentNotes,
    });
    setIsSaved(true);
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-teal complaint-panel"
        aria-labelledby="complaint-manager-title"
      >
        <div className="role-copy">
          <p className="eyebrow">Complaint manager</p>
          <h1 id="complaint-manager-title">Assign the next action.</h1>
          <p className="welcome-copy">
            Give the right team and agent the context they need to resolve this
            complaint.
          </p>
        </div>
        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="complaint-id">Complaint ID</label>
            <input
              id="complaint-id"
              name="complaintId"
              type="text"
              value={complaintData.complaintId || "Not assigned"}
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
              <option value="Technical Support Team">
                Technical Support Team
              </option>
              <option value="Billing Team">Billing Team</option>
              <option value="Customer Service Team">
                Customer Service Team
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="assigned-agent">Assigned agent</label>
            <input
              id="assigned-agent"
              name="assignedAgent"
              type="text"
              value={assignedAgent}
              onChange={(event) => {
                setAssignedAgent(event.target.value);
                setIsSaved(false);
              }}
              placeholder="Enter agent name"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="due-date">Due date</label>
            <input
              id="due-date"
              name="dueDate"
              type="date"
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value);
                setIsSaved(false);
              }}
              required
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="assignment-notes">Assignment notes</label>
            <textarea
              id="assignment-notes"
              name="assignmentNotes"
              rows="5"
              value={assignmentNotes}
              onChange={(event) => {
                setAssignmentNotes(event.target.value);
                setIsSaved(false);
              }}
              placeholder="Add context or instructions for the assigned team"
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save assignment</button>
          </div>
          <p className="field-hint" role="status" aria-live="polite">
            {isSaved ? "Assignment details saved." : " "}
          </p>
        </form>
      </section>
    </main>
  );
};

export default ComplaintManager;
