import { Link, useLocation } from "wouter";
import { Globe, Flag, Settings, Leaf } from "lucide-react";

const navigation = [
  { name: "Global Overview", href: "/", icon: Globe },
  { name: "Countries", href: "/countries", icon: Flag },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-card shadow-lg flex-shrink-0 border-r border-gray-200 dark:border-border">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">Info Green</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Global Renewable Electricity Dashboard
            </p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="space-y-2 px-4">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-green-50 dark:bg-green-100/10"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}>
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
