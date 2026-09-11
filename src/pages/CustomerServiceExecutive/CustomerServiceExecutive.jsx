import { useEffect, useState } from "react";
import api from "../../api/api";

const COMPLAINTS_API_URL = "http://localhost:8088/api/complaints";
const WITHDRAW_COMPLAINT_API_URL = "http://localhost:8088/api/complaints/withdrawComplaint";

const normalizeComplaint = (complaint = {}) => {
  const source = complaint || {};
  return {
  ...source,
  complaintId:
    source.complaintId || source.complaint_id || source.id || "",
  customerName: source.customerName || source.customer_name || "",
  customerEmail: source.customerEmail || source.customer_email || "",
  mobileNumber: source.mobileNumber || source.mobile_number || "",
  customerId: source.customerId || source.customer_id || source.complaintId || source.complaint_id || source.id || "",
  complaintTitle: source.complaintTitle || source.complaint_title || "",
  complaintDescription:
    source.complaintDescription || source.complaint_description || "",
  status: source.status || "Initiated",
  };
};

const getComplaintList = (response) => {
  const complaintList = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.complaints || [];

  return Array.isArray(complaintList)
    ? complaintList.map(normalizeComplaint)
    : [];
};

const getComplaintFromResponse = (response) => {
  if (Array.isArray(response)) return normalizeComplaint(response[0]);
  return normalizeComplaint(
    response?.data || response?.complaint || response,
  );
};

function CustomerServiceExecutive() {
  const [activeTab, setActiveTab] = useState("raise");
  const [complaints, setComplaints] = useState([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);
  const [complaintListError, setComplaintListError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [withdrawComplaint, setWithdrawComplaint] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await api.get(COMPLAINTS_API_URL);
        setComplaints(getComplaintList(response));
      } catch (error) {
        setComplaintListError(error.message || "Unable to load complaints.");
      } finally {
        setIsLoadingComplaints(false);
      }
    };

    loadComplaints();
  }, []);

  const isWithdrawnComplaint = (complaint) =>
    String(complaint.status || "").toLowerCase() === "withdrawn";

  const filteredComplaints = complaints.filter((complaint) => {
    const searchValue = searchTerm.trim().toLowerCase();
    if (!searchValue) return true;

    return [complaint.customerName, complaint.complaintId]
      .some((value) => String(value || "").toLowerCase().includes(searchValue));
  });

  const confirmWithdraw = async () => {
    if (!withdrawComplaint || isWithdrawing) return;

    const complaintId = withdrawComplaint.complaintId;
    if (!complaintId) {
      setWithdrawError("Complaint ID is not available for this complaint.");
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError("");

    try {
      await api.post(
        `${WITHDRAW_COMPLAINT_API_URL}/${encodeURIComponent(complaintId)}`,
        withdrawComplaint,
      );
      const response = await api.get(COMPLAINTS_API_URL);
      setComplaints(getComplaintList(response));
      setWithdrawComplaint(null);
    } catch (error) {
      setWithdrawError(error.message || "Unable to withdraw complaint.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const complaint = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      mobileNumber: formData.get("mobileNumber"),
      complaintTitle: formData.get("complaintTitle"),
      complaintDescription: formData.get("complaintDescription"),
    };

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await api.post(COMPLAINTS_API_URL, complaint);
      const createdComplaint = getComplaintFromResponse(response);
      let updatedComplaints = [];

      try {
        const refreshedResponse = await api.get(COMPLAINTS_API_URL);
        updatedComplaints = getComplaintList(refreshedResponse);
      } catch {
        updatedComplaints = [];
      }

      if (updatedComplaints.length > 0) {
        setComplaints(updatedComplaints);
      } else {
        setComplaints((currentComplaints) => [
          { ...complaint, ...createdComplaint },
          ...currentComplaints,
        ]);
      }
      form.reset();
      setSubmitSuccess("Complaint registered successfully.");
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

        {submitSuccess && <p className="submit-success" role="status" aria-live="polite">{submitSuccess}</p>}

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
					{isLoadingComplaints ? <p>Loading complaints...</p> : complaintListError ? <p role="alert">{complaintListError}</p> : complaints.length === 0 ? <div className="empty-list"><span className="empty-list-icon" aria-hidden="true">+</span><strong>No complaints raised yet</strong><span>New complaints will appear here after submission.</span><button type="button" onClick={() => setActiveTab('raise')}>Raise your first complaint</button></div> : <>
            <div className="complaint-search">
              <label htmlFor="complaint-search-input">Search complaints</label>
              <input id="complaint-search-input" type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by customer name or complaint ID" />
            </div>
            {filteredComplaints.length === 0 ? <div className="empty-list"><strong>No complaints match your search.</strong></div> : <div className="complaint-table-wrapper"><table className="complaint-table"><thead><tr><th scope="col">Complaint ID</th><th scope="col">Customer</th><th scope="col">Email</th><th scope="col">Mobile</th><th scope="col">Title</th><th scope="col">Description</th><th scope="col">Status</th><th scope="col">Withdraw</th></tr></thead><tbody>{filteredComplaints.map((complaint, index) => <tr key={`${complaint.complaintId || complaint.id || complaint.customerEmail}-${index}`}>
						<td className="complaint-id">{complaint.complaintId || complaint.id || '-'}</td>
						<td>{complaint.customerName}</td>
						<td>{complaint.customerEmail}</td>
						<td>{complaint.mobileNumber}</td>
						<td>{complaint.complaintTitle}</td>
						<td>{complaint.complaintDescription}</td>
						<td><span className="complaint-status">{complaint.status || '-'}</span></td>
						<td><button type="button" className="withdraw-button" onClick={() => { setWithdrawError(""); setWithdrawComplaint(complaint); }} disabled={isWithdrawnComplaint(complaint)}>{isWithdrawnComplaint(complaint) ? 'Withdrawn' : 'Withdraw'}</button></td>
          </tr>)}</tbody></table></div>}
          </>}
				</div>}

        {withdrawComplaint && <div className="confirmation-backdrop" role="presentation" onClick={() => !isWithdrawing && setWithdrawComplaint(null)}>
          <div className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="withdraw-confirmation-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="withdraw-confirmation-title">Are you sure you want to withdraw this complaint?</h2>
            {withdrawError && <p className="confirmation-error" role="alert">{withdrawError}</p>}
            <div className="confirmation-actions">
              <button type="button" className="secondary-button" onClick={() => setWithdrawComplaint(null)} disabled={isWithdrawing}>No</button>
              <button type="button" className="withdraw-button" onClick={confirmWithdraw} disabled={isWithdrawing}>{isWithdrawing ? "Withdrawing..." : "Yes"}</button>
            </div>
          </div>
        </div>}
			</section>
		</main>
	);
}

export default CustomerServiceExecutive;
