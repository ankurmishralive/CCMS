import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ComplaintCategorization = () => {
  const { complaintData, updateComplaintData } = useAppContext();
  const [category, setCategory] = useState(complaintData.category || "");
  const [priority, setPriority] = useState(complaintData.priority || "");
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateComplaintData({ category, priority });
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
          <h1 id="complaint-manager-title">Shape the next action.</h1>
          <p className="welcome-copy">
            Categorize this complaint and set its priority so the right team can
            respond with focus.
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
            <label htmlFor="complaint-category">Complaint category</label>
            <select
              id="complaint-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setIsSaved(false);
              }}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Service">Service</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="complaint-priority">Complaint priority</label>
            <select
              id="complaint-priority"
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setIsSaved(false);
              }}
              required
            >
              <option value="" disabled>
                Select a priority
              </option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">Save classification</button>
          </div>
          <p className="field-hint" role="status" aria-live="polite">
            {isSaved ? "Complaint classification saved." : " "}
          </p>
        </form>
      </section>
    </main>
  );
};

export default ComplaintCategorization;
