import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router';
import { loginData, passwordReset, sendOTPRequest, verifyOTP } from './api';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const [check1, setCheck] = useState(null);

  // Formik Logic for Main Login
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      const result = await loginData(values, dispatch);
      setMessage(result.message);
    },
  });

  const inputClass =
    'w-full px-2.5 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-0.5';
  const errorClass = 'text-[10px] text-red-500 mt-0.5 leading-none';

  // Popup States
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Popup Form Input states
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Modal open
  const openPopup = () => {
    setStep(1);
    setCheck(null);
    setIsOpen(true);
  };

  // Modal close & Reset
  const closePopup = () => {
    setIsOpen(false);
    setStep(1);
    setCheck(null);
    setOtp('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    popupFormik.resetForm();
  };

  const popupFormik = useFormik({
    initialValues: {
      popupEmail: '',
    },
    validationSchema: Yup.object({
      popupEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      setEmail(values.popupEmail);
      setStep(2); // Step 2 shows the loading spinner until check1 is set
      setCheck(null);

      const result = await sendOTPRequest(values);

      if (result.success) {
        setCheck(result.data); // API response received, OTP input UI shows
      } else {
        setStep(1); // Error -> back to step 1
        alert(result.error?.message || 'Failed to send OTP. Please try again.');
      }
    },
  });

  const handleChangeotpEmail = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);

    const result = await verifyOTP(email, otp);

    if (result.success && result.data?.success) {
      setStep(3);
      alert(result.data?.message || 'OTP verified successfully');
    } else {
      const errMsg = result.error?.data?.message || 'Invalid OTP. Please try again.';
      alert(errMsg);
    }

    setIsVerifying(false);
  };

  const resetAndUpdatePass = async () => {
    if (!password || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const result = await passwordReset(email, password);

    setIsSubmitting(false);

    if (result.success && result.data?.status) {
      alert('Password updated successfully!');
      closePopup();
    } else {
      const errMsg = result.error?.data?.message || 'Failed to reset password. Please try again.';
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-3 font-sans">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-5 border border-blue-100">
        {/* Header */}
        <div className="text-center mb-4">
          {message && (
            <h2 className="text-sm font-medium text-red-400 mb-1">{message}</h2>
          )}
          <h2 className="text-xl font-bold text-blue-900">Welcome Back</h2>
          <p className="text-[11px] text-blue-500 mt-0.5">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={inputClass}
            />
            {formik.touched.email && formik.errors.email && (
              <p className={errorClass}>{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              minLength={8}
              className={inputClass}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={errorClass}>{formik.errors.password}</p>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-xs pt-1">
            <Link
              to={'/signup'}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              Create an account?
            </Link>

            <button
              type="button"
              onClick={openPopup}
              className="text-[11px] font-semibold text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              ✕
            </button>

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={popupFormik.handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    Forgot Password
                  </h2>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter your registered email address to receive an OTP.
                  </p>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="popupEmail"
                    placeholder="enter your email..."
                    onChange={popupFormik.handleChange}
                    onBlur={popupFormik.handleBlur}
                    value={popupFormik.values.popupEmail}
                    className={`w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border ${
                      popupFormik.touched.popupEmail &&
                      popupFormik.errors.popupEmail
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 placeholder:text-gray-400`}
                  />
                  {popupFormik.touched.popupEmail &&
                    popupFormik.errors.popupEmail && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {popupFormik.errors.popupEmail}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={popupFormik.isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send OTP
                </button>
              </form>
            )}

            {/* STEP 2: Loading OR Enter OTP */}
            {step === 2 && (
              <>
                {!check1 ? (
                  /* Loading Spinner */
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-medium text-gray-500 animate-pulse">
                      Sending OTP to your email...
                    </p>
                  </div>
                ) : (
                  /* OTP Input UI */
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        Enter OTP
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        We have sent a verification code to{' '}
                        <span className="font-semibold text-gray-700">{email}</span>.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 123456"
                        value={otp}
                        onChange={handleChangeotpEmail}
                        className="w-full px-3 py-2 text-center tracking-widest font-mono text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 placeholder:text-gray-400 placeholder:font-sans placeholder:tracking-normal"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={handleVerifyOTP}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* STEP 3: Reset Password */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Reset Password
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={resetAndUpdatePass}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
