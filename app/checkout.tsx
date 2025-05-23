import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRef } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import { WebView } from "react-native-webview";

import { useLocalSearchParams } from "expo-router";

export default function CheckoutScreen() {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();

  const params = useLocalSearchParams();

  const webviewRef = useRef(null);

  const handleNavigationChange = (navState: any) => {
    const { url } = navState;

    if (url.includes("order-received")) {
      modalRef.current?.close();
    }

    if (url.includes("cancelled") || url.includes("failed")) {
      modalRef.current?.close();
    }
  };

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

          <Text style={styles.textHeader}>Completa tu compra</Text>
        </View>

        <TouchableOpacity
          style={{ marginLeft: 10, marginRight: 20 }}
          onPress={() => router.push("/login")}
        >
          <Ionicons name="person-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

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
});
