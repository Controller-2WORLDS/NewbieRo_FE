import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomTabBar } from '@widgets/bottom-tab-bar/ui/BottomTabBar';

export function TabLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>);

}