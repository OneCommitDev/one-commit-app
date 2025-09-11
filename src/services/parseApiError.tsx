// src/utils/errorHandler.ts
export function parseApiError(error: any): { message: string; redirect?: string } {
  if (error?.response) {
    const status = error.response.status;

    switch (status) {
      case 400:
        return { message: error.response.data?.message || "Bad request" };
      case 401:
        return { message: "Unauthorized. Please login again.", redirect: "Login" };
      case 403:
        return { message: "Access denied" };
      case 404:
        return { message: "Resource not found" };
      case 500:
        return { message: "Server error. Try again later." };
      default:
        return { message: error.response.data?.message || "Unexpected error occurred" };
    }
  }

  if (error?.request) {
    return { message: "Network error. Please check your connection." };
  }

  return { message: error?.message || "Unknown error" };
}
