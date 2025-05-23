import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchProductById } from "@/lib/api";
import { ProductType } from "@/types";

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [productTiktok, setProductTiktok] = useState<ProductType | null>(null);

  const getProductTiktok = async () => {
    try {
      setLoading(true);

      const product = await fetchProductById(5248);

      setProductTiktok(product);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const openLotteryURL = async () => {
    const url = "https://beautymakeup2402.es/sorteos";
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("No se puede abrir la URL:", url);
    }
  };

  useEffect(() => {
    getProductTiktok();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ImageBackground
        source={require("@/assets/images/bannerHome.png")}
        style={{ flex: 4, justifyContent: "flex-end" }}
        imageStyle={{ borderRadius: 20 }}
        resizeMode="stretch"
      >
        <View style={styles.overlay}>
          <Text style={styles.smallText}>NO TE LO PIERDAS</Text>
          <Text style={styles.title}>
            Reserva tu plaza para la compra en los directos de tiktok
          </Text>
          {productTiktok &&<TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/productDetail",
                params: {
                  ...productTiktok,
                  id: productTiktok.id.toString(),
                  price: productTiktok.price.toString(),
                  stock_quantity: productTiktok.stock_quantity.toString(),
                  images: JSON.stringify(productTiktok.images),
                },
              })
            }
          >
            <Text style={styles.buttonText}>COMPRAR</Text>
          </TouchableOpacity>}
        </View>
      </ImageBackground>
      <TouchableOpacity
        onPress={openLotteryURL}
        style={{
          flex: 1.3,
          marginTop: 20,
        }}
      >
        <ImageBackground
          source={require("@/assets/images/bannerLottery.png")}
          style={{
            width: "100%",
            height: "100%",
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
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(drawer)/(tabs)/shop",
            params: {
              category: "223",
            },
          })
        }
        style={{
          flex: 1.3,
          marginTop: 20,
        }}
      >
        <ImageBackground
          source={require("@/assets/images/chuches.jpg")}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
          imageStyle={{ borderRadius: 20 }}
          resizeMode="stretch"
        >
          <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
            Chuches
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      <LoadingOverlay visible={loading} />
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
  },
});
