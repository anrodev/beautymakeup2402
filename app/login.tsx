import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const modalRef = useRef<ModalRef>(null);

  const [email, setEmail] = useState("");

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
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        resizeMode="stretch"
      >
        <TextInput
          selectionColor="white"
          textColor="black"
          label="Correo electrónico"
          keyboardType="email-address"
          theme={{
            colors: {
              primary: "black", // Color del borde cuando está activo
              text: "black", // Color del texto y del label
              onSurface: "black", // Ajusta el color del label pasivo
            },
          }}
          style={styles.textInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ImageBackground>
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
  textInput: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    borderWidth: 1.2,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  button: {
    marginTop:20,
    width:"100%",
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
