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

export default function DrawerLayout() {
  const router = useRouter();

  const handleEmail = () => {
    const email = 'john.doe@example.com'; 
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(err => console.error('Error al intentar abrir el correo:', err));
  };

  const handleCall = () => {
    const phoneNumber = 'tel:9876543210';
    Linking.openURL(phoneNumber).catch(err => console.error('Error al intentar llamar:', err));
  };

  
  const handleShare = async () => {
    const url = 'https://beautymakeup2402.es';

    try {
      await Share.share({
        message: `Visita esta página: ${url}`,
        url: url
      });
    } catch (error) {
      console.error('Error al intentar compartir:', error);
    }
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
        label={"Acerca de"}
        labelStyle={{ color: "black" }}
        icon={({ color, size }) => (
          <Ionicons
            name="information-circle-outline"
            size={size}
            color="black"
          />
        )}
        onPress={() => null}
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
        onPress={() => null}
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
