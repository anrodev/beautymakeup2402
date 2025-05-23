import { View, Text, TouchableOpacity } from "react-native";
import { Drawer } from "expo-router/drawer";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { Share } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function DrawerLayout() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const handleEmail = () => {
    const email = "info@beautymakeup2402.es";
    const url = `mailto:${email}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error al intentar abrir el correo:", err)
    );
  };

  const handleCall = () => {
    const phoneNumber = "tel:+34662539564";
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Error al intentar llamar:", err)
    );
  };

  const handleShare = async () => {
    const url = "https://beautymakeup2402.es";

    try {
      await Share.share({
        message: `Visita esta página: ${url}`,
        url: url,
      });
    } catch (error) {
      console.error("Error al intentar compartir:", error);
    }
  };

  const handleLogout = () => {
    
    logout();

    router.push("/(drawer)/(tabs)");

  };


  const CustomDrawerContent = (props: DrawerContentComponentProps) => (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Menu</Text>
      </View>
      <DrawerItem
        label={"Inicio"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="home-outline" size={size} color="black" />
        )}
        onPress={() => router.push("/(drawer)/(tabs)")}
      />
      <DrawerItem
        label={"Tienda"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="cart-outline" size={size} color="black" />
        )}
        onPress={() => router.push("/(drawer)/(tabs)/shop")}
      />
      <DrawerItem
        label={"Categorías"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="grid-outline" size={size} color="black" />
        )}
        onPress={() => router.push("/(drawer)/(tabs)/categories")}
      />
      <DrawerItem
        label={"Perfil"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="person-circle-outline" size={size} color="black" />
        )}
        onPress={() => router.push("/(drawer)/(tabs)/profile")}
      />
      <DrawerItem
        label={"Ajustes"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="settings-outline" size={size} color="black" />
        )}
        onPress={() => router.push("/settings")}
      />

      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
          marginVertical: 10,
        }}
      />

      <DrawerItem
        label={"Correo electrónico"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="mail-outline" size={size} color="black" />
        )}
        onPress={handleEmail}
      />

      <DrawerItem
        label={"Llamar"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="call-outline" size={size} color="black" />
        )}
        onPress={handleCall}
      />

      <DrawerItem
        label={"Compartir"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons name="share-social-outline" size={size} color="black" />
        )}
        onPress={handleShare}
      />

      {user && (
        <DrawerItem
          label={"Salir"}
          labelStyle={{ color: "black" }}
          icon={({ color, size }) => (
            <Ionicons name="exit-outline" size={size} color="black" />
          )}
          onPress={handleLogout}
        />
      )}
    </DrawerContentScrollView>
  );

  return (
    <>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      </Drawer>

      <StatusBar style="auto" />
    </>
  );
}
