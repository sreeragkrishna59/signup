import axios from 'axios'
import { storeData } from '../Redux/userSlice';
import { publicRequest } from './axiosPage';

// Builds FormData from a plain object, skipping undefined/null values.
function toFormData(obj) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}

async function signupData(values) {
  try {
    const formData = toFormData(values);
    let backendData = await publicRequest.post(`/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return { success: true, data: backendData.data };
  } catch (err) {
    console.error("signupData error:", err.response);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function loginData(values, dispatch) {
  try {
    let backendData = await publicRequest.post(`/login`, values);
    console.log("login success check", backendData.data);
    dispatch(storeData(backendData.data));
    return { success: true, message: backendData.data.message };
  } catch (err) {
    console.error("login error check", err.response);
    return {
      success: false,
      message: err.response?.data?.message || "Login failed. Please try again."
    };
  }
}

async function getHome(id, token) {
  try {
    let singleData = await publicRequest.get(`/getData/${id}`, { headers: { token } });
    console.log("********************", singleData.data.SingleData);
    return { success: true, data: singleData.data.SingleData };
  } catch (err) {
    console.error("err message from getHome", err.response);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function updateUser(id, token, data) {
  try {
    const formData = toFormData(data);
    let singleData = await publicRequest.put(`/updateUser/${id}`, formData, {
      headers: { token, "Content-Type": "multipart/form-data" }
    });
    console.log("********************", singleData.data.SingleData);
    return { success: true, data: singleData.data.SingleData };
  } catch (err) {
    console.error("err message from updateUser", err.response);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function deleteUser(id, token) {
  try {
    let resBackend = await publicRequest.delete(`/deleteData/${id}`, { headers: { token } });
    console.log("delete update", resBackend);
    return { success: !!resBackend.data.success, data: resBackend.data };
  } catch (err) {
    console.error("err in delete methods", err.response);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function sendOTPRequest(email) {
  try {
    let res = await publicRequest.post('/verifyOTP', { email: email.popupEmail });
    return { success: !!res.data.success, data: res.data };
  } catch (err) {
    console.error("sendOTPRequest error:", err.response);
    return { success: false, error: err.response?.data || err.message };
  }
}

async function verifyOTP(email, otp) {
  try {
    let res = await publicRequest.post('/verifyOTPstep1', { email, otp });
    return { success: true, data: res.data };
  } catch (err) {
    console.error('verifyOTP error:', err.response);
    return { success: false, error: err.response };
  }
}

async function passwordReset(email, password) {
  try {
    console.log("...................",email,password);
    
    let res = await publicRequest.post('/resetPassword',{email,password});
    return { success: true, data: res.data };
  } catch (err) {
    console.error('passwordReset error:', err.response);
    return { success: false, error: err.response };
  }
}

export { signupData, loginData, getHome, updateUser, deleteUser, sendOTPRequest, verifyOTP, passwordReset }