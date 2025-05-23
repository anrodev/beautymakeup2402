import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const HeaderActions = () => {
  const router = useRouter();
  const { cart } = useCart();
  const { user} = useAuth();

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.user}
        onPress={()=>!user?router.push("/login"):null}
      >
        <Ionicons name="person-outline" size={25} color="black" />
        <Text style={{ marginLeft: 5, fontWeight:"bold" }}>{user?.nicename}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
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
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HeaderActions;
