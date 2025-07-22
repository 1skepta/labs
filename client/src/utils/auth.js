export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
};

export const isAuthenticated = () => !!getUser();

export const logout = () => {
  localStorage.removeItem("token");
};
