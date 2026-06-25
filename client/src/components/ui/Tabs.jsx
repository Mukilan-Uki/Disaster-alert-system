// src/components/ui/Tabs.jsx
import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, className = "" }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return (
    <div role="tablist" className={`inline-flex gap-1 rounded-full bg-midnight-400/5 p-1 dark:bg-white/5 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value: tabValue, children }) {
  const { value, setValue } = useContext(TabsContext);
  const active = value === tabValue;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => setValue(tabValue)}
      className={`relative rounded-full px-4 py-1.5 font-body text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40 ${
        active ? "text-midnight-400 dark:text-midnight-400" : "text-midnight-400/50 hover:text-midnight-400 dark:text-mist/50 dark:hover:text-mist"
      }`}
    >
      {active && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-mist"
          transition={{ type: "spring", duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value: tabValue, children }) {
  const { value } = useContext(TabsContext);
  if (value !== tabValue) return null;
  return <div role="tabpanel">{children}</div>;
}
