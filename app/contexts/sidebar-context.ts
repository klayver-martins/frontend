import { createContext } from 'react';

export interface SidebarContextData {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextData | null>(null);
