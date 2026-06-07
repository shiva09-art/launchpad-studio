"use client";

import React, { useState, useEffect } from "react";
import { getSession } from "../lib/supabase";

// Define form state interface for better TypeScript support
interface FormData {
  full_name: string;
  age_group: string;
  email: string;
  idea_description: string;
}

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  
  // Controlled form state
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    age_group: "",
    email: "",
    idea_description: ""
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    // Fetch user session
    getSession()
      .then((s) => {
        setSession(s);
      })
      .catch((err) => {
        console.error("Failed to load session:", err);
      })
      .finally(() => {
        setIsLoadingSession(false);
      });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the specific error when the user starts typing
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.full_name.trim()) errors.full_name = "Please enter your full name.";
    if (!formData.age_group) errors.age_group = "Please select your age group.";
    if (!emailPattern.test(formData.email.trim())) errors.email = "Please enter a valid email address.";
    if (formData.idea_description.trim().length < 5) errors.idea_description = "Please describe your idea and stage in more detail.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      // Construct FormData object for Formspree
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      const res = await fetch("https://formspree.io/f/mgorgjpg", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (!res.ok) throw new Error("Transmission failure.");

      // Success handling
      setFormData({ full_name: "", age_group: "", email: "", idea_description: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (error) {
      alert("Transmission failure. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header id="header" className={navScrolled ? "scrolled" : ""}>
        <div className="container nav-container">
          <a href="#" className="logo">
            <img src="/logo.jpg" alt="Launchpad Logo" style={{ height: "40px", borderRadius: "8px" }} />
            Launch Pad
          </a>
          <nav className="nav-links">
            <a href="#ecosystem">Ecosystem</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#marketplace">Marketplace</a>
          </nav>
          <div className="nav-auth">
            <a href="/login" className="btn btn-outline" style={{ padding: "8px 16px" }}>Sign In</a>
            <a href="#apply" className="btn btn-primary" style={{ padding: "8px 16px" }}>Get Started</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="label">Execution-as-a-Service</div>
          <h1>The operating system <br /><em>for first-time founders.</em></h1>
          <p>Launch Pad is the complete ecosystem to validate ideas, connect with expert mentors, build your MVP, and prepare for fundraising—all through a single platform.</p>
          
          <div className="hero-actions">
            <a href="#apply" className="btn btn-primary">
              <i className="fa-solid fa-bolt" style={{ marginRight: '6px' }}></i> Start Building
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="ecosystem">
        <div className="container">
          <div className="label">The Ecosystem</div>
          <h2>Everything you need, <br />zero friction.</h2>
          <p className="subtext">We replaced fragmented tools and expensive consultants with a unified infrastructure designed specifically for day-zero startups.</p>

          <div className="ecosystem-grid">
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-microscope"></i></div>
              <h3>Idea Validation</h3>
              <p>Data-driven market checks to ensure your solution actually solves a burning problem before you write a single line of code.</p>
            </div>
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-route"></i></div>
              <h3>Startup Roadmaps</h3>
              <p>Step-by-step, actionable blueprints tailored to your industry, guiding you from concept to your first 100 users.</p>
            </div>
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-code"></i></div>
              <h3>MVP Development</h3>
              <p>Technical guidance, architecture planning, and no-code/low-code resources to get your product live in weeks, not months.</p>
            </div>
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-users-gear"></i></div>
              <h3>Expert Mentorship</h3>
              <p>Direct access to vetted operators, developers, and designers who have built and scaled real companies.</p>
            </div>
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-file-contract"></i></div>
              <h3>Registration & Docs</h3>
              <p>Seamless incorporation guidance, founder agreements, and essential legal templates to protect your equity.</p>
            </div>
            <div className="eco-card">
              <div className="eco-icon"><i className="fa-solid fa-chart-pie"></i></div>
              <h3>Investor Readiness</h3>
              <p>Pitch deck teardowns, cap table structuring, and data room preparation so you are fully prepared for seed rounds.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark-section" id="roadmap">
        <div className="container">
          <div className="label">The Founder Journey</div>
          <h2>A systematic approach to execution.</h2>
          <p className="subtext">Stop guessing what to do next. Our framework removes the ambiguity of early-stage company building.</p>

          <div className="flow-steps">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>Validate</h3>
              <p>Identify your ideal customer profile, run demand tests, and secure your first letters of intent.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>Build</h3>
              <p>Access our service marketplace and technical blueprints to build a robust, scalable MVP.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>Launch</h3>
              <p>Execute go-to-market strategies with our growth templates and community support network.</p>
            </div>
            <div className="step-card">
              <div className="step-num">04</div>
              <h3>Fund</h3>
              <p>Generate institutional-grade pitch materials and get matched with relevant early-stage investors.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="apply">
        <div className="container onboard-container">
          <div>
            <div className="label">Early Access</div>
            <h2>Join the next cohort of builders.</h2>
            <p className="subtext" style={{ marginBottom: "32px" }}>We are onboarding a limited number of technical and non-technical founders this month. Create your account to access the ecosystem.</p>
          </div>

          <div className="form-box" style={{ padding: "32px" }}>
            {isLoadingSession ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--ink-60)" }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Loading...
              </div>
            ) : !session ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h3 style={{ marginBottom: "16px", fontSize: "1.5rem" }}>Sign In Required</h3>
                <p style={{ color: "var(--ink-60)", marginBottom: "24px", lineHeight: "1.6" }}>
                  You must sign in before you can apply to the launch pad and access the ecosystem.
                </p>
                <a href="/login" className="btn btn-primary" style={{ width: "100%", padding: "16px", justifyContent: "center" }}>
                  Sign In to Continue
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="fullName" style={{ fontWeight: 500, color: "var(--ink-80)", marginBottom: "8px", display: "block" }}>Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="full_name" 
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe" 
                    style={{ padding: "12px", borderRadius: "8px", width: "100%", border: `1px solid ${formErrors.full_name ? 'var(--error, #e3342f)' : 'var(--ink-20)'}` }} 
                  />
                  {formErrors.full_name && <small style={{ color: "var(--error, #e3342f)", display: "block", marginTop: "4px" }}>{formErrors.full_name}</small>}
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="ageGroup" style={{ fontWeight: 500, color: "var(--ink-80)", marginBottom: "8px", display: "block" }}>Age Group</label>
                  <select 
                    id="ageGroup" 
                    name="age_group" 
                    value={formData.age_group}
                    onChange={handleInputChange}
                    style={{ padding: "12px", borderRadius: "8px", border: `1px solid ${formErrors.age_group ? 'var(--error, #e3342f)' : 'var(--ink-20)'}`, width: "100%", background: "var(--bg-card)", color: "var(--ink-80)", fontFamily: "inherit", appearance: "none" }}
                  >
                    <option value="" disabled>Select your age group</option>
                    <option value="Under 18">Under 18</option>
                    <option value="18-24">18–24</option>
                    <option value="25-34">25–34</option>
                    <option value="35+">35+</option>
                  </select>
                  {formErrors.age_group && <small style={{ color: "var(--error, #e3342f)", display: "block", marginTop: "4px" }}>{formErrors.age_group}</small>}
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label htmlFor="email" style={{ fontWeight: 500, color: "var(--ink-80)", marginBottom: "8px", display: "block" }}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="founder@startup.com" 
                    style={{ padding: "12px", borderRadius: "8px", width: "100%", border: `1px solid ${formErrors.email ? 'var(--error, #e3342f)' : 'var(--ink-20)'}` }} 
                  />
                  {formErrors.email && <small style={{ color: "var(--error, #e3342f)", display: "block", marginTop: "4px" }}>{formErrors.email}</small>}
                </div>

                <div className="form-group" style={{ marginBottom: "24px" }}>
                  <label htmlFor="idea" style={{ fontWeight: 500, color: "var(--ink-80)", marginBottom: "8px", display: "block" }}>What are you building? And what stage are you at?</label>
                  <textarea 
                    id="idea" 
                    name="idea_description" 
                    value={formData.idea_description}
                    onChange={handleInputChange}
                    rows={4} 
                    placeholder="Briefly describe your startup idea and current progress..." 
                    style={{ padding: "12px", borderRadius: "8px", width: "100%", border: `1px solid ${formErrors.idea_description ? 'var(--error, #e3342f)' : 'var(--ink-20)'}`, resize: "vertical", fontFamily: "inherit" }}
                  />
                  {formErrors.idea_description && <small style={{ color: "var(--error, #e3342f)", display: "block", marginTop: "4px" }}>{formErrors.idea_description}</small>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                  style={{ 
                    width: "100%", 
                    padding: "16px", 
                    marginTop: "8px", 
                    backgroundColor: showSuccess ? "#00c26b" : "var(--accent)", 
                    color: "#ffffff", 
                    fontWeight: 600, 
                    letterSpacing: "0.5px", 
                    border: "none",
                    transition: "background-color 0.3s ease",
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  }} 
                >
                  {isSubmitting ? (
                    <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Applying...</>
                  ) : showSuccess ? (
                    <><i className="fa-solid fa-check" style={{ marginRight: "8px" }}></i> Application Submitted!</>
                  ) : (
                    "Apply"
                  )}
                </button>

                {showSuccess && (
                  <div className="success-banner" style={{ display: "block", marginTop: "16px", padding: "12px", borderRadius: "8px", background: "rgba(0, 194, 107, 0.1)", color: "#00c26b", textAlign: "center", animation: "fadeIn 0.3s ease" }}>
                    <i className="fa-solid fa-circle-check" style={{ marginRight: "6px" }}></i> 
                    Thank you! Your application has been received.
                  </div>
                )}

                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--ink-20)", fontSize: "0.9rem", color: "var(--ink-60)", textAlign: "center", lineHeight: "1.5" }}>
                  <p style={{ marginBottom: "8px", fontWeight: 500, color: "var(--ink-80)" }}>
                    Create an account to access the Launch Pad ecosystem and connect with founders.
                  </p>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: "0.85rem" }}>
                    <i className="fa-solid fa-shield-halved" style={{ marginRight: "6px" }}></i>
                    Users must sign up before accessing features.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Launch Pad. The operating system for founders.</p>
        </div>
      </footer>
    </>
  );
}
