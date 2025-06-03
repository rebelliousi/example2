// src/components/Main/Main.tsx
import React from 'react';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <div className="container mx-auto py-5 p-10">
      {children}
    </div>
  );
};

export default Main;