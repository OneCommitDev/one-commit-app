import axios from 'axios';

// ✅ Create a reusable Axios instance
const api = axios.create({
  baseURL: 'https://your-api.com/api', // change to your base API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Set token (optional: for auth headers)
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// ✅ GET request
export const getRequest = async (url: string, params?: any) => {
  const response = await api.get(url, { params });
  return response.data;
};

// ✅ POST request
export const postRequest = async (url: string, data?: any) => {
  const response = await api.post(url, data);
  return response.data;
};

// ✅ PUT request
export const putRequest = async (url: string, data?: any) => {
  const response = await api.put(url, data);
  return response.data;
};

// ✅ DELETE request
export const deleteRequest = async (url: string) => {
  const response = await api.delete(url);
  return response.data;
};

// ✅ Upload file (e.g., image)
export const uploadFile = async (url: string, fileUri: string) => {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: 'upload.jpg',
    type: 'image/jpeg',
  } as any); // 👈 "as any" to satisfy TS if needed

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
