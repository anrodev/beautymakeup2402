import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RadioButton } from 'react-native-paper';

export default function AppearanceScreen() {
  const [appearance, setAppearance] = useState("light");

  const modalRef = useRef<ModalRef>(null);

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

        <Text style={styles.textHeader}>Apariencia</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <RadioButton
              value="light"
              color="black"
              status={appearance === "light" ? "checked" : "unchecked"}
              onPress={() => setAppearance("light")}
            />
            <Text style={styles.optionText}>Clara</Text>
          </View>
        </View>

        <View style={styles.optionContainer}>
          <View style={styles.optionLeft}>
            <RadioButton
              value="dark"
              color="black"
              status={appearance === "dark" ? "checked" : "unchecked"}
              onPress={() => setAppearance("dark")}
            />
            <Text style={styles.optionText}>Oscura</Text>
          </View>
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
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
  }
});
