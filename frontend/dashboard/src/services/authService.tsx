import api from "../api/axios";


// SIGN UP
export const registerUser = async (data: any) => {

  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
};


// SIGN IN
export const loginUser = async (data: any) => {

  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};

export const verifyAdminAccess = async () => {
  const response = await api.get("/auth/admin-access");
  return response.data;
};