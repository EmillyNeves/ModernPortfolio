import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Calendar, Edit3, BarChart2, LineChart, Code } from "lucide-react";

const BottomNavigation: React.FC = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      icon: <Home className="h-6 w-6" />,
      label: "HOME",
      path: "/",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      label: "FALTAS",
      path: "/attendance",
    },
    {
      icon: <Edit3 className="h-6 w-6" />,
      label: "NOTAS",
      path: "/notes",
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      label: "PROGRESSO",
      path: "/progress",
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      label: "ANALYTICS",
      path: "/analytics",
    },
    {
      icon: <Code className="h-6 w-6" />,
      label: "DEVELOPER",
      path: "/developer",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-primary/30 py-2 px-4 z-50">
      <div className="container mx-auto">
        <ul className="flex justify-center items-center space-x-2 lg:space-x-8">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`nav-item flex flex-col items-center p-2 rounded-md ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-white/70 hover:text-primary"
                }`}
              >
                {item.icon}
                <span className="text-xs font-fira mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNavigation;
