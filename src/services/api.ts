
import { Item } from "@/pages/Index";

const API_URL = 'http://localhost:5000/api';

// Convert MongoDB document to our frontend Item type
const formatItem = (item: any): Item => ({
  id: item._id,
  name: item.name,
  description: item.description,
  createdAt: new Date(item.createdAt)
});

// Get all items
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    
    const data = await response.json();
    return data.map(formatItem);
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Create a new item
export const createItem = async (item: Omit<Item, "id" | "createdAt">): Promise<Item> => {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    
    if (!response.ok) throw new Error('Failed to create item');
    
    const data = await response.json();
    return formatItem(data);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Update an existing item
export const updateItem = async (item: Item): Promise<Item> => {
  try {
    const { id, name, description } = item;
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    
    if (!response.ok) throw new Error('Failed to update item');
    
    const data = await response.json();
    return formatItem(data);
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete item');
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
