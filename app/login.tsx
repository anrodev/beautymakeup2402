import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const modalRef = useRef<ModalRef>(null);

  const router = useRouter();

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => modalRef.current?.close()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <Text style={styles.textHeader}>Iniciar sesión</Text>
      </View>

      <ImageBackground
        source={require("@/assets/images/loginBackground.png")}
        style={{
          flex: 1,
        }}
        resizeMode="stretch"
      ></ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginLeft: 16,
  },
});
