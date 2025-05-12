
import { Package } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center gap-3 mb-8 pb-4 border-b">
      <div className="bg-primary p-2 rounded-md">
        <Package className="text-primary-foreground h-6 w-6" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Item Flow</h1>
        <p className="text-gray-500 text-sm">Manage your items with ease</p>
      </div>
    </header>
  );
};

export default Header;
