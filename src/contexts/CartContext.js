import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import cartService from '../services/cart.service';
import orderService from '../services/order.service';
import productService from '../services/product.service';
import { useAuth } from './AuthContext';

const initialState = {
  items: [], // cada item: { productId, quantity, product? }
  loading: false,
  error: null,
  lastUpdated: null,
};

const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART: 'SET_CART',
  CLEAR: 'CLEAR'
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case CART_ACTIONS.SET_CART:
      return { 
        ...state, 
        items: action.payload.items, 
        loading: false, 
        error: null, 
        lastUpdated: Date.now() 
      };
    case CART_ACTIONS.CLEAR:
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const normalizeCartData = (data) => {
    if (!data) return [];
    const products = data.products || data.cart?.products || [];
    return products.map(p => {
      
      const productDoc = p.product || (typeof p._id === 'object' ? p._id : null);
      const productId = productDoc?._id || (typeof p._id === 'string' ? p._id : p.id);
      return {
        productId,
        quantity: p.quantity || p.qty || 1,
        product: productDoc || null
      };
    }).filter(it => !!it.productId);
  };

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: CART_ACTIONS.CLEAR });
      return;
    }
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const data = await cartService.getCart();
      let items = normalizeCartData(data);
      // Buscar detalhes faltantes (imagens/nome) se product estiver null
      const missingIds = items.filter(i => !i.product).map(i => i.productId);
      if (missingIds.length > 0) {
        // Buscar em paralelo (limitar para evitar muitas requisições; aqui simples loop)
        const fetched = await Promise.all(missingIds.map(async id => {
          try { return await productService.getProductById(id); } catch { return null; }
        }));
        items = items.map(it => {
          if (!it.product) {
            const prod = fetched.find(f => f && (f._id === it.productId));
            if (prod) return { ...it, product: prod };
          }
          return it;
        });
      }
      dispatch({ type: CART_ACTIONS.SET_CART, payload: { items } });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message || 'Erro ao carregar carrinho' });
    }
  }, [isAuthenticated]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await cartService.addToCart(productId, quantity);
      await refreshCart();
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message || 'Erro ao adicionar item' });
    }
  }, [refreshCart]);

  const removeItem = useCallback(async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      // Garantir que enviamos string simples
      const result = await cartService.removeFromCart(productId.toString());
      
      // Se carrinho foi deletado (último item), limpar estado local
      if (result === null || result === undefined) {
        dispatch({ type: CART_ACTIONS.CLEAR });
      } else {
        await refreshCart();
      }
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message || 'Erro ao remover item' });
    }
  }, [refreshCart]);

    const updateQuantity = useCallback(async (productId, quantity) => {
      try {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
        // Se quantidade é 0, usar removeItem
        if (quantity === 0) {
          const result = await cartService.removeFromCart(productId.toString());
          if (result === null || result === undefined) {
            dispatch({ type: CART_ACTIONS.CLEAR });
          } else {
            await refreshCart();
          }
        } else {
          // Usar updateQuantity do serviço
          const result = await cartService.updateQuantity(productId.toString(), quantity);
          if (result === null || result === undefined) {
            dispatch({ type: CART_ACTIONS.CLEAR });
          } else {
            await refreshCart();
          }
        }
      } catch (err) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: err.message || 'Erro ao atualizar quantidade' });
      }
    }, [refreshCart]);

  const confirmOrder = useCallback(async ({ paymentMethod, notes } = {}) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const order = await orderService.createFromCart({ paymentMethod, notes });
      // após criar pedido, carrinho é removido no backend; local limpa
      dispatch({ type: CART_ACTIONS.CLEAR });
      return { success: true, order };
    } catch (err) {
      const message = err.message || 'Erro ao confirmar pedido';
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR });
  }, []);

  // Carregar carrinho quando autenticar
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      clear();
    }
  }, [isAuthenticated, refreshCart, clear]);

  const totalItems = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items]);
  const totalPrice = useMemo(() => state.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0), [state.items]);

  const value = useMemo(() => ({
    items: state.items,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
      updateQuantity,
    refreshCart,
    clear,
    confirmOrder,
    }), [state, totalItems, totalPrice, addItem, removeItem, updateQuantity, refreshCart, clear, confirmOrder]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
};

export default CartContext;
