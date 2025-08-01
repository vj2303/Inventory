"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const OfferListContext = createContext();

// Provider component
export function OfferListProvider({ children }) {
  // Initialize state from localStorage if available
  const [offerList, setOfferList] = useState([]);
  
  // Load data from localStorage on first render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOfferList = localStorage.getItem('offerList');
      if (savedOfferList) {
        setOfferList(JSON.parse(savedOfferList));
      }
    }
  }, []);
  
  // Save to localStorage whenever offerList changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('offerList', JSON.stringify(offerList));
    }
  }, [offerList]);

  // Add or remove items from the offer list
  const updateOfferList = (newOfferList) => {
    setOfferList(newOfferList);
  };

  // Remove an item by ID
  const removeOfferItem = (id) => {
    setOfferList(offerList.filter(item => item.id !== id));
  };

  return (
    <OfferListContext.Provider value={{ offerList, updateOfferList, removeOfferItem }}>
      {children}
    </OfferListContext.Provider>
  );
}

// Custom hook for using the context
export function useOfferList() {
  return useContext(OfferListContext);
}