"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  FileSearch,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { FormState, signUpAction } from "../auth/actions";

export default function SignUp() {
  const initialState: FormState = {
    error: null,
  };

  const [showPw, setShowPw] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );

  // Input Style Object to keep JSX clean
  const inputStyle = {
    width: "100%",
    background: "#161616",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    padding: "11px 14px 11px 40px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.50)",
    marginBottom: 8,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };

  // if (state?.error === 'Email confirmation required') {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#080808/10', fontFamily: "'DM Sans', sans-serif" }}>
  //       <div className="w-full max-w-md text-center p-8 rounded-[20px]" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)' }}>
  //         <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(200,255,94,0.1)' }}>
  //           <CheckCircle className="h-8 w-8" style={{ color: '#C8FF5E' }} />
  //         </div>
  //         <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Instrument Serif', serif" }}>Check your email</h1>
  //         <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
  //           We sent a confirmation link to <span className="text-white font-medium">{formData.email}</span>.
  //         </p>
  //         <Link href="/signin" className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm transition-all" style={{ background: '#C8FF5E', color: '#000' }}>
  //           Go to Sign In
  //         </Link>
  //       </div>
  //     </div>
  //   )
  // }


  console.log("state",state)

  return (
    <div
      className="min-h-screen grid-bg flex flex-col"
      style={{ background: "#080808/10", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Nav */}
      <nav className="px-6 py-5 md:py-1">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "#C8FF5E" }}
          >
            <FileSearch className="h-4 w-4 text-black" />
          </div>
          <span className="font-bold text-white text-[15px]">HireBoost</span>
        </Link>
      </nav>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center px-4 ">
        <div className="w-full max-w-md fade-up-d1">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Create an account
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
              3 free analyses every month — no credit card needed
            </p>
          </div>

          <div
            style={{
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "32px",
            }}
          >
            {state?.error && (
              <div
                className="flex items-start gap-2.5 p-3 rounded-xl mb-5"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                }}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p style={{ fontSize: 13 }}>{state?.error}</p>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={pending}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={pending}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={pending}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{
                      color: "rgba(255,255,255,0.25)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={pending}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 py-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 accent-[#C8FF5E]"
                  style={{ cursor: "pointer" }}
                />
                <label
                  htmlFor="terms"
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    lineHeight: "1.4",
                  }}
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-white hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={pending || !agreeToTerms}
                style={{
                  width: "100%",
                  background:
                    pending || !agreeToTerms
                      ? "rgba(200,255,94,0.4)"
                      : "#C8FF5E",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  cursor: pending ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {pending ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid #000",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p
            className="text-center mt-6"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}
          >
            Already have an account?{" "}
            <Link href="/signin" style={{ color: "#C8FF5E", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
