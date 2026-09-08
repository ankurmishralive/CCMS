import { Route, Routes } from "react-router-dom";

import { AppProvider } from "./context/AppContext";

import Customer from "./pages/Customer/Customer";
import CustomerServiceExecutive from "./pages/CustomerServiceExecutive/CustomerServiceExecutive";
import ComplaintManager from "./pages/ComplaintManager/ComplaintManager";
import ComplaintSupervisor from "./pages/ComplaintSupervisor/ComplaintSupervisor";
import ComplaintCategorization from "./pages/ComplaintCategorization/ComplaintCategorization";
import SupportEngineer from "./pages/SupportEngineer/SupportEngineer";
import TeamLead from "./pages/TeamLead/TeamLead";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import "./App.scss";

function Home() {
  return (
    <main className="app-main">
      <section className="welcome-panel" aria-labelledby="welcome-title">
        <p className="eyebrow">Complaint &amp; case management system</p>
        <h1 id="welcome-title">Keep every conversation moving.</h1>
        <p className="welcome-copy">
          Choose your workspace from the navigation to manage cases, collaborate
          with your team, and deliver thoughtful customer support.
        </p>
        <div className="welcome-stat-row" aria-label="System summary">
          <div>
            <strong>24/7</strong>
            <span>case visibility</span>
          </div>
          <div>
            <strong>06</strong>
            <span>active workspaces</span>
          </div>
          <div>
            <strong>01</strong>
            <span>shared source of truth</span>
          </div>
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
          <Route path="/team-lead" element={<TeamLead />} />
          <Route path="/customer" element={<Customer />} />
          <Route
            path="/complaint-categorization"
            element={<ComplaintCategorization />}
          />
        </Routes>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
