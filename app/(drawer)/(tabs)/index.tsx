import { Image, StyleSheet, Platform, Button, View,TouchableOpacity,Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useRouter,Link } from "expo-router";


export default function HomeScreen() {

  const router = useRouter();

  const handleNavigate = () => {
    router.push("/login"); // Navega a la ruta /login
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFF" }}>

<TouchableOpacity
     
      onPress={handleNavigate} // Ejecuta la navegación al tocar
    >
      <Text >Login</Text>
    </TouchableOpacity>
      
    </View>
  );
}

