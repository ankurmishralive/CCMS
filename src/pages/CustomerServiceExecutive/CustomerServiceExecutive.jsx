import { useEffect, useState } from "react";
import api from "../../api/api";

const COMPLAINTS_API_URL = "http://localhost:8088/api/complaints";

function CustomerServiceExecutive() {
  const [activeTab, setActiveTab] = useState("raise");
  const [complaints, setComplaints] = useState([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);
  const [complaintListError, setComplaintListError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await api.get(COMPLAINTS_API_URL);
        const complaintList = Array.isArray(response)
          ? response
          : response?.data || response?.content || response?.complaints || [];

        setComplaints(Array.isArray(complaintList) ? complaintList : []);
      } catch (error) {
        setComplaintListError(error.message || "Unable to load complaints.");
      } finally {
        setIsLoadingComplaints(false);
      }
    };

    loadComplaints();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const complaint = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      mobileNumber: formData.get("mobileNumber"),
      complaintTitle: formData.get("complaintTitle"),
      complaintDescription: formData.get("complaintDescription"),
    };

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await api.post(COMPLAINTS_API_URL, complaint);
      setComplaints((currentComplaints) => [complaint, ...currentComplaints]);
      event.currentTarget.reset();
      setActiveTab("list");
    } catch (error) {
      setSubmitError(error.message || "Unable to submit complaint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="role-main">
      <section
        className="role-panel role-panel-coral complaint-panel"
        aria-labelledby="complaint-form-title"
      >
        <div className="complaint-heading">
          <div className="role-copy">
            <p className="eyebrow">Customer service executive</p>
            <h1 id="complaint-form-title">Complaint Registration</h1>
          </div>
          <span className="complaint-count">{complaints.length} raised</span>
        </div>

        <div
          className="complaint-tabs"
          role="tablist"
          aria-label="Complaint workspace"
        >
          <button
            className={
              activeTab === "raise" ? "tab-button active" : "tab-button"
            }
            type="button"
            role="tab"
            aria-selected={activeTab === "raise"}
            onClick={() => setActiveTab("raise")}
          >
            Raise Complaint
          </button>
          <button
            className={
              activeTab === "list" ? "tab-button active" : "tab-button"
            }
            type="button"
            role="tab"
            aria-selected={activeTab === "list"}
            onClick={() => setActiveTab("list")}
          >
            Complaint List
          </button>
        </div>

				{activeTab === 'raise' ? <form className="complaint-form" onSubmit={handleSubmit}>
					<div className="form-field">
						<label htmlFor="customer-name">Customer Name</label>
						<input id="customer-name" name="customerName" type="text" placeholder="Enter customer name" required />
					</div>
					<div className="form-field">
						<label htmlFor="customer-email">Customer Email</label>
						<input id="customer-email" name="customerEmail" type="email" placeholder="name@example.com" required />
					</div>
					<div className="form-field">
						<label htmlFor="mobile-number">Mobile Number</label>
						<input id="mobile-number" name="mobileNumber" type="tel" placeholder="Enter mobile number" required />
					</div>
					<div className="form-field">
						<label htmlFor="complaint-title">Complaint Title</label>
						<input id="complaint-title" name="complaintTitle" type="text" placeholder="Summarize the complaint" required />
					</div>
					<div className="form-field form-field-wide">
						<label htmlFor="complaint-description">Complaint Description</label>
						<textarea id="complaint-description" name="complaintDescription" rows="5" placeholder="Describe the complaint in detail" required />
					</div>
					<div className="form-actions">
						<button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Create complaint'}</button>
					</div>
					{submitError && <p role="alert">{submitError}</p>}
				</form> : <div className="complaint-list" role="tabpanel">
					{isLoadingComplaints ? <p>Loading complaints...</p> : complaintListError ? <p role="alert">{complaintListError}</p> : complaints.length === 0 ? <div className="empty-list"><span className="empty-list-icon" aria-hidden="true">+</span><strong>No complaints raised yet</strong><span>New complaints will appear here after submission.</span><button type="button" onClick={() => setActiveTab('raise')}>Raise your first complaint</button></div> : <div className="complaint-table-wrapper"><table className="complaint-table"><thead><tr><th scope="col">Complaint ID</th><th scope="col">Customer</th><th scope="col">Email</th><th scope="col">Mobile</th><th scope="col">Title</th><th scope="col">Description</th><th scope="col">Status</th></tr></thead><tbody>{complaints.map((complaint, index) => <tr key={`${complaint.complaintId || complaint.id || complaint.customerEmail}-${index}`}>
						<td className="complaint-id">{complaint.complaintId || complaint.id || '-'}</td>
						<td>{complaint.customerName}</td>
						<td>{complaint.customerEmail}</td>
						<td>{complaint.mobileNumber}</td>
						<td>{complaint.complaintTitle}</td>
						<td>{complaint.complaintDescription}</td>
						<td><span className="complaint-status">{complaint.status || '-'}</span></td>
					</tr>)}</tbody></table></div>}
				</div>}
			</section>
		</main>
	);
}

export default CustomerServiceExecutive;
