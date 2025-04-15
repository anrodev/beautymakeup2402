import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Text,
} from "react-native";
import { useRef } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useRouter } from "expo-router";


export default function CartScreen() {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => modalRef.current?.close()}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <Text style={styles.textHeader}>Carrito(1)</Text>
        </View>

        <TouchableOpacity
          style={{ marginLeft: 10, marginRight: 20 }}
          onPress={() => router.push("/login")}
        >
          <Ionicons name="person-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.productCard}>
            <Image
              source={{
                uri: "https://beautymakeup2402.es/wp-content/uploads/2025/03/47664AE1-B9D2-42B2-8FB0-C5A3215874F7-1000x769.jpeg.webp",
              }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>Contorno de Ojos Serum Hyaluronic Acid</Text>
              <Text style={styles.productPrice}>3.95 €</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>1</Text>
                <TouchableOpacity style={styles.quantityButton}>
                  <Text>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 10 }}>
                  <MaterialIcons name="delete-outline" size={22} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.coupon}>
            <Ionicons name="pricetag-outline" size={20} color="black" />
            <Text style={styles.couponText}>Aplicar cupón</Text>
          </TouchableOpacity>

          <View style={styles.priceDetails}>
            <Text style={styles.priceLabel}>Detalles del precio</Text>
            <View style={styles.priceRow}>
              <Text>Subtotal</Text>
              <Text>3.95 €</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>3.95 €</Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  productImage: { width: 70, height: 70, resizeMode: "contain" },
  productInfo: { marginLeft: 10, flex: 1 },
  productTitle: { fontWeight: "bold", fontSize: 16 },
  productPrice: { marginTop: 4 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  quantityText: { marginHorizontal: 10 },
  coupon: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  couponText: { marginLeft: 10 },
  priceDetails: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  priceLabel: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalText: { fontWeight: "bold" },
  checkoutButton: {
    backgroundColor: "#EB9CA9",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 12,
  },
  checkoutText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
  },
});
