import instance from "../utils/axios";

export const signUp = (userData) => instance.post("/auth/signup", userData);
export const login = (userData) => instance.post("/auth/login", userData);
export const logout = () => instance.post("/auth/logout");
export const refreshToken = () => instance.post("/auth/refresh-token");
