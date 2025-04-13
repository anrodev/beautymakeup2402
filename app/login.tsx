import {
  ImageBackground,
  Button,
  Text,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      <ImageBackground
        source={require("@/assets/images/fondo.jpg")}
        style={{ flex: 1, paddingTop:insets.top, paddingBottom:insets.bottom }}
        resizeMode="stretch"
      >
        <Button title="volver" onPress={handleNavigate} />
      </ImageBackground>
    </Animated.View>
  );
}
