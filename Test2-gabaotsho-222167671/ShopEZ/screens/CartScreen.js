import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { ref, onValue, set } from "firebase/database";

export default function CartScreen() {
  const [cart, setCart] = useState({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = ref(db, "carts/" + user.uid);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val() || {};
      setCart(data);
    });

    return () => unsubscribe();
  }, []);

  const updateQuantity = (id, change) => {
    const user = auth.currentUser;
    const newCart = { ...cart };

    if (newCart[id]) {
      newCart[id].quantity += change;
      if (newCart[id].quantity <= 0) {
        delete newCart[id];
      }
      set(ref(db, "carts/" + user.uid), newCart);
    }
  };

  const calculateTotal = () =>
    Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, -1)}
          >
            <Text style={styles.qtyText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, 1)}
          >
            <Text style={styles.qtyText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const cartArray = Object.values(cart);

  return (
    <View style={styles.container}>
      {cartArray.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartArray}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ${calculateTotal().toFixed(2)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    color: "green",
    marginBottom: 8,
    fontWeight: "600",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  totalContainer: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#555",
  },
});