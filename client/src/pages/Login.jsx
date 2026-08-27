import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router';
import { loginData } from './api';
import { useDispatch } from 'react-redux';

const Login = () => {
 const dispatch=useDispatch()
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
    onSubmit: (values) => {
      console.log('Login Submitted', values);
loginData(values,dispatch)
    },
  });

  const inputClass = "w-full px-2.5 py-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-white transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-0.5";
  const errorClass = "text-[10px] text-red-500 mt-0.5 leading-none";

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-3 font-sans">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-5 border border-blue-100">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">Welcome Back</h2>
          <p className="text-[11px] text-blue-500 mt-0.5">Please enter your details to sign in</p>
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
              className={inputClass}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={errorClass}>{formik.errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 text-gray-600 cursor-pointer">

               <Link to={'/signup'} className="text-[11px] font-semibold text-blue-600 hover:underline">
              Create an account?
            </Link>
            </label>
            <a href="#forgot" className="text-[11px] font-semibold text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;