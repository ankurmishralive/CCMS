import { Route, Routes } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import Customer from "./pages/Customer/Customer";
import CustomerServiceExecutive from "./pages/CustomerServiceExecutive/CustomerServiceExecutive";
import ComplaintManager from "./pages/ComplaintManager/ComplaintManager";
import ComplaintSupervisor from "./pages/ComplaintSupervisor/ComplaintSupervisor";
import SupportEngineer from "./pages/SupportEngineer/SupportEngineer";
import TeamLead from "./pages/TeamLead/TeamLead";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./App.scss";

const complaintProcess = [
  "Complaint Registration",
  "Complaint Validation",
  "Categorization & Prioritization",
  "Team Assignment",
  "Investigation",
  "Determine Resolution Path",
  "Resolution Implementation",
  "Customer Confirmation",
  "Closure",
];

function Home() {
  return (
    <main className="app-main">
      <section className="process-panel" aria-labelledby="welcome-title">
        <div className="process-intro">
          <div>
            <p className="eyebrow">Complaint &amp; case management system</p>
            <h1 id="welcome-title">A clear path from complaint to closure.</h1>
          </div>
          <p className="process-summary">
            CCMS gives every complaint a visible owner, a defined next step, and
            a complete record from first contact through resolution.
          </p>
        </div>

        <div className="process-heading">
          <div>
            <span className="process-kicker">The complaint lifecycle</span>
            <h2>One connected process</h2>
          </div>
          <span className="process-count">09 steps</span>
        </div>

        <ol className="process-list" aria-label="Complaint process steps">
          {complaintProcess.map((step, index) => (
            <li className="process-step" key={step}>
              <span className="process-step-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="process-step-name">{step}</span>
            </li>
          ))}
        </ol>
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
          <Route path="/team-lead" element={<TeamLead />} />
          <Route path="/customer" element={<Customer />} />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
