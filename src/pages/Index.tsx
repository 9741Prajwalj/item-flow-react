
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ItemList from "@/components/ItemList";
import ItemForm from "@/components/ItemForm";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";

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
  const { toast } = useToast();

  // Simulate loading items from an API
  useEffect(() => {
    const savedItems = localStorage.getItem("items");
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Convert string dates back to Date objects
        const itemsWithDates = parsedItems.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        }));
        setItems(itemsWithDates);
      } catch (error) {
        console.error("Error parsing saved items:", error);
      }
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleCreateItem = (item: Omit<Item, "id" | "createdAt">) => {
    const newItem: Item = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setItems([newItem, ...items]);
    setIsFormOpen(false);
    toast({
      title: "Item created",
      description: "Your item has been added successfully",
    });
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    toast({
      title: "Item updated",
      description: "Your changes have been saved",
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item deleted",
      description: "The item has been removed",
      variant: "destructive",
    });
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
          {items.length > 0 ? `Items (${items.length})` : "No items yet"}
        </h2>
        <Button onClick={() => { setIsFormOpen(true); setEditingItem(null); }} className="flex items-center gap-2">
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {items.length > 0 ? (
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
