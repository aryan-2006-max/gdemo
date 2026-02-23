import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'smartCheckout';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return null;
}

const initialState = loadState() || {
  selectedStore: null,
  cart: [],
  transactions: [],
  appliedOffer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_STORE':
      return { ...state, selectedStore: action.payload, cart: [], appliedOffer: null };

    case 'ADD_TO_CART': {
      const existing = state.cart.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => item.id !== id) };
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'APPLY_OFFER':
      return { ...state, appliedOffer: action.payload };

    case 'REMOVE_OFFER':
      return { ...state, appliedOffer: null };

    case 'COMPLETE_TRANSACTION': {
      const txn = {
        id: 'TXN' + Date.now(),
        store: state.selectedStore,
        items: [...state.cart],
        appliedOffer: state.appliedOffer,
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      return {
        ...state,
        transactions: [...state.transactions, txn],
        cart: [],
        appliedOffer: null,
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [], appliedOffer: null };

    default:
      return state;
  }
}

// Calculate cart totals
export function getCartTotals(cart, appliedOffer) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalGST = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.gstRate) / 100,
    0
  );

  let discount = 0;
  if (appliedOffer && subtotal >= appliedOffer.minOrder) {
    if (appliedOffer.discountType === 'percentage') {
      discount = Math.min(
        (subtotal * appliedOffer.discountValue) / 100,
        appliedOffer.maxDiscount
      );
    } else {
      discount = appliedOffer.discountValue;
    }
  }

  const total = subtotal + totalGST - discount;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalGST: Math.round(totalGST * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

// Export backup as JSON
export function exportBackup(transactions) {
  const data = JSON.stringify(transactions, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-checkout-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
