import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from "firebase/firestore";

export interface Order {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  timestamp: Date; 
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "timestamp">) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const q = query(collection(database, "orders"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);

      const ordersList: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data();

       
        if (
          typeof data.price !== "number" ||
          typeof data.quantity !== "number" ||
          !data.timestamp ||
          !data.timestamp.toDate
        ) {
          console.error("Invalid order data format:", data);
          return null;
        }

        return {
          id: doc.id,
          productName: data.productName,
          price: data.price,
          quantity: data.quantity,
          timestamp: data.timestamp.toDate(), 
        };
      }).filter(order => order !== null) as Order[]; 

      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, "id" | "timestamp">) => {
    try {
      await addDoc(collection(database, "orders"), {
        ...order,
        price: Number(order.price), 
        quantity: Number(order.quantity), 
        timestamp: Timestamp.now(), 
      });
      await fetchOrders();
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};