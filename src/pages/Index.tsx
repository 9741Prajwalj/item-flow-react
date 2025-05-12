
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ItemList from "@/components/ItemList";
import ItemForm from "@/components/ItemForm";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { fetchItems, createItem, updateItem, deleteItem } from "@/services/api";

export type Item = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

const Index = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load items from API
  useEffect(() => {
    const getItems = async () => {
      try {
        setIsLoading(true);
        const data = await fetchItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch items. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load items from server",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getItems();
  }, [toast]);

  const handleCreateItem = async (item: Omit<Item, "id" | "createdAt">) => {
    try {
      const newItem = await createItem(item);
      setItems([newItem, ...items]);
      setIsFormOpen(false);
      toast({
        title: "Item created",
        description: "Your item has been added successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const handleUpdateItem = async (updatedItem: Item) => {
    try {
      const result = await updateItem(updatedItem);
      setItems(items.map(item => 
        item.id === result.id ? result : item
      ));
      setEditingItem(null);
      setIsFormOpen(false);
      toast({
        title: "Item updated",
        description: "Your changes have been saved",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
      toast({
        title: "Item deleted",
        description: "The item has been removed",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const openEditForm = (item: Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Header />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {isLoading ? "Loading items..." : 
           error ? "Error loading items" :
           items.length > 0 ? `Items (${items.length})` : "No items yet"}
        </h2>
        <Button onClick={() => { setIsFormOpen(true); setEditingItem(null); }} className="flex items-center gap-2">
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : items.length > 0 ? (
        <ItemList 
          items={items} 
          onEdit={openEditForm} 
          onDelete={handleDeleteItem} 
        />
      ) : (
        <EmptyState onAddItem={() => { setIsFormOpen(true); setEditingItem(null); }} />
      )}

      <ItemForm 
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
        onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default Index;
