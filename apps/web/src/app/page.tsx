"use client";

import React, { useState, useEffect, useRef } from "react";

/* ========================================================
   Launch Pad – Expert-Driven Startup Idea Review
   Simple landing page with Sign In / Sign Up auth modals
   and application form with Formspree data submission
======================================================== */

// ─── Auth Modal Component ───
function AuthModal({
  isOpen,
  onClose,
  mode,
  onToggleMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onToggleMode: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup" && !name) return;

    setLoading(true);

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1500));

    // Store in localStorage for demo
    if (mode === "signup") {
      localStorage.setItem(
        "launchpad_user",
        JSON.stringify({ name, email, createdAt: new Date().toISOString() })
      );
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      setSuccess(false);
      setEmail("");
      setPassword("");
      setName("");
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="modal-title">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="modal-subtitle">
          {mode === "signin"
            ? "Sign in to access your startup dashboard."
            : "Join Launch Pad to get your idea reviewed by experts."}
        </p>

        {success && (
          <div
            className="success-banner"
            style={{ display: "block", marginBottom: 16 }}
          >
            <i className="fa-solid fa-check-circle"></i>{" "}
            {mode === "signin"
              ? "Signed in successfully!"
              : "Account created successfully!"}
          </div>
        )}

        {/* Social Login */}
        <div className="social-login">
          <button className="social-btn" type="button">
            <i className="fa-brands fa-google"></i> Google
          </button>
          <button className="social-btn" type="button">
            <i className="fa-brands fa-github"></i> GitHub
          </button>
        </div>

        <div className="modal-divider">or continue with email</div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Processing...
              </>
            ) : mode === "signin" ? (
              <>
                Sign In <i className="fa-solid fa-arrow-right"></i>
              </>
            ) : (
              <>
                Create Account <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="modal-switch">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={onToggleMode}>Sign up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={onToggleMode}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  // Form state
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSignIn = () => {
    setAuthMode("signin");
    setAuthOpen(true);
  };
  const openSignUp = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const fname = (form.elements.namedItem("first_name") as HTMLInputElement)
      ?.value;
    const lname = (form.elements.namedItem("last_name") as HTMLInputElement)
      ?.value;
    const contact = (
      form.elements.namedItem("contact_detail") as HTMLInputElement
    )?.value;
    const idea = (form.elements.namedItem("idea") as HTMLTextAreaElement)
      ?.value;
    const help = (form.elements.namedItem("help_needed") as HTMLInputElement)
      ?.value;

    // Basic validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fname?.trim() || !lname?.trim()) {
      alert("Please enter your full name.");
      return;
    }
    if (!emailPattern.test(contact || "")) {
      alert("Please enter a valid email address.");
      return;
    }
    if ((idea || "").trim().length < 15) {
      alert("Please describe your idea in at least 15 characters.");
      return;
    }
    if (!(help || "").trim()) {
      alert("Please select what help you need.");
      return;
    }

    setFormLoading(true);

    try {
      const data = new FormData(form);
      const res = await fetch("https://formspree.io/f/xwpkpzar", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 4000);
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      alert("Submission failed. Please check your network and try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        onToggleMode={() =>
          setAuthMode((m) => (m === "signin" ? "signup" : "signin"))
        }
      />

      {/* ─── Navbar ─── */}
      <nav className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <a href="#" className="navbar-brand">
            Launch Pad
          </a>
          <div className="navbar-links">
            <a href="#process">How It Works</a>
            <a href="#experts">Expert Panels</a>
            <a href="#deliverables">Deliverables</a>
            <a href="#apply">Apply</a>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={openSignIn}>
              Sign In
            </button>
            <button className="btn btn-primary btn-sm" onClick={openSignUp}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-badge">
            <i className="fa-solid fa-rocket"></i>
            Expert-Driven Startup Assessment
          </div>
          <h1>
            Your startup idea,
            <br />
            reviewed by <em>real experts</em>
          </h1>
          <p className="subtitle">
            We simulate a structured startup review meeting. Your concept is
            analyzed across legal, finance, marketing, and engineering
            dimensions by domain professionals who have done it before.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={openSignUp}>
              Start Your Review{" "}
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <a href="#process" className="btn btn-outline btn-lg">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="section" id="process">
        <div className="container">
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">
              A structured path from idea to clarity
            </h2>
            <p className="section-subtitle">
              Four clear stages designed to stress-test your concept and surface
              real insights — no guesswork.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="step-icon">
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <div className="step-number">01</div>
              <h3>Submit Your Idea</h3>
              <p>
                Fill out a structured brief covering your problem, solution,
                target audience, and business model hypothesis.
              </p>
            </div>

            <div className="process-card">
              <div className="step-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="step-number">02</div>
              <h3>Expert Panel Assembly</h3>
              <p>
                We match your idea with the right domain experts — legal,
                finance, marketing, and engineering professionals.
              </p>
            </div>

            <div className="process-card">
              <div className="step-icon">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
              </div>
              <div className="step-number">03</div>
              <h3>Deep Review Session</h3>
              <p>
                Each expert independently analyzes feasibility, risks, market
                positioning, and scalability of your concept.
              </p>
            </div>

            <div className="process-card">
              <div className="step-icon">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <div className="step-number">04</div>
              <h3>Actionable Report</h3>
              <p>
                Receive a comprehensive report with scores, risk flags,
                competitive insights, and a clear go/no-go recommendation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Expert Panels ─── */}
      <section className="section" id="experts">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Expert Panels</span>
            <h2 className="section-title">
              Professionals who&apos;ve built and scaled
            </h2>
            <p className="section-subtitle">
              Your idea is evaluated by specialists across six critical startup
              domains.
            </p>
          </div>

          <div className="experts-grid">
            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-gavel"></i>
              </div>
              <div className="expert-role">Legal &amp; Compliance</div>
              <h3>Regulatory Readiness</h3>
              <p>
                IP protection, incorporation structure, compliance frameworks,
                and legal risk assessment for your market.
              </p>
            </div>

            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-coins"></i>
              </div>
              <div className="expert-role">Finance &amp; Funding</div>
              <h3>Financial Modeling</h3>
              <p>
                Unit economics, burn rate projection, funding strategy, revenue
                model validation, and investor readiness scoring.
              </p>
            </div>

            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-bullhorn"></i>
              </div>
              <div className="expert-role">Marketing &amp; Growth</div>
              <h3>Go-To-Market Strategy</h3>
              <p>
                Customer acquisition channels, brand positioning, competitive
                landscape analysis, and growth lever identification.
              </p>
            </div>

            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="expert-role">Engineering &amp; Tech</div>
              <h3>Technical Architecture</h3>
              <p>
                Stack evaluation, scalability assessment, MVP scope definition,
                and technical debt risk analysis.
              </p>
            </div>

            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <div className="expert-role">Operations &amp; Strategy</div>
              <h3>Business Operations</h3>
              <p>
                Supply chain logistics, team structure recommendations, and
                operational scaling playbook design.
              </p>
            </div>

            <div className="expert-card">
              <div className="expert-icon">
                <i className="fa-solid fa-palette"></i>
              </div>
              <div className="expert-role">Design &amp; UX</div>
              <h3>Product Experience</h3>
              <p>
                User journey mapping, interface patterns, accessibility
                compliance, and conversion-optimized design review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Deliverables ─── */}
      <section className="section" id="deliverables">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What You Get</span>
            <h2 className="section-title">
              Tangible outputs, not just opinions
            </h2>
            <p className="section-subtitle">
              Every review comes with structured deliverables you can
              immediately act on.
            </p>
          </div>

          <div className="deliverables-list">
            <div className="deliverable-item">
              <i className="fa-solid fa-file-contract"></i>
              <span>
                <strong>SWOT Analysis</strong> — Strengths, weaknesses,
                opportunities, and threats mapped per domain.
              </span>
            </div>
            <div className="deliverable-item">
              <i className="fa-solid fa-table-cells"></i>
              <span>
                <strong>Lean Canvas</strong> — Full 9-box business model canvas
                filled by our experts.
              </span>
            </div>
            <div className="deliverable-item">
              <i className="fa-solid fa-chart-pie"></i>
              <span>
                <strong>Market Report</strong> — Competitive positioning,
                TAM/SAM/SOM estimates, and market entry analysis.
              </span>
            </div>
            <div className="deliverable-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>
                <strong>Risk Assessment</strong> — Scored risk matrix across
                legal, technical, and financial dimensions.
              </span>
            </div>
            <div className="deliverable-item">
              <i className="fa-solid fa-money-bill-trend-up"></i>
              <span>
                <strong>Financial Projections</strong> — 12-month runway
                forecast with burn rate and revenue modeling.
              </span>
            </div>
            <div className="deliverable-item">
              <i className="fa-solid fa-road"></i>
              <span>
                <strong>Action Roadmap</strong> — Prioritized next steps with
                timeline and milestone markers.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Application Form ─── */}
      <section className="section" id="apply">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Apply Now</span>
            <h2 className="section-title">Submit your idea for review</h2>
            <p className="section-subtitle">
              Tell us about your concept and we&apos;ll match you with the
              right expert panel.
            </p>
          </div>

          <div className="form-section">
            {formSuccess && (
              <div className="success-banner" style={{ display: "block" }}>
                <i className="fa-solid fa-check-circle"></i> Application
                submitted successfully! We&apos;ll be in touch within 48 hours.
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleFormSubmit}
              action="https://formspree.io/f/xwpkpzar"
              method="POST"
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Jane"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="contact_detail">Email Address</label>
                  <input
                    type="email"
                    id="contact_detail"
                    name="contact_detail"
                    placeholder="you@startup.com"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="help_needed">What Help Do You Need?</label>
                  <select id="help_needed" name="help_needed" required>
                    <option value="">Select an option...</option>
                    <option value="Full Review">
                      Full Expert Review (All Domains)
                    </option>
                    <option value="Legal">Legal &amp; Compliance Only</option>
                    <option value="Finance">Finance &amp; Funding Only</option>
                    <option value="Technical">
                      Technical Architecture Only
                    </option>
                    <option value="Marketing">
                      Marketing &amp; Growth Only
                    </option>
                    <option value="Operations">
                      Operations &amp; Strategy Only
                    </option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="idea">Describe Your Startup Idea</label>
                  <textarea
                    id="idea"
                    name="idea"
                    rows={5}
                    placeholder="What problem are you solving? Who is your target audience? What's your proposed solution and business model?"
                    required
                  ></textarea>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={formLoading}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {formLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                      Submitting...
                    </>
                  ) : formSuccess ? (
                    <>
                      <i className="fa-solid fa-check"></i> Application Sent
                    </>
                  ) : (
                    <>
                      Submit Application{" "}
                      <i className="fa-solid fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">Launch Pad</div>
              <p className="footer-desc">
                Expert-driven startup idea assessment. We help founders
                validate, refine, and de-risk their concepts before they
                invest months of effort.
              </p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <a href="#process">How It Works</a>
              <a href="#experts">Expert Panels</a>
              <a href="#deliverables">Deliverables</a>
              <a href="#apply">Apply</a>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Blog</a>
              <a href="#">Case Studies</a>
              <a href="#">FAQ</a>
              <a href="#">Documentation</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; 2026 Launch Pad. All rights reserved.</span>
            <span>
              Built with <i className="fa-solid fa-heart" style={{ color: "var(--accent)" }}></i> for
              founders
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
