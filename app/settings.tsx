import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRef } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
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

        <Text style={styles.textHeader}>Ajustes</Text>
      </View>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => router.push("/appearance")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="moon-outline" size={24} color="black" />
            <Text style={styles.optionText}>Apariencia</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>

        <View
          style={styles.optionContainer}
        >
          <View style={styles.optionLeft}>
            <MaterialIcons name="attach-money" size={24} color="black" />

            <View style={{flex:1,flexDirection:"column"}}>
              <Text style={styles.optionText}>Divisa</Text>

              <Text style={styles.optionSpan}>EUR</Text>
            </View>
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
    marginBottom: 20,
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
  },
  optionSpan:{
    fontSize: 13,
    marginLeft: 10,
    color: "grey",
  }
});
