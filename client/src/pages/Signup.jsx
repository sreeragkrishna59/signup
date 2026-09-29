import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { signupData } from './api';

const Signup = () => {
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      age: '',
      address: '',
      image: null,
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Too short').required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      mobile: Yup.string().matches(/^[0-9]{10}$/, '10 digits required').required('Required'),
      age: Yup.number().typeError('Must be a number').min(18, '18+ only').max(120, 'Invalid').required('Required'),
      address: Yup.string().min(10, 'Too short').required('Required'),
      image: Yup.mixed().required('Image required'),
      password: Yup.string().min(8, 'Min 8 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setMsg('');
      setError('');

      const result = await signupData(values);
      console.log('signup result', result);

      if (result.success) {
        // Signup success -> show message, then go to login page
        setMsg(result.data?.message || 'User registered successfully');
        setTimeout(() => {
          navigate('/'); // login page
        }, 2000);
      } else {
        // Signup failed -> stay on this page and show the error
        const errMsg =
          typeof result.error === 'string'
            ? result.error
            : result.error?.message || 'Signup failed. Please try again.';
        setError(errMsg);
        setSubmitting(false);
      }
    },
  });

  // Reusable compact styling classes
  const inputClass =
    'w-full px-2.5 py-1 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-0.5';
  const errorClass = 'text-[10px] text-red-500 mt-0.5 leading-none';

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-3 font-sans">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-5 border border-blue-100">
        {/* Compact Header */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-blue-900">Create Account</h2>

          {msg && <p className="text-sm font-semibold text-green-500 mt-1">{msg}</p>}
          {error && <p className="text-sm font-semibold text-red-500 mt-1">{error}</p>}

          <p className="text-[11px] text-blue-500 mt-0.5">Quick & simple registration</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Name */}
            <div className="col-span-2">
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={inputClass}
              />
              {formik.touched.name && formik.errors.name && (
                <p className={errorClass}>{formik.errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="col-span-2">
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

            {/* Mobile */}
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input
                type="text"
                name="mobile"
                placeholder="1234567890"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
                className={inputClass}
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className={errorClass}>{formik.errors.mobile}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className={labelClass}>Age</label>
              <input
                type="number"
                name="age"
                placeholder="18"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.age}
                className={inputClass}
              />
              {formik.touched.age && formik.errors.age && (
                <p className={errorClass}>{formik.errors.age}</p>
              )}
            </div>

            {/* Password */}
            <div className="col-span-2">
              <label className={labelClass}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={inputClass}
              />
              {formik.touched.password && formik.errors.password && (
                <p className={errorClass}>{formik.errors.password}</p>
              )}
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className={labelClass}>Address</label>
              <textarea
                name="address"
                rows="2"
                placeholder="Enter full address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                className={`${inputClass} resize-none`}
              />
              {formik.touched.address && formik.errors.address && (
                <p className={errorClass}>{formik.errors.address}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label className={labelClass}>Profile Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  formik.setFieldValue('image', event.currentTarget.files[0]);
                }}
                onBlur={formik.handleBlur}
                className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
              />
              {formik.touched.image && formik.errors.image && (
                <p className={errorClass}>{formik.errors.image}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {formik.isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <Link to={'/'} className="text-[11px] font-semibold text-blue-600 hover:underline">
          I already have an account?
        </Link>
      </div>
    </div>
  );
};

export default Signup;
