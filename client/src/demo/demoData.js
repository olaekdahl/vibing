/**
 * Demo data for client-side mock scanning
 * Simulates barcode scanner results without requiring a camera
 */

export const demoProducts = [
  {
    barcode: '5449000000996',
    name: 'Coca-Cola Classic 330ml',
    image: '/demo/coca-cola.jpg'
  },
  {
    barcode: '4005808134915',
    name: 'Nivea Creme 150ml',
    image: '/demo/nivea.jpg'
  },
  {
    barcode: '0013000001090',
    name: 'Heinz Tomato Ketchup 397g',
    image: '/demo/heinz.jpg'
  },
  {
    barcode: '0011111181069',
    name: 'Dove Beauty Bar',
    image: '/demo/dove.jpg'
  },
  {
    barcode: '0035000761095',
    name: 'Colgate Total Toothpaste',
    image: '/demo/colgate.jpg'
  },
  {
    barcode: '80050965',
    name: 'Nutella Hazelnut Spread 400g',
    image: '/demo/nutella.jpg'
  }
];

// Get current demo product index from session storage
export const getCurrentDemoIndex = () => {
  const stored = sessionStorage.getItem('demoProductIndex');
  return stored ? parseInt(stored, 10) : 0;
};

// Set current demo product index
export const setCurrentDemoIndex = (index) => {
  sessionStorage.setItem('demoProductIndex', index.toString());
};

// Get next demo product (cycles through list)
export const getNextDemoProduct = () => {
  const currentIndex = getCurrentDemoIndex();
  const nextIndex = (currentIndex + 1) % demoProducts.length;
  setCurrentDemoIndex(nextIndex);
  return demoProducts[nextIndex];
};

// Get current demo product
export const getCurrentDemoProduct = () => {
  return demoProducts[getCurrentDemoIndex()];
};

// Get specific demo product by barcode
export const getDemoProductByBarcode = (barcode) => {
  return demoProducts.find(p => p.barcode === barcode);
};

// Reset demo to first product
export const resetDemoIndex = () => {
  setCurrentDemoIndex(0);
};

// Check if demo mode is enabled
export const isDemoMode = () => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

export default {
  demoProducts,
  getCurrentDemoIndex,
  setCurrentDemoIndex,
  getNextDemoProduct,
  getCurrentDemoProduct,
  getDemoProductByBarcode,
  resetDemoIndex,
  isDemoMode
};
