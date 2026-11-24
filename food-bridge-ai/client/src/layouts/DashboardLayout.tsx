import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { AiAssistantWidget } from '../components/AiAssistantWidget';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-darkslate">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      <AiAssistantWidget />
    </div>
  );
};
