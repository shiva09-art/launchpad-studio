"use client";

import React, { useState } from "react";
import { signInWithOtp, verifyOtp } from "../../lib/supabase";

const AGE_GROUPS = ["18-24", "25-34", "35-44", "45+"];

export default function LoginPage() {
  const [step, setStep] = useState<"signup" | "verify" | "done">("signup");
  const [fullName, setFullName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !ageGroup || !email) {
      setError("Please fill out all fields.");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      // Pass the user data into our updated signInWithOtp function
      await signInWithOtp(email, {
        full_name: fullName,
        age_group: ageGroup
      });
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the verification code.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep("done");
      // Redirect to the messaging dashboard (using "/" as per current routing)
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header id="header" className="scrolled">
        <div className="container nav-container">
          <a href="/" className="logo">
            <img src="/logo.jpg" alt="Launchpad Logo" style={{ height: "40px", borderRadius: "8px" }} />
            Launch Pad
          </a>
          <nav className="nav-links">
            <a href="/#ecosystem">Ecosystem</a>
            <a href="/#roadmap">Roadmap</a>
          </nav>
        </div>
      </header>

      <div className="section container onboarding-wrapper">
        <div className="onboarding-form">
          {/* Progress Indicator */}
          <div className="stepper">
            <div className={`step-item ${step === "signup" || step === "verify" || step === "done" ? "completed" : ""}`}>
              <div className="step-circle">1</div>
              <span>Sign Up</span>
            </div>
            <div className={`step-item ${step === "verify" ? "active" : step === "done" ? "completed" : ""}`}>
              <div className="step-circle">2</div>
              <span>Verify Gmail</span>
            </div>
            <div className={`step-item ${step === "done" ? "completed" : ""}`}>
              <div className="step-circle">3</div>
              <span>Start Messaging</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>
              {step === "signup" ? "Create your account" : "Verify your email"}
            </h2>
            <p className="required-msg">
              Please sign up and verify your Gmail account to start sending messages.
            </p>
          </div>

          {error && (
            <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "24px", border: "1px solid #f87171" }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "6px" }}></i>
              {error}
            </div>
          )}

          {step === "signup" ? (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label style={{ color: "var(--ink-60)" }}>Full Name</label>
                <input 
                  type="text" 
                  className="modern-input"
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  required 
                  placeholder="John Doe" 
                />
              </div>

              <div className="form-group">
                <label style={{ color: "var(--ink-60)" }}>Age Group</label>
                <div className="chip-group">
                  {AGE_GROUPS.map((group) => (
                    <div 
                      key={group}
                      className={`chip ${ageGroup === group ? "selected" : ""}`}
                      onClick={() => setAgeGroup(group)}
                    >
                      {group}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ color: "var(--ink-60)" }}>Gmail Address</label>
                <input 
                  type="email" 
                  className="modern-input"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  placeholder="founder@gmail.com" 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px", marginTop: "12px", fontSize: "1rem" }} disabled={loading}>
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Sending Code...</>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ animation: "fadeInUp 0.4s var(--ease) forwards" }}>
              <div className="form-group">
                <label style={{ color: "var(--ink-60)", textAlign: "center", display: "block" }}>
                  Enter the 6-digit code sent to <br /><strong>{email}</strong>
                </label>
                <input 
                  type="text" 
                  className="modern-input"
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  required 
                  placeholder="123456"
                  style={{ letterSpacing: "8px", fontSize: "1.5rem", textAlign: "center", marginTop: "12px" }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px", marginTop: "12px", fontSize: "1rem" }} disabled={loading}>
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Verifying...</>
                ) : (
                  "Verify & Start Messaging"
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep("signup")} 
                className="btn btn-outline" 
                style={{ width: "100%", padding: "12px", marginTop: "12px", border: "none", color: "var(--ink-40)" }}
              >
                Back to Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
