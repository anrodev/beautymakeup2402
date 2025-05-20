import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";

const CartMenu = () => {
  
  const router = useRouter();
  const { cart } = useCart();

  return (
    <TouchableOpacity
      style={{ marginLeft: 10, marginRight: 20 }}
      onPress={() => router.push("/cart")}
    >
      <View style={{ position: "relative" }}>
        <Ionicons name="cart-outline" size={25} color="black" />
        {cart.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "#EB9CA9",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CartMenu;
