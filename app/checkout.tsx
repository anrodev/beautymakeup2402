import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { Feather } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { WebView } from "react-native-webview";

import { useLocalSearchParams } from "expo-router";
import { fecthOrder, fetchPutOrder } from "@/lib/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutScreen() {
  const modalRef = useRef<ModalRef>(null);

  const router = useRouter();

  const params = useLocalSearchParams();

  const webviewRef = useRef(null);

  const [orderStatus, setOrderStatus] = useState("processing");

  const [loading, setLoading] = useState(false);

  const { clearCart } = useCart();

  const { user } = useAuth();

  const getOrder = async (orderId: number) => {
    
    setLoading(true);

    try {

      if(user){
        await fetchPutOrder(orderId,user.id);
      }

      const order = await fecthOrder(orderId);

      const status = ["pending", "processing", "on-hold", "completed"].includes(
        order.status
      );

      if (status) {
        clearCart();
        setOrderStatus("completed");
      } else {
        setOrderStatus("canceled");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationChange = (navState: any) => {
    const { url } = navState;

    if (url.includes("order-received") || url.includes("cancel_order=true") || url.includes("cancelled") || url.includes("failed")) {
      const orderId = Number(params.orderId as string);

      getOrder(orderId);
    } 
  };

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <Text style={styles.textHeader}>Completa tu compra</Text>
        </View>
      </View>

      {orderStatus === "processing" && (
        <View style={styles.container}>
          <WebView
            ref={webviewRef}
            source={{
              uri:
                (Array.isArray(params.paymentUrl)
                  ? params.paymentUrl[0]
                  : params.paymentUrl) + "&hide-header=true",
            }}
            onNavigationStateChange={handleNavigationChange}
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator size="large" style={{ flex: 1 }} />
            )}
          />
        </View>
      )}

      {orderStatus === "canceled" && (
        <View style={styles.messageContainer}>
          <Feather name="alert-octagon" size={80} color="#ff7070ff" />
          <Text style={{ ...styles.messageTitle, color: "#ff7070ff" }}>
            Compra fallida
          </Text>
          <Text style={styles.messageSubtitle}>
            La transacción no pudo completarse correctamente 😭
          </Text>
          <TouchableOpacity
            style={{ ...styles.buttonNext, backgroundColor: "#ff7070ff" }}
            onPress={() =>
              router.push({
                pathname: "/(drawer)/(tabs)/shop",
                params: {
                  filter: JSON.stringify({ category: null, search: "" }),
                },
              })
            }
          >
            <Text style={{ color: "white", fontSize: 20 }}>Ok</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderStatus === "completed" && (
        <View style={styles.messageContainer}>
          <Feather name="check-circle" size={80} color="#8ad188ff" />
          <Text style={{ ...styles.messageTitle, color: "#8ad188ff" }}>
            Compra exitosa
          </Text>
          <Text style={styles.messageSubtitle}>Gracias por tu compra 🥳</Text>
          <TouchableOpacity
            style={{ ...styles.buttonNext, backgroundColor: "#8ad188ff" }}
            onPress={() =>
              router.push({
                pathname: "/(drawer)/(tabs)/shop",
                params: {
                  filter: JSON.stringify({ category: null, search: "" }),
                },
              })
            }
          >
            <Text style={{ color: "white", fontSize: 20 }}>Ok</Text>
          </TouchableOpacity>
        </View>
      )}

      <LoadingOverlay visible={loading} />
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

  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },

  messageTitle: {
    fontWeight: "bold",
    fontSize: 28,
    marginLeft: 16,
  },
  messageSubtitle: {
    fontSize: 20,
    color: "#adadadff",
    marginLeft: 16,
    textAlign: "center",
  },
  buttonNext: {
    minWidth: 100,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 12,
  },
});
