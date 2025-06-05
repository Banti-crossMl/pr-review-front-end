export type CodeComparison = {
  id: string;
  filename: string;
  oldCode: string;
  newCode: string;
  summary: string;
  language: string;
  timestamp: string;
  author: string;
};

export const mockComparisons: CodeComparison[] = [
  {
    id: "comp-001",
    filename: "src/components/Button.tsx",
    language: "typescript",
    oldCode: `import React from 'react';

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {children}
    </button>
  );
};

export default Button;`,
    newCode: `import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };`,
    summary: "Refactored Button component to use class-variance-authority for better variant handling, added accessibility features, and included proper TypeScript typing with forwardRef.",
    timestamp: "2023-06-15T14:30:00Z",
    author: "Jane Smith"
  },
  {
    id: "comp-002",
    filename: "src/utils/api.js",
    language: "javascript",
    oldCode: `// API utilities
export const fetchData = (url) => {
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

export const postData = (url, data) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      console.error('Error posting data:', error);
    });
};`,
    newCode: `// API utilities with better error handling and timeout
export const fetchData = async (url, options = {}) => {
  const { timeout = 5000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(\`Request timeout after \${timeout}ms\`);
    }
    throw error;
  }
};

export const postData = async (url, data, options = {}) => {
  return fetchData(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
};

export const putData = async (url, data, options = {}) => {
  return fetchData(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
};

export const deleteData = async (url, options = {}) => {
  return fetchData(url, {
    ...options,
    method: 'DELETE',
  });
};`,
    summary: "Enhanced API utilities with async/await syntax, added timeout functionality, improved error handling, and implemented additional HTTP methods (PUT, DELETE).",
    timestamp: "2023-07-22T09:45:00Z",
    author: "John Doe"
  },
  {
    id: "comp-003",
    filename: "src/hooks/useLocalStorage.js",
    language: "javascript",
    oldCode: `import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;`,
    newCode: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Trigger a custom event so other instances can update
        window.dispatchEvent(new Event('local-storage-change'));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  // Listen for changes to this local storage key in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    // Handler for storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = JSON.parse(e.newValue);
          if (storedValue !== newValue) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error('Error parsing localStorage change:', error);
        }
      }
    };
    
    // Handler for custom events from within the same tab
    const handleLocalChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const newValue = JSON.parse(item);
          if (storedValue !== newValue) {
            setStoredValue(newValue);
          }
        }
      } catch (error) {
        console.error('Error handling local storage change:', error);
      }
    };
    
    // Subscribe to events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleLocalChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleLocalChange);
    };
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;`,
    summary: "Improved useLocalStorage hook with server-side rendering support, cross-tab synchronization, better error handling, and added comments for maintainability.",
    timestamp: "2023-08-05T16:20:00Z",
    author: "Alex Johnson"
  }
];