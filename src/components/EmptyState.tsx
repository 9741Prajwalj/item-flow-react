
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddItem: () => void;
}

const EmptyState = ({ onAddItem }: EmptyStateProps) => {
  return (
    <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center bg-muted/50">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <Package className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No items yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Create your first item to get started. You can add details and manage your items easily.
      </p>
      <Button onClick={onAddItem} className="flex items-center gap-2">
        <Plus size={16} />
        Add Your First Item
      </Button>
    </div>
  );
};

export default EmptyState;
