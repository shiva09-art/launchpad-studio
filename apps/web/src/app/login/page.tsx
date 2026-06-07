"use client";

import React, { useState } from "react";
import { signInWithOtp, verifyOtp } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithOtp(email);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      // Redirect to a dashboard or homepage upon successful sign in
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
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

      <div className="section container" style={{ maxWidth: "500px", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: "120px" }}>
          <div className="form-box" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>Welcome Back</h2>
            <p className="subtext" style={{ marginBottom: "32px", fontSize: "0.95rem", margin: "0 auto 32px" }}>
              {step === "email" 
                ? "Enter your email to receive a secure one-time password." 
                : "Enter the 8-digit secure code sent to your email."}
            </p>
            
            {error && (
              <div style={{ padding: "12px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "20px", border: "1px solid #f87171" }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "6px" }}></i>
                {error}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleSendOtp} style={{ textAlign: "left" }}>
                  <div className="form-group">
                    <label style={{ color: "var(--ink-60)" }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      placeholder="founder@startup.com" 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px" }} disabled={loading}>
                    {loading ? (
                      <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Sending Code...</>
                    ) : (
                      "Send Security Code"
                    )}
                  </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} style={{ textAlign: "left" }}>
                  <div className="form-group">
                    <label style={{ color: "var(--ink-60)" }}>Secure Code (OTP)</label>
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                      required 
                      placeholder="12345678"
                      style={{ letterSpacing: "4px", fontSize: "1.2rem", textAlign: "center" }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "16px" }} disabled={loading}>
                    {loading ? (
                      <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Verifying...</>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep("email")} 
                    className="btn btn-outline" 
                    style={{ width: "100%", padding: "12px", marginTop: "12px", border: "none", color: "var(--ink-40)" }}
                  >
                    Use a different email
                  </button>
              </form>
            )}
          </div>
      </div>
    </>
  );
}
