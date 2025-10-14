import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingOverlay from "@/components/LoadingOverlay";
import { SendValidationCode, ValidateCode, ChangePassword } from "@/components/RecoverAccount";

export default function RecoverAccountScreen() {
  const modalRef = useRef<ModalRef>(null);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [code, setCode] = useState("");

  const close = () =>{

    modalRef.current?.close();
  }

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <TouchableOpacity onPress={close}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <Text style={styles.textHeader}>Recuperar Cuenta</Text>
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
        {!email && (
          <SendValidationCode setLoading={setLoading} setEmail={setEmail} />
        )}

        {(email && !code) &&(
          <ValidateCode email={email} setLoading={setLoading} setCode={setCode} />
        )}

        {(email && code) && (
          <ChangePassword email={email} code={code} setLoading={setLoading} close={close}/>
        )}

      </ImageBackground>
      <LoadingOverlay visible={loading} />
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
