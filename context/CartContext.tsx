import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartType } from "@/types";

type CartContextType = {
  cart: CartType[];
  addToCart: (product: CartType) => Promise<void>;
  sumAmount: (id: number) => Promise<void>;
  discountAmount: (id: number) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  cartCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartType[]>([]);
  const [loading, setLoading] = useState(true);

  const getCart = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
     
      if (jsonValue) {
        try {
          const parsedCart: CartType[] = JSON.parse(jsonValue);
          setCart(parsedCart);
        } catch (parseError) {
          console.error("Error al parsear el carrito. Se limpiará.", parseError);
          await AsyncStorage.removeItem("cart");
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const saveCart = async (newCart: CartType[]) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));
      setCart(newCart);
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
    }
  };

  const addToCart = async (product: CartType) => {
    try {
      const jsonValue = await AsyncStorage.getItem("cart");
      let currentCart: CartType[] = jsonValue ? JSON.parse(jsonValue) : [];

      const index = currentCart.findIndex((item) => item.id === product.id);

      if (index >= 0) {
        currentCart[index].amount += 1;
      } else {
        currentCart.push(product);
      }

      await saveCart(currentCart);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const sumAmount = async (id: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, amount: item.amount + 1 } : item
    );
    await saveCart(updated);
  };

  const discountAmount = async (id: number) => {
    const updated = cart.map((item) =>
      item.id === id && item.amount > 1
        ? { ...item, amount: item.amount - 1 }
        : item
    );
    await saveCart(updated);
  };

  const deleteProduct = async (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    await saveCart(updated);
  };

  const cartCount = cart.reduce((total, item) => total + item.amount, 0);
  const totalPrice = parseFloat(
    cart.reduce((acc, item) => acc + item.amount * item.price, 0).toFixed(2)
  );

  if (loading) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        sumAmount,
        discountAmount,
        deleteProduct,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
