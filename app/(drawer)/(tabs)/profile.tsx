import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {

  const router = useRouter();

  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionContainer}  onPress={()=>router.push("/login")}>
        <View style={{...styles.optionLeft,paddingTop:20, paddingBottom:20}}>
          <Ionicons name="person-circle" size={46} color="#CFCFCF" />
          <Text style={{...styles.optionText, fontSize:22, fontWeight:"bold"}}>{user ? user.nicename : 'Invitado'}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer} onPress={()=>router.push("/settings")}>
        <View style={styles.optionLeft}>
          <Ionicons name="settings-outline" size={30} color="black" />
          <Text style={styles.optionText}>Ajustes</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor:"#FFFFFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0"
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center"
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black"
  },
});
