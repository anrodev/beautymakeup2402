import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: ImageSourcePropType;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Contorno de Ojos Serum Hyaluronic Acid",
    price: 2.95,
    stock: 24,
    image: require("@/assets/images/products/serum.jpg"),
  },
  {
    id: 2,
    name: "Primer para sombra de ojos",
    price: 2.95,
    stock: 24,
    image: require("@/assets/images/products/primer.jpg"),
  },
  {
    id: 3,
    name: "Paleta de sombras stich and friends",
    price: 10.95,
    stock: 6,
    image: require("@/assets/images/products/stich.jpeg"),
  },
  {
    id: 4,
    name: "Caja de labiales Hello Kitty",
    price: 9.95,
    stock: 8,
    image: require("@/assets/images/products/hellokitty.jpg"),
  },
];

export default function ShopScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [twoColumn, setTwoColumn] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  const renderTwoItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={stylesTwoItem.card} onPress={() => {}}>
      <View style={stylesTwoItem.imageWrapper}>
        <Image
          source={item.image}
          style={stylesTwoItem.image}
          resizeMode="cover"
        />
        <View style={stylesTwoItem.stockBadge}>
          <Text style={stylesTwoItem.stockText}>{item.stock} en stock</Text>
        </View>
      </View>
      <Text style={stylesTwoItem.name}>{item.name}</Text>
      <Text style={stylesTwoItem.price}>{item.price} €</Text>
    </TouchableOpacity>
  );

  const renderOneItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={stylesOneItem.card} onPress={() => {}}>
      <Image
        source={item.image}
        style={stylesOneItem.image}
        resizeMode="cover"
      />

      <View style={stylesOneItem.infoContainer}>
        <Text style={stylesOneItem.name}>{item.name}</Text>
        <Text style={stylesOneItem.price}>{item.price} €</Text>
        <Text style={stylesOneItem.stock}>{item.stock} en stock</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos ({products.length})</Text>
        <TouchableOpacity onPress={() => setTwoColumn(!twoColumn)}>
          {twoColumn ? (
            <MaterialCommunityIcons
              name="format-list-text"
              size={26}
              color="#000"
            />
          ) : (
            <Ionicons name="grid-outline" size={26} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        key={twoColumn ? "two" : "one"}
        data={products}
        renderItem={twoColumn ? renderTwoItem : renderOneItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={twoColumn ? 2 : 1}
        columnWrapperStyle={twoColumn ? stylesTwoItem.row : undefined}
        contentContainerStyle={
          twoColumn
            ? { paddingHorizontal: 8, paddingBottom: 20 }
            : { padding: 16 }
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

const stylesTwoItem = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  stockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    textAlign: "justify",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: "#444",
  },
});

const stylesOneItem = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    position: "relative",
    justifyContent: "center",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
    textAlign: "left",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  stock: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
  },
});
