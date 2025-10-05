import axios from "axios";

// const baseURL = "https://loan.eimpactchart.com/asa/v1";
const baseURL = "http://localhost:3001/asa/v1";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add token to requests if available
    const token = localStorage.getItem("asavic_token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (error) {
        // If token is not valid JSON, use it as is
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get user role from localStorage
const getUserRole = () => {
  const role = localStorage.getItem("asa_role");
  if (role) {
    try {
      return JSON.parse(role);
    } catch (error) {
      console.error("Error parsing role data:", error);
    }
  }
  return null;
};

// Helper function to get refresh token endpoint based on user role
const getRefreshTokenEndpoint = (userRole: string | null) => {
  switch (userRole) {
    case "director":
      return "/director/refresh-token";
    case "manager":
      return "/manager/refresh-token";
    case "creditAgent":
      return "/agent/refresh-token";
    default:
      // Fallback to director endpoint if role is not determined
      return "/director/refresh-token";
  }
};

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle response errors
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get refresh token from localStorage
          const refreshToken = localStorage.getItem("asavic_refresh_token");
          const userRole = getUserRole();

          if (refreshToken) {
            // Get the appropriate refresh token endpoint based on user role
            const refreshEndpoint = getRefreshTokenEndpoint(userRole);

            // Call refresh token endpoint
            const response = await axiosClient.post(refreshEndpoint, {
              refreshToken: JSON.parse(refreshToken),
            });

            // Update tokens in localStorage
            localStorage.setItem(
              "asavic_token",
              JSON.stringify(response.data.data.accessToken)
            );
            localStorage.setItem(
              "asavic_refresh_token",
              JSON.stringify(response.data.data.refreshToken)
            );

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

            // Retry the original request
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("asavic_token");
          localStorage.removeItem("asavic_refresh_token");
          localStorage.removeItem("asa_user");

          // Only redirect to login if not already on an auth page
          const currentPath = window.location.pathname;
          if (!currentPath.startsWith("/auth/")) {
            window.location.href = "/auth/login";
          }
        }
      } else if (error.response.status === 401) {
        // 401 without retry - clear tokens and redirect
        localStorage.removeItem("asavic_token");
        localStorage.removeItem("asavic_refresh_token");
        localStorage.removeItem("asa_user");

        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth/")) {
          window.location.href = "/auth/login";
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
