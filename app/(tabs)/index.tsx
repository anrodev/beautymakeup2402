import { Image, StyleSheet, Platform, Button, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useRouter } from "expo-router";


export default function HomeScreen() {

  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFF" }}>

      <Button title="Iniciar sesión" onPress={() => router.push('/login')} />
      
    </View>
  );
}

