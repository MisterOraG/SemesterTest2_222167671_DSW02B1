import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { ref, get, set } from "firebase/database";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "Please login to add items to your cart.");
      navigation.navigate("Login");
      return;
    }

    try {
      const cartRef = ref(db, "carts/" + user.uid);
      const snapshot = await get(cartRef);
      const currentCart = snapshot.exists() ? snapshot.val() : {};

      const existingItem = Object.values(currentCart).find((item) => item.id === product.id);

      if (existingItem) existingItem.quantity += 1;
      else currentCart[product.id] = { ...product, quantity: 1 };

      await set(cartRef, currentCart);
      Alert.alert("Added to Cart", `${product.title} has been added to your cart.`);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.category}>Category: {product.category}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
        <Text style={styles.cartText}>Go to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  image: { width: "100%", height: 300, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  price: { fontSize: 16, color: "green", marginBottom: 5, textAlign: "center" },
  category: { fontSize: 14, textAlign: "center", marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cartButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center" },
  cartText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});