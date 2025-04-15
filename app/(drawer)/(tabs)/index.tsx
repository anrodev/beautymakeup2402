import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ImageBackground
        source={require("@/assets/images/bannerHome.png")}
        style={{ flex: 4, justifyContent: "flex-end", }}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="stretch"
      >
        <View style={styles.overlay}>
          <Text style={styles.smallText}>NO TE LO PIERDAS</Text>
          <Text style={styles.title}>
            Reserva tu plaza para la compra en los directos de tiktok
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>COMPRAR</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <ImageBackground
        source={require("@/assets/images/bannerLottery.png")}
        style={{
          flex: 1,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="stretch"
      >
        <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
          Sorteo
        </Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  overlay: {
    padding: 16,
  },
  smallText: {
    color: "#333",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "500",
  },
  title: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFE0E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  }
});
