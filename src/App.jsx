import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import { AppProvider } from "./context/AppContext";
import api from "./api/api";

import Customer from "./pages/Customer/Customer";
import CustomerServiceExecutive from "./pages/CustomerServiceExecutive/CustomerServiceExecutive";
import ComplaintManager from "./pages/ComplaintManager/ComplaintManager";
import ComplaintSupervisor from "./pages/ComplaintSupervisor/ComplaintSupervisor";
import SupportEngineer from "./pages/SupportEngineer/SupportEngineer";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./App.scss";

const complaintProcess = [
  { name: "Complaint Registration", statuses: ["initiated"] },
  { name: "Complaint Validation", statuses: ["validated", "invalid complaint"] },
  { name: "Categorization & Prioritization", statuses: ["categorized", "prioritized"] },
  { name: "Team Assignment", statuses: ["assigned"] },
  { name: "Investigation", statuses: ["investigating", "under investigation"] },
  { name: "Determine Resolution Path", statuses: ["resolution path"] },
  { name: "Resolution Implementation", statuses: ["in progress", "resolution in progress"] },
  { name: "Customer Confirmation", statuses: ["customer confirmation"] },
  { name: "Closure", statuses: ["closed", "resolved"] },
];

const COMPLAINTS_API_URL = "http://localhost:8088/api/complaints";

const getComplaintList = (response) => {
  const list = Array.isArray(response)
    ? response
    : response?.data || response?.content || response?.complaints || [];

  return Array.isArray(list) ? list : [];
};

const getStatus = (complaint) => (complaint.status || "Initiated").trim();

const getProcessStepState = (step, index, complaints) => {
  const hasMatchingComplaint = complaints.some((complaint) =>
    step.statuses.includes(getStatus(complaint).toLowerCase()),
  );
  const hasLaterStage = complaintProcess
    .slice(index + 1)
    .some((laterStep) => complaints.some((complaint) =>
      laterStep.statuses.includes(getStatus(complaint).toLowerCase()),
    ));

  if (hasMatchingComplaint) return "active";
  if (hasLaterStage) return "complete";
  return "upcoming";
};

function Home() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await api.get(COMPLAINTS_API_URL);
        setComplaints(getComplaintList(response));
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statusCounts = complaints.reduce((counts, complaint) => {
    const status = getStatus(complaint).toLowerCase();
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
  const initiatedCount = statusCounts.initiated || 0;
  const validatedCount = statusCounts.validated || 0;
  const resolvedCount = (statusCounts.resolved || 0) + (statusCounts.closed || 0);
  const activeCount = complaints.length - resolvedCount;

  return (
    <main className="app-main">
      <section className="dashboard-panel" aria-labelledby="dashboard-title">
        <div className="dashboard-hero">
          <div>
            <p className="eyebrow">Operations dashboard / live view</p>
            <h1 id="dashboard-title">Complaint command center.</h1>
            <p className="process-summary">Monitor the queue, understand where complaints are moving, and keep every customer conversation visible.</p>
          </div>
          <Link className="dashboard-primary-action" to="/customer-service-executive">Register complaint <span aria-hidden="true">+</span></Link>
        </div>

        {error && <p className="dashboard-alert" role="alert">{error}</p>}

        <div className="dashboard-kpis" aria-label="Complaint summary">
          <div className="dashboard-kpi dashboard-kpi-primary"><span>Total complaints</span><strong>{isLoading ? "--" : complaints.length}</strong><small>All records in the system</small></div>
          <div className="dashboard-kpi"><span>Active queue</span><strong>{isLoading ? "--" : activeCount}</strong><small>Still moving through process</small></div>
          <div className="dashboard-kpi"><span>Initiated</span><strong>{isLoading ? "--" : initiatedCount}</strong><small>Waiting for validation</small></div>
          <div className="dashboard-kpi"><span>Validated</span><strong>{isLoading ? "--" : validatedCount}</strong><small>Ready for next stage</small></div>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-section dashboard-process-section" aria-labelledby="process-title">
            <div className="dashboard-section-heading"><div><span className="process-kicker">The complaint lifecycle</span><h2 id="process-title">Process control</h2></div><span className="process-count">09 stages</span></div>
            <ol className="dashboard-process-list">
              {complaintProcess.map((step, index) => {
                const state = getProcessStepState(step, index, complaints);
                return <li className={`dashboard-process-step ${state}`} key={step.name}><span className="process-step-number">{String(index + 1).padStart(2, "0")}</span><span className="process-step-name">{step.name}</span><span className="process-step-state">{state === "active" ? "Live" : state === "complete" ? "Complete" : "Next"}</span></li>;
              })}
            </ol>
          </section>

          <section className="dashboard-section dashboard-queue-section" aria-labelledby="queue-title">
            <div className="dashboard-section-heading"><div><span className="process-kicker">Live queue</span><h2 id="queue-title">Recent complaints</h2></div><Link className="dashboard-text-link" to="/complaint-supervisor">Open supervisor view</Link></div>
            {isLoading ? <p className="dashboard-muted">Loading live complaints...</p> : complaints.length === 0 ? <p className="dashboard-muted">No complaints have been registered yet.</p> : <div className="dashboard-queue"><div className="dashboard-queue-head"><span>Complaint</span><span>Status</span></div>{complaints.slice(0, 6).map((complaint, index) => <div className="dashboard-queue-row" key={`${complaint.complaintId || complaint.id || index}`}><div><strong>{complaint.complaintTitle || "Untitled complaint"}</strong><small>{complaint.customerName || "Unknown customer"} / {complaint.complaintId || complaint.id || "No ID"}</small></div><span className={`dashboard-status dashboard-status-${getStatus(complaint).toLowerCase().replaceAll(" ", "-")}`}>{getStatus(complaint)}</span></div>)}</div>}
          </section>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    // <BrowserRouter>
    <AppProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/customer-service-executive"
            element={<CustomerServiceExecutive />}
          />
          <Route
            path="/complaint-supervisor"
            element={<ComplaintSupervisor />}
          />
          <Route path="/complaint-manager" element={<ComplaintManager />} />
          <Route path="/support-engineer" element={<SupportEngineer />} />
          <Route path="/customer" element={<Customer />} />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
