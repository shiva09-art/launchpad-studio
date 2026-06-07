"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = formRef.current;
    if (!form) return;

    const fname = form.elements.namedItem("first_name") as HTMLInputElement;
    const lname = form.elements.namedItem("last_name") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const idea = form.elements.namedItem("idea_description") as HTMLTextAreaElement;

    form.querySelectorAll(".error-msg").forEach(el => {
      (el as HTMLElement).style.display = "none";
    });

    let valid = true;
    const showErr = (input: HTMLElement) => {
      const errorMsg = input.parentElement?.querySelector(".error-msg") as HTMLElement;
      if (errorMsg) errorMsg.style.display = "block";
      valid = false;
    };

    if (!fname.value.trim()) showErr(fname);
    if (!lname.value.trim()) showErr(lname);
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) showErr(email);
    
    if (idea.value.trim().length < 5) showErr(idea);

    if (!valid) return;

    setIsSubmitting(true);

    try {
      const data = new FormData(form);
      const res = await fetch("https://formspree.io/f/mgorgjpg", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        form.reset();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error("Formspree error");
      }
    } catch (error) {
      alert("Transmission failure. Please re-submit your details.");
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
            <a href="#apply" className="btn btn-primary"><i className="fa-solid fa-bolt" style={{ marginRight: '6px' }}></i> Start Building</a>
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
            
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <a href="http://localhost:5000/auth/google" className="btn btn-google" style={{ flex: 1, minWidth: "140px" }}><i className="fa-brands fa-google" style={{ marginRight: '6px' }}></i> Google</a>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--ink-40)", textAlign: "center" }}>Or apply with email below</p>
          </div>

          <div className="form-box">
            <form id="applyForm" ref={formRef} action="https://formspree.io/f/mgorgjpg" method="POST" onSubmit={handleSubmit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input type="text" id="fname" name="first_name" required />
                  <small className="error-msg">Please enter your first name.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input type="text" id="lname" name="last_name" required />
                  <small className="error-msg">Please enter your last name.</small>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Work Email</label>
                <input type="email" id="email" name="email" required />
                <small className="error-msg">Please enter a valid email address.</small>
              </div>
              <div className="form-group">
                <label htmlFor="idea">What are you building? (One sentence)</label>
                <textarea id="idea" name="idea_description" rows={2} required></textarea>
                <small className="error-msg">Please describe your idea.</small>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px", marginTop: "8px", backgroundColor: showSuccess ? "#00c26b" : "" }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "6px" }}></i> Applying...</>
                ) : showSuccess ? (
                  <><i className="fa-solid fa-check" style={{ marginRight: "6px" }}></i> Application Submitted!</>
                ) : (
                  "Apply for Access"
                )}
              </button>

              {showSuccess && (
                <div className="success-banner" style={{ display: "block" }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: "6px" }}></i> 
                  Thank you! Your application has been received.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2026 Launch Pad. The operating system for founders.</p>
        </div>
      </footer>
    </>
  );
}
