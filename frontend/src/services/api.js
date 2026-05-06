import axios from 'axios';

// Connect to the backend
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return 'http://localhost:3000/api/medicine';
  
  // If the URL doesn't end with /api/medicine, append it
  return envUrl.endsWith('/api/medicine') ? envUrl : `${envUrl.replace(/\/$/, '')}/api/medicine`;
};

const API_URL = getBaseUrl();

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
