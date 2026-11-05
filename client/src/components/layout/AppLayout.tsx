import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="pl-[260px] w-full flex flex-col min-w-0">
        <Header />
        <main className="w-full pt-14 min-h-screen bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
