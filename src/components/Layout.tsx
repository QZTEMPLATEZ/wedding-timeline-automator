
import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/40 glass-morphism py-3 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-subtle"></div>
          <h1 className="text-lg font-medium tracking-tight">Wedding Auto Edit</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Help
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Settings
          </button>
        </div>
      </header>
      
      <main className={cn("flex-1 px-6 pt-6 pb-14 animate-fade-in", className)}>
        {children}
      </main>
      
      <footer className="border-t border-border/40 py-2 px-6 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Wedding Auto Edit v1.0</span>
          <span>© 2023 Wedding Automation Technologies</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
