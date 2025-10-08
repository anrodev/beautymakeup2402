import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Text,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { useRouter } from "expo-router";
import EmptyMessage from "@/components/EmptyMessage";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Coupon from "@/components/Coupon";

export default function CartScreen() {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();
  const { cart, coupons, setCoupons, totalPrice, sumAmount, discountAmount, deleteProduct } =
    useCart();

  const { user} = useAuth();

  const newOrder = () =>{
    router.push("/generateOrder");
  }

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

          <Text style={styles.textHeader}>Carrito({cart.length})</Text>
        </View>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => (!user ? router.push("/login") : null)}
        >
          <Ionicons name="person-outline" size={22} color="black" />
          <Text style={{ marginLeft: 5, fontWeight:"bold" }}>{user?.nicename}</Text>
        </TouchableOpacity>
      </View>

      {cart.length > 0 ? (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {cart.map((item) => (
              <View key={item.id} style={styles.productCard}>
                {item.images.length > 0 ? (
                  <Image
                    source={{ uri: item.images[0].src }}
                    style={styles.productImage}
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/notfound.jpg")}
                    style={styles.productImage}
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{item.name}</Text>
                  <Text style={styles.productPrice}>{item.price} €</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => item.amount > 1 && discountAmount(item.id)}
                    >
                      <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.amount}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => sumAmount(item.id)}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ marginLeft: 10 }}
                      onPress={() => deleteProduct(item.id)}
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={22}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <Coupon coupons={coupons} setCoupons={setCoupons}/>

            <View style={styles.priceDetails}>
              <Text style={styles.priceLabel}>Detalles del precio</Text>
              <View style={styles.priceRow}>
                <Text>Subtotal</Text>
                <Text>{totalPrice.toFixed(2)} €</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>{totalPrice.toFixed(2)} €</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={newOrder}
          >
            <Text style={styles.checkoutText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <EmptyMessage message="No existen productos en el carrito" />
      )}
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
