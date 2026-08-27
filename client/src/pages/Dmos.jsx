import React, { useState } from "react";

const countryCodes = [
  { code: "+971", flag: "🇦🇪", label: "UAE" },
  { code: "+91", flag: "🇮🇳", label: "India" },
  { code: "+1", flag: "🇺🇸", label: "USA" },
  { code: "+44", flag: "🇬🇧", label: "UK" },
];

export default function DMOSSignup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [country, setCountry] = useState(countryCodes[0]);
  const [showCountryMenu, setShowCountryMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Signed in (demo only — no backend connected).");
    }, 900);
  };

  return (
    <div
      style={{ fontFamily: "'Segoe UI', ui-sans-serif, system-ui, sans-serif" }}
      className="min-h-screen w-full bg-[#f5f4f0]"
    >
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left illustration panel */}
        <div className="relative w-full lg:w-1/2 overflow-hidden">
          <img
            src="/one.png"
            alt="Hands assembling a ladder, illustrating structured, dynamic security"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5" />

          {/* overlay logo + heading */}
          <div className="relative z-10 p-9 h-full flex flex-col">
            <Logo light />
            <div className="mt-1 text-white/90 text-[11px] tracking-[0.2em]">
              WE PROTECT YOU
            </div>

            <div className="mt-auto bg-black/30 backdrop-blur-sm p-6 lg:p-7 text-white text-[17px] leading-relaxed max-w-xl">
              Our <span className="font-semibold">DMOS</span> security system is built
              around mathematical precision, dynamic obfuscation, and secure data
              protection. Using a structured mathematical approach, DMOS transforms
              and protects information through dynamic processes designed to make
              unauthorized interpretation significantly more difficult while
              maintaining controlled and reliable access.
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-8 py-14 lg:px-20">
          <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
            <h1 className="text-[2.4rem] font-light text-[#1a1a1a] mb-2 leading-tight">
              Welcome to DMOS
            </h1>
            <p className="text-[#6b6b6b] mb-12 text-sm">Sign-in to complete the task.</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-8">
              <Field
                label="First Name"
                required
                value={form.firstName}
                onChange={handleChange("firstName")}
                error={errors.firstName}
              />
              <Field
                label="Last Name"
                required
                value={form.lastName}
                onChange={handleChange("lastName")}
                error={errors.lastName}
              />

              <div className="col-span-2">
                <Field
                  label="Email Address"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  error={errors.email}
                />
              </div>

              {/* Phone number with country code */}
              <div className="relative">
                <label className="block text-sm text-[#6b6b6b] mb-2">
                  Phone Number <span className="text-[#b5622f]">*</span>
                </label>
                <div className="flex items-end border-b border-[#d8d8d3] focus-within:border-[#1a1a1a] transition-colors">
                  <button
                    type="button"
                    onClick={() => setShowCountryMenu((s) => !s)}
                    className="flex items-center gap-1 pb-2 pr-2 text-sm text-[#1a1a1a] shrink-0"
                  >
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                    <svg width="10" height="10" viewBox="0 0 10 6" className="ml-0.5">
                      <path d="M0 0 L5 6 L10 0 Z" fill="#6b6b6b" />
                    </svg>
                  </button>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    className="w-full bg-transparent pb-2 text-sm outline-none text-[#1a1a1a]"
                  />
                </div>
                {showCountryMenu && (
                  <div className="absolute z-20 mt-1 bg-white border border-[#e5e5e0] rounded-md shadow-lg w-40 overflow-hidden">
                    {countryCodes.map((c) => (
                      <button
                        type="button"
                        key={c.code}
                        onClick={() => {
                          setCountry(c);
                          setShowCountryMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#f5f4f0] flex items-center gap-2"
                      >
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                        <span className="text-[#999] ml-auto">{c.label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.phone && (
                  <p className="text-xs text-[#b5622f] mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-[#6b6b6b] mb-2">Password</label>
                <div className="flex items-end border-b border-[#d8d8d3] focus-within:border-[#1a1a1a] transition-colors">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    className="w-full bg-transparent pb-2 text-sm outline-none text-[#1a1a1a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="pb-2 pl-2 text-[#6b6b6b] shrink-0"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#b5622f] mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#1a1a1a] px-7 py-2.5 text-xs tracking-widest text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-colors disabled:opacity-50"
            >
              {submitting ? "SIGNING IN..." : "SIGN IN"}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 11L11 3M11 3H4M11 3V10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-[#6b6b6b] mb-2">
        {label} {required && <span className="text-[#b5622f]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border-b border-[#d8d8d3] focus:border-[#1a1a1a] bg-transparent pb-2 text-sm outline-none text-[#1a1a1a] transition-colors"
      />
      {error && <p className="text-xs text-[#b5622f] mt-1">{error}</p>}
    </div>
  );
}

function Logo({ dark, light }) {
  const color = light ? "#ffffff" : "#1a1a1a";
  return (
    <div>
      <div className="text-5xl font-semibold tracking-[0.4em]" style={{ color }}>
        DMOS
      </div>
      {/* <img src="/Mask.png" alt="" /> */}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 004.24 4.24M9.9 5.1A10.9 10.9 0 0112 5c7 0 11 7 11 7a17.4 17.4 0 01-3.2 4.1M6.5 6.6C3.7 8.4 1 12 1 12s4 7 11 7c1.4 0 2.7-.26 3.9-.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
