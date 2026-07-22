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

//FORGOT PASSWORD
export const forgotPassword = async (data: any) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );
  return response.data;
};

export const verifyResetOTP = async (data: any) => {
  const response = await api.post(
    "/auth/verify-reset-otp",
    data
  );
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );
  return response.data;
};

export const get_last_login = async () => {
  const response = await api.get("/auth/recent-logins");
  return response.data;
}

export const getRegistrationsByMonth = async () => {
  const response = await api.get("/stats/registrations");
  return response.data;
};

export const getUserStatistics = async () => {
  const response = await api.get("/stats/statistics");
  return response.data;
};

//DECONNEXION
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
};