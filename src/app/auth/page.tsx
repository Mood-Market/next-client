"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthView = "signin" | "signup" | "verify";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const { signIn, signUp, verifyCode, isLoading, pendingEmail } = useAuth();

  // Auto-switch to verification view when pendingEmail is set
  if (pendingEmail && currentView !== "verify") {
    setCurrentView("verify");
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      // Will automatically switch to verify view due to pendingEmail
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signUp(email, password, name);
      // Will automatically switch to verify view due to pendingEmail
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await verifyCode(pendingEmail || email, verificationCode);
      // User will be automatically redirected to main app
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setVerificationCode("");
    setError("");
  };

  const switchView = (view: AuthView) => {
    setCurrentView(view);
    resetForm();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#18181b",
          borderRadius: "12px",
          padding: "32px",
          border: "1px solid #27272a",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "8px",
            }}
          >
            Mood Tracker
          </h1>
          <p style={{ fontSize: "14px", color: "#71717a" }}>
            {currentView === "signin" && "Sign in to your account"}
            {currentView === "signup" && "Create a new account"}
            {currentView === "verify" && "Enter verification code"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#7f1d1d",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              marginBottom: "24px",
              fontSize: "14px",
              color: "#fecaca",
            }}
          >
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {currentView === "signin" && (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isLoading ? "#374151" : "#26a69a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginBottom: "16px",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "14px", color: "#71717a" }}>
                Don&apos;t have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => switchView("signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#26a69a",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Sign up
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {currentView === "signup" && (
          <form onSubmit={handleSignUp}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                placeholder="Enter your name"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "14px",
                }}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: isLoading ? "#374151" : "#26a69a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                marginBottom: "16px",
              }}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "14px", color: "#71717a" }}>
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => switchView("signin")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#26a69a",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* Verification Form */}
        {currentView === "verify" && (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#71717a",
                  marginBottom: "24px",
                }}
              >
                We sent a verification code to{" "}
                <strong style={{ color: "#d1d5db" }}>
                  {pendingEmail || email}
                </strong>
              </p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  color: "#d1d5db",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                required
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "18px",
                  textAlign: "center",
                  letterSpacing: "4px",
                }}
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor:
                  isLoading || verificationCode.length !== 6
                    ? "#374151"
                    : "#26a69a",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  isLoading || verificationCode.length !== 6
                    ? "not-allowed"
                    : "pointer",
                marginBottom: "16px",
              }}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => switchView("signin")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#71717a",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Back to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
