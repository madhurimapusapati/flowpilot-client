export const saveToken = (token) => localStorage.setItem("fp_token", token);
export const getToken = () => localStorage.getItem("fp_token");
export const removeToken = () => localStorage.removeItem("fp_token");
export const isAuthenticated = () => !!getToken();
