import axios from "axios";

const BASE_URL = "http://10.59.65.144:8080";

export const sendMessageToAI = async (message) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/chat`, {
      message,
    });

    return response.data;
  } catch (error) {
    console.log("Chat API Error:", error?.response?.data || error.message);
    throw error;
  }
};
