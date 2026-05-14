import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.59.65.144:8080"; // Android Emulator address

const api = axios.create({
  baseURL: BASE_URL,
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== Auth ====================
export const loginApi = async (enrollment, dob, role) => {
  const response = await api.post("/api/auth/login", { enrollment, dob, role });
  return response.data;
};

export const fetchMyProfile = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

// ==================== Admin ====================
export const createUserApi = async (userData, imageFile) => {
  const formData = new FormData();
  formData.append("user", JSON.stringify(userData));
  if (imageFile) {
    formData.append("image", {
      uri: imageFile.uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });
  }
  const response = await api.post("/api/admin/create-user", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchAllUsers = async () => (await api.get("/api/admin/users")).data;
export const fetchUsersByRole = async (role) => (await api.get(`/api/admin/users/${role}`)).data;
export const deleteUserApi = async (id) => (await api.delete(`/api/admin/users/${id}`)).data;

// ==================== Leaves ====================
export const applyLeaveApi = async (leaveData, attachment) => {
  const formData = new FormData();
  formData.append("leave", JSON.stringify(leaveData));
  if (attachment) {
    formData.append("attachment", {
      uri: attachment.uri,
      name: attachment.fileName || "attachment.jpg",
      type: attachment.mimeType || "image/jpeg",
    });
  }
  const response = await api.post("/api/leaves/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const fetchMyLeaves = async () => {
  const response = await api.get("/api/leaves/my-leaves");
  return response.data;
};

export const fetchLeaveById = async (id) => {
  const response = await api.get(`/api/leaves/${id}`);
  return response.data;
};

// ==================== Authority listing ====================
export const fetchDeans = async () => (await api.get("/api/authorities/deans")).data;
export const fetchWardens = async () => (await api.get("/api/authorities/wardens")).data;
export const fetchChiefWardens = async () => (await api.get("/api/authorities/chief-wardens")).data;

// ==================== Dean Actions ====================
export const fetchDeanPending = async () => (await api.get("/api/dean/pending")).data;
export const fetchDeanHistory = async () => (await api.get("/api/dean/history")).data;
export const approveDeanLeave = async (id, remarks) => await api.post(`/api/dean/approve/${id}`, { remarks });
export const rejectDeanLeave = async (id, remarks) => await api.post(`/api/dean/reject/${id}`, { remarks });

// ==================== Warden Actions ====================
export const fetchWardenPending = async () => (await api.get("/api/warden/pending")).data;
export const fetchWardenHistory = async () => (await api.get("/api/warden/history")).data;
export const fetchWardenOwnLeaves = async () => (await api.get("/api/warden/my-leaves")).data;
export const approveWardenLeave = async (id, remarks) => await api.post(`/api/warden/approve/${id}`, { remarks });
export const rejectWardenLeave = async (id, remarks) => await api.post(`/api/warden/reject/${id}`, { remarks });

export const applyWardenLeaveApi = async (leaveData, attachment) => {
  const formData = new FormData();
  formData.append("leave", JSON.stringify(leaveData));
  if (attachment) {
    formData.append("attachment", {
      uri: attachment.uri,
      name: attachment.fileName || "attachment.jpg",
      type: attachment.mimeType || "image/jpeg",
    });
  }
  const response = await api.post("/api/warden/apply-leave", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ==================== Chief Warden Actions ====================
export const fetchChiefWardenPending = async () => (await api.get("/api/chief-warden/pending")).data;
export const fetchChiefWardenHistory = async () => (await api.get("/api/chief-warden/history")).data;
export const fetchPendingWardenLeaves = async () => (await api.get("/api/chief-warden/warden-leaves")).data;
export const approveChiefWardenLeave = async (id, remarks) => await api.post(`/api/chief-warden/approve/${id}`, { remarks });
export const rejectChiefWardenLeave = async (id, remarks) => await api.post(`/api/chief-warden/reject/${id}`, { remarks });

// ==================== Helpers ====================
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  return `${BASE_URL}/uploads/${filename}`;
};

export { BASE_URL };
export default api;
