import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { useRef, useEffect, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { mockProducts } from "./(drawer)/(tabs)/shop";
import Product, { ProductProps } from "@/components/Product";
import { useRouter } from "expo-router";

export default function ProductDetailScreen() {
  const product = useLocalSearchParams();

  const modalRef = useRef<ModalRef>(null);

  const imageUri = typeof product.image === "string" ? product.image : "";

  const [products, setProducts] = useState<ProductProps[]>([]);

  const router = useRouter();

  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  return (
    <Modal ref={modalRef}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => modalRef.current?.close()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 10, marginRight: 20 }}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart-outline" size={25} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        ListHeaderComponent={
          <View>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price} €</Text>
            <Text style={styles.stock}>{product.stock} en stock</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Añadir a la cesta</Text>
            </TouchableOpacity>
            <Text style={styles.description}>{product.description}</Text>
            <TouchableOpacity style={styles.optionContainer}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionText}>Más vistos</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <Product item={item} row={true} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  stock: {
    fontSize: 14,
    color: "green",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#F1A3A3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    textAlign: "justify",
    fontSize: 14,
    color: "#555",
  },
});
