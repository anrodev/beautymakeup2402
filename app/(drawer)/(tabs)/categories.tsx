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

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { fetchCategories } from "@/lib/api";

export interface category {
  id: number;
  name: string;
  image: ImageSourcePropType;
}

const mockCategories = [
  {
    id: 1,
    name: "Beauty box",
    image: require("@/assets/images/categories/beautybox.jpeg"),
  },
  {
    id: 2,
    name: "Cosmetica",
    image: require("@/assets/images/categories/cosmetica.jpeg"),
  },
  {
    id: 3,
    name: "Juegos",
    image: require("@/assets/images/categories/juegos.jpeg"),
  },
  {
    id: 4,
    name: "Kawaii",
    image: require("@/assets/images/categories/kawaii.jpeg"),
  },
  {
    id: 5,
    name: "Maquillaje",
    image: require("@/assets/images/categories/maquillaje.jpeg"),
  },
  {
    id: 6,
    name: "Para regalo",
    image: require("@/assets/images/categories/regalo.jpeg"),
  },
  {
    id: 7,
    name: "Perfumes y Ambientadores",
    image: require("@/assets/images/categories/perfumes.jpeg"),
  },
  {
    id: 8,
    name: "Productos personalizados",
    image: require("@/assets/images/categories/personalizados.jpeg"),
  },
  {
    id: 9,
    name: "Sin categoría",
    image: require("@/assets/images/categories/notfound.jpg"),
  },
];

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<category[]>([]);

  const router = useRouter();

  const getCategories = async () => {
    try {
      let fetchedCategories = await fetchCategories(100, 1);

      console.log(fetchedCategories);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    setCategories([...mockCategories]);

    getCategories();
  }, []);

  const renderItem = ({ item }: { item: category }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => router.push("/(drawer)/(tabs)/shop")}
    >
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </View>
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías de productos</Text>
        <Ionicons name="chevron-forward" size={20} color="#000" />
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
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
  row: {
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "33.33%",
    padding: 8,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
});
