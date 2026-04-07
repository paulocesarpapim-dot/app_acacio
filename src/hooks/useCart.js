import { useState, useEffect, useCallback } from "react";

const CART_KEY = "nordeste_cart";

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function useCart() {
  const [items, setItems] = useState(getCart);

  useEffect(() => {
    const handler = () => setItems(getCart());
    window.addEventListener("cart-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cart-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const addItem = useCallback((product, qty = 1) => {
    const cart = getCart();
    const idx = cart.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      cart[idx].qty = parseFloat((cart[idx].qty + qty).toFixed(2));
    } else {
      cart.push({ product, qty: parseFloat(qty.toFixed(2)) });
    }
    saveCart(cart);
  }, []);

  const removeItem = useCallback((productId) => {
    const cart = getCart().filter((i) => i.product.id !== productId);
    saveCart(cart);
  }, []);

  const updateQty = useCallback((productId, qty) => {
    const cart = getCart();
    const idx = cart.findIndex((i) => i.product.id === productId);
    if (idx >= 0) {
      const rounded = parseFloat(qty.toFixed(2));
      if (rounded <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].qty = rounded;
      }
    }
    saveCart(cart);
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const cartCount = items.length;
  const cartTotal = parseFloat(items.reduce((sum, i) => sum + parseFloat((i.product.price * i.qty).toFixed(2)), 0).toFixed(2));

  return { items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal };
}