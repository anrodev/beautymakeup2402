import { View, Text, ImageBackground, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import global from "@/styles/global";


export default function LoginScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Iniciar sesión",
    });
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/fondo.jpg')}
      style={{flex:1}}
      resizeMode="stretch"
    >
      
    </ImageBackground>
  );
}