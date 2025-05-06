import React from "react";
import { Link } from "wouter";

const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-primary/30 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-primary font-orbitron text-lg font-bold">
            @lewisif
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6 font-fira text-sm uppercase">
            <li>
              <Link href="/" className="text-primary">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white/80 hover:text-white hover:text-primary transition-colors">
                ABOUT
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-white/80 hover:text-white hover:text-primary transition-colors">
                LOG IN
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
