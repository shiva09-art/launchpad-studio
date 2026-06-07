"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToForm = () => {
    document.getElementById("contactForm")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = formRef.current;
    if (!form) return;

    const fname = form.elements.namedItem("first_name") as HTMLInputElement;
    const lname = form.elements.namedItem("last_name") as HTMLInputElement;
    const contactDetail = form.elements.namedItem("email_or_whatsapp") as HTMLInputElement;
    const idea = form.elements.namedItem("idea_description") as HTMLTextAreaElement;
    const help = form.elements.namedItem("challenge") as HTMLInputElement;

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
    
    const contactVal = contactDetail.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+\d\s\-]{7,20}$/;
    if (!emailPattern.test(contactVal) && !phonePattern.test(contactVal.replace(/\s/g, ""))) {
      showErr(contactDetail);
    }
    
    if (idea.value.trim().length < 15) showErr(idea);
    if (!help.value.trim()) showErr(help);

    if (!valid) return;

    setIsSubmitting(true);

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        form.reset();
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 4000);
      } else {
        throw new Error("Formspree error");
      }
    } catch (error) {
      alert("Transmission failure. Please re-submit your idea form details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header id="siteHeader" className={navScrolled ? "scrolled" : ""}>
        <div className="container navbar">
          <a href="#home" className="logo" aria-label="Launch Pad home">
            <img src="/logo.jpg" alt="Launchpad Logo" style={{ height: "40px", borderRadius: "8px" }} />
          </a>

          <ul className={`nav-links ${menuOpen ? "active" : ""}`} id="navLinks" role="navigation" aria-label="Main navigation">
            <li><a href="#problems" onClick={closeMenu}>Problems</a></li>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#how" onClick={closeMenu}>Process</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="/login" onClick={closeMenu} style={{ fontWeight: 600 }}>Sign In</a></li>
            <li><a href="/register" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: "0.88rem" }} onClick={closeMenu}>Sign Up</a></li>
          </ul>

          <button className="menu-btn" id="menuBtn" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={toggleMenu}>
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} id="menuIcon"></i>
          </button>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-inner container">
          <div className="hero-eyebrow reveal">
            <i className="fa-solid fa-seedling"></i>
            For Students & First-Time Founders
          </div>

          <h1 className="reveal reveal-delay-1">
            Turn your idea into<br /><em>a clear startup plan.</em>
          </h1>

          <p className="hero-sub reveal reveal-delay-2">
            Launch Pad helps early founders validate ideas, understand next steps, and prepare for pitch conversations without fake promises or confusing startup jargon.
          </p>

          <div className="hero-actions reveal reveal-delay-3">
            <a href="#contact" className="btn btn-primary">
              Submit My Idea
              <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i>
            </a>
            <a href="#how" className="btn btn-ghost">See the Process</a>
          </div>

          <div className="hero-social-proof reveal reveal-delay-4">
            <div className="proof-item">
              <span className="proof-number">🎓 Student-Focused</span>
              <span className="proof-label">Built for first-time founders</span>
            </div>
            <div className="proof-divider" aria-hidden="true"></div>
            <div className="proof-item">
              <span className="proof-number">⚡ 3–5 Day Feedback</span>
              <span className="proof-label">Initial review turnaround</span>
            </div>
            <div className="proof-divider" aria-hidden="true"></div>
            <div className="proof-item">
              <span className="proof-number">🌍 Open to All</span>
              <span className="proof-label">Global early access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section problem-section" id="problems">
        <div className="container">
          <div className="section-heading">
            <span className="section-label">The Problem</span>
            <h2>Many ideas fail early because they start without clarity.</h2>
            <p className="subtext">Not always because the idea is bad, but because beginners often start without validation, roadmap, or clear execution steps.</p>
          </div>

          <div className="problems-grid">
            <div className="problem-card reveal">
              <div className="problem-icon"><i className="fa-solid fa-magnifying-glass-chart"></i></div>
              <h3>No real validation</h3>
              <p>Many founders build before checking whether the problem is real and whether people actually care.</p>
            </div>
            <div className="problem-card reveal reveal-delay-1">
              <div className="problem-icon"><i className="fa-solid fa-map"></i></div>
              <h3>No clear roadmap</h3>
              <p>A big idea without a step-by-step plan becomes confusing very quickly.</p>
            </div>
            <div className="problem-card reveal reveal-delay-2">
              <div className="problem-icon"><i className="fa-solid fa-file-signature"></i></div>
              <h3>Documentation confusion</h3>
              <p>Basic documents, registrations, and pitch material can feel complicated for first-time founders.</p>
            </div>
            <div className="problem-card reveal reveal-delay-3">
              <div className="problem-icon"><i className="fa-solid fa-comments"></i></div>
              <h3>Weak pitch clarity</h3>
              <p>Many founders cannot explain the problem, solution, users, and business model clearly.</p>
            </div>
            <div className="problem-card reveal reveal-delay-4">
              <div className="problem-icon"><i className="fa-solid fa-signs-post"></i></div>
              <h3>Stuck on next steps</h3>
              <p>The biggest question is often simple: what should I do next?</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-heading reveal">
            <span className="section-label">What We Do</span>
            <h2>Four simple ways we help early founders move forward.</h2>
            <p className="subtext">The goal is not to promise funding. The goal is to give you clarity, structure, and a better first direction.</p>
          </div>
          <div className="services-grid">
            <div className="service-card reveal">
              <span className="service-number" aria-hidden="true">01</span>
              <div className="service-icon"><i className="fa-solid fa-circle-check"></i></div>
              <h3>Idea Validation</h3>
              <p>We help you check whether your idea solves a real problem, who the users are, and what assumptions need testing first.</p>
              <div className="service-tags">
                <span className="tag">Problem Check</span>
                <span className="tag">User Clarity</span>
                <span className="tag">Assumption Testing</span>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-1">
              <span className="service-number" aria-hidden="true">02</span>
              <div className="service-icon"><i className="fa-solid fa-compass"></i></div>
              <h3>Startup Roadmap</h3>
              <p>We convert your raw idea into practical next steps: what to research, what to build first, and how to avoid unnecessary work.</p>
              <div className="service-tags">
                <span className="tag">MVP Direction</span>
                <span className="tag">90-Day Plan</span>
                <span className="tag">Execution Steps</span>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-2">
              <span className="service-number" aria-hidden="true">03</span>
              <div className="service-icon"><i className="fa-solid fa-folder-open"></i></div>
              <h3>Documentation Support</h3>
              <p>We guide you with basic startup documents like idea notes, one-page plans, pitch outlines, and registration direction when needed.</p>
              <div className="service-tags">
                <span className="tag">One-Page Plan</span>
                <span className="tag">Pitch Outline</span>
                <span className="tag">Basic Docs</span>
              </div>
            </div>
            <div className="service-card reveal reveal-delay-3">
              <span className="service-number" aria-hidden="true">04</span>
              <div className="service-icon"><i className="fa-solid fa-chart-line"></i></div>
              <h3>Pitch Preparation</h3>
              <p>We help you prepare for early pitch conversations by making your problem, solution, target users, and next milestones clearer.</p>
              <div className="service-tags">
                <span className="tag">Pitch Clarity</span>
                <span className="tag">Founder Story</span>
                <span className="tag">Milestones</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section how-bg" id="how">
        <div className="container">
          <div className="section-heading reveal">
            <span className="section-label">The Process</span>
            <h2>From raw idea to clearer startup direction in 3 steps.</h2>
            <p className="subtext">Simple, honest, and beginner-friendly.</p>
          </div>
          <div className="steps-track">
            <div className="step reveal">
              <div className="step-circle">1</div>
              <h3>Submit your idea</h3>
              <p>Share what you are trying to build, who it is for, and where you are stuck.</p>
              <div className="step-outcome"><i className="fa-solid fa-check"></i> Takes 5 minutes</div>
            </div>
            <div className="step reveal reveal-delay-2">
              <div className="step-circle">2</div>
              <h3>Get structured feedback</h3>
              <p>We review the idea and give practical feedback on problem clarity, users, MVP direction, and next steps.</p>
              <div className="step-outcome"><i className="fa-solid fa-check"></i> 3–5 days</div>
            </div>
            <div className="step reveal reveal-delay-4">
              <div className="step-circle">3</div>
              <h3>Move forward with clarity</h3>
              <p>You get a cleaner direction before spending serious time, money, or effort.</p>
              <div className="step-outcome"><i className="fa-solid fa-check"></i> Beginner friendly</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container">
          <div className="section-heading reveal" style={{ textAlign: "left", maxWidth: "100%", marginBottom: "var(--sp-md)" }}>
            <span className="section-label">About Launch Pad</span>
            <h2>Built by a student founder solving early-stage confusion.</h2>
            <p className="subtext">Launch Pad is currently in its early stage and is collecting feedback from students, freshers, and first-time founders.</p>
          </div>
          <div className="about-grid">
            <div className="about-card reveal">
              <h3>Early-stage and honest.</h3>
              <p>Launch Pad is not claiming to be a big accelerator or a guaranteed funding platform. It is a practical support system for beginners who want to understand whether their idea has potential and what to do next.</p>
            </div>
            <div className="value-list reveal reveal-delay-2">
              <div className="value-row">
                <div className="value-icon"><i className="fa-solid fa-bullseye"></i></div>
                <div className="value-content">
                  <h4>Clarity over hype</h4>
                  <p>We focus on clear thinking, realistic planning, and practical next steps.</p>
                </div>
              </div>
              <div className="value-row">
                <div className="value-icon"><i className="fa-solid fa-shield-halved"></i></div>
                <div className="value-content">
                  <h4>Honest feedback</h4>
                  <p>If an idea needs improvement or a pivot, the feedback will be direct and useful.</p>
                </div>
              </div>
              <div className="value-row">
                <div className="value-icon"><i className="fa-solid fa-list-check"></i></div>
                <div className="value-content">
                  <h4>Actionable roadmap</h4>
                  <p>Instead of only giving motivation, we help break the idea into steps.</p>
                </div>
              </div>
              <div className="value-row">
                <div className="value-icon"><i className="fa-solid fa-user-graduate"></i></div>
                <div className="value-content">
                  <h4>Beginner-first approach</h4>
                  <p>Designed for students, freshers, and first-time founders who are starting from zero.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div className="contact-left reveal">
            <span className="section-label">Start Today</span>
            <h2>Have an idea? Get early feedback.</h2>
            <p>Tell us about your idea and where you are stuck. We will review it and respond with practical guidance.</p>
            <div className="checklist">
              <div className="check-item"><span className="check-dot"><i className="fa-solid fa-check"></i></span>Idea validation feedback</div>
              <div className="check-item"><span className="check-dot"><i className="fa-solid fa-check"></i></span>Beginner-friendly startup roadmap</div>
              <div className="check-item"><span className="check-dot"><i className="fa-solid fa-check"></i></span>Pitch conversation preparation</div>
              <div className="check-item"><span className="check-dot"><i className="fa-solid fa-check"></i></span>Early access founder list</div>
            </div>
            <div className="calendar-placeholder" id="scrollToFormBtn" onClick={scrollToForm}>
              <div className="calendar-icon"><i className="fa-solid fa-envelope-open-text"></i></div>
              <h3>Join the early founder list</h3>
              <p>Want updates, templates, and early access? Submit your email through the form.</p>
              <a href="#contactForm" className="btn btn-dark"><i className="fa-solid fa-arrow-down" style={{ marginRight: "6px" }}></i> Go to Form</a>
            </div>
          </div>
          
          <div className="form-card reveal reveal-delay-2">
            <h3>Submit your idea</h3>
            <form id="contactForm" ref={formRef} action="https://formspree.io/f/mgorgjpg" method="POST" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">First Name</label>
                  <input type="text" id="fname" name="first_name" placeholder="Arjun" autoComplete="given-name" />
                  <small className="error-msg">Please enter your first name.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last Name</label>
                  <input type="text" id="lname" name="last_name" placeholder="Mehta" autoComplete="family-name" />
                  <small className="error-msg">Please enter your last name.</small>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="contactDetail">Email (or WhatsApp)</label>
                <input type="text" id="contactDetail" name="email_or_whatsapp" placeholder="email@domain.com or +91 98765 43210" autoComplete="email" />
                <small className="error-msg">Please enter a valid email or phone number.</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="stage">Where are you right now?</label>
                <select id="stage" name="stage" defaultValue="">
                  <option value="" disabled>Select your current stage</option>
                  <option value="just-an-idea">Just an idea, haven't started</option>
                  <option value="researching">Researching and validating</option>
                  <option value="building-mvp">Building an MVP</option>
                  <option value="launched">Launched, looking for traction</option>
                  <option value="pitch-prep">Preparing to pitch or explain the idea</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="idea">Describe your idea</label>
                <textarea id="idea" name="idea_description" placeholder="What problem are you solving? Who is it for? What is your possible solution?"></textarea>
                <small className="error-msg">Please describe your idea in at least 15 characters.</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="help">What is your biggest challenge right now?</label>
                <input type="text" id="help" name="challenge" placeholder="e.g. I don't know if people will use this" />
                <small className="error-msg">Please tell us your main challenge.</small>
              </div>
              
              <button type="submit" id="submitBtn" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", backgroundColor: showSuccess ? "var(--green)" : "" }} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "6px" }}></i> Submitting Plan...</>
                ) : showSuccess ? (
                  <><i className="fa-solid fa-check" style={{ marginRight: "6px" }}></i> Dispatched!</>
                ) : (
                  <>Send My Idea <i className="fa-solid fa-arrow-right" style={{ marginLeft: "6px" }}></i></>
                )}
              </button>
              
              <p style={{ fontSize: "0.78rem", color: "var(--ink-40)", textAlign: "center", marginTop: "12px" }}>
                <i className="fa-solid fa-lock" style={{ fontSize: "0.7rem", marginRight: "4px" }}></i> 
                Your idea will not be shared publicly without permission.
              </p>
              
              {showSuccess && (
                <div className="success-banner" id="successBanner" style={{ display: "block" }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: "6px" }}></i> 
                  Thank you! Your idea has been submitted. We will review it and respond soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo" style={{ marginBottom: "12px" }}>
                <img src="/logo.jpg" alt="Launchpad Logo" style={{ height: "40px", borderRadius: "8px" }} />
              </div>
              <p>Helping students and first-time founders move from raw idea to clearer startup direction.</p>
            </div>
            <div className="footer-links">
              <h4>Navigate</h4>
              <ul>
                <li><a href="#problems">Problems</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#how">Process</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Focus</h4>
              <ul>
                <li><a href="#services">Idea Validation</a></li>
                <li><a href="#services">Startup Roadmap</a></li>
                <li><a href="#services">Pitch Preparation</a></li>
                <li><a href="#contact">Early Feedback</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Status</h4>
              <ul>
                <li><a href="#about">Early Stage</a></li>
                <li><a href="#contact">Open for Feedback</a></li>
                <li><a href="#contact">Global Early Users</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Launch Pad. All rights reserved.</p>
            <div className="socials">
              <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Twitter / X"><i className="fa-brands fa-x-twitter"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
