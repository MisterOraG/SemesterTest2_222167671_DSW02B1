import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Logout" onPress={() => signOut(auth)} />,
    });
  }, [navigation]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (error) return <Text style={{ textAlign: "center", marginTop: 50 }}>{error}</Text>;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("ProductDetail", { product: item })}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={products} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
  },
  image: { width: 70, height: 70, resizeMode: "contain", marginRight: 10 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: "bold" },
  price: { color: "green", marginTop: 5 },
});