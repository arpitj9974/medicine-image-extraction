import axios from 'axios';

// Connect to the existing Node.js Backend on port 3000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/medicine';

const api = axios.create({
  baseURL: API_URL,
});

export const medicineService = {
  // Upload a file to the backend
  uploadMedicineImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Give it extra time because AI extraction might take 5-10 seconds
      timeout: 60000, 
    });
    return response.data;
  },

  // Fetch all saved medicine records
  getAllMedicines: async () => {
    const response = await api.get('/');
    return response.data;
  },
};
