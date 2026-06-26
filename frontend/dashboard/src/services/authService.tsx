import api from "../api/axios";

//SEND OTP
export const sendOTP = async (data: any) => {
  const response = await api.post("/auth/send-otp", data);
  return response.data;
};

// SIGN UP
export const startRegistration = async (data: any) => {
  const response = await api.post(
    "/auth/startRegistration",
    data
  );
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await api.post(
    "/auth/register/verify",
    data
  );
  return response.data;
};


// SIGN IN
export const loginUser = async (data: any) => {
  const response = await api.post(
    "/auth/login/verify",
    data
  );
  return response.data;
};

// VERIFY ADMIN ACCESS
export const verifyAdminAccess = async () => {
  const response = await api.get("/auth/verify-role");
  return response.data;
};

//DECONNEXION
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};