
'use client';

import { Home, Users, Wallet, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'Refer' },
  { icon: Wallet, label: 'Wallet' },
  { icon: User, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center justify-center gap-1 w-full ${
              item.active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
