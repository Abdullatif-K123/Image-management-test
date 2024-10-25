import axios from 'axios';

const api = axios.create({
  baseURL: 'https://my-json-server.typicode.com/MostafaKMilly/demo',
});

// Images API
export const fetchImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

export const deleteImage = async (id) => { 
  await api.delete(`/images/${id}`);  
};

// Simulated upload API endpoint
export const uploadImage = async (newImage) => {
    console.log(newImage)
    const response = await fetch('https://my-json-server.typicode.com/MostafaKMilly/demo/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newImage),
    });
 
    if (!response.ok) throw new Error('Image upload failed'); 
    return response.json();
  };
// Add the updateImageDetails function
export const updateImageDetails = async (updatedImage) => {
  console.log(updatedImage)
  const { categoryId, ...rest } = updatedImage;  // Extract the id and other image data
  const response = await api.put(`/images/${categoryId}`, rest);
 
  return response.data;
};

// Categories API
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (category) => {
  const response = await api.post('/categories', category);
  return response.data;
};

export const updateCategory = async ({ id, updatedCategory }) => {
    const response = await api.put(`/categories/${id}`, updatedCategory);
    return response.data;
  };
  
export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  };

export default api;
