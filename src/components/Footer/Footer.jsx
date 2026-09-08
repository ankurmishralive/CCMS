import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Link className="footer-brand" to="/">
            CCMS
          </Link>
          <p className="footer-tagline">
            A clearer way to move every complaint forward.
          </p>
        </div>
        <div className="footer-meta">
          <span className="status-dot" aria-hidden="true" />
          <span>Service desk online</span>
          <span className="footer-divider" aria-hidden="true" />
          <span>&copy; {new Date().getFullYear()} CCMS</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
