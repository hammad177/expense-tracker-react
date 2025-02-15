import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";

// Initial state
const initialState = {
  transactions: [],
};

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("transactions");
    if (serializedState === null) {
      return initialState; // Return the default state if no saved state exists
    }
    return { transactions: JSON.parse(serializedState) };
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
    return initialState; // Fallback to default state on error
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.transactions);
    localStorage.setItem("transactions", serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, loadState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Actions
  function deleteTransaction(id) {
    dispatch({
      type: "DELETE_TRANSACTION",
      payload: id,
    });
  }

  function addTransaction(transaction) {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: transaction,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
