import {
  ImageBackground,
  Button,
  Text,
  Dimensions,
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [animation] = useState(new Animated.Value(0));

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const handleNavigate = () => {
    Animated.timing(animation, {
      toValue: screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      router.dismiss();
    });
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: animation }],
      }}
    >
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleNavigate}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <Text
            style={styles.textHeader}
          >
            Iniciar sesión
          </Text>
        </View>

        <ImageBackground
          source={require("@/assets/images/fondo.jpg")}
          style={{
            flex: 1,
          }}
          resizeMode="stretch"
        ></ImageBackground>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FADDE0",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginLeft: 16
  },
});
