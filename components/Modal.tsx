import { Dimensions, Animated, View } from "react-native";
import { useRouter } from "expo-router";
import { useState, useImperativeHandle, ReactNode, forwardRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface ModalRef {
  close: () => void;
}

export interface ModalProps {
  children: ReactNode;
  color?: string;
}

const Modal = forwardRef<ModalRef, ModalProps>(({ children, color }, ref) => {
  const screenWidth = Dimensions.get("window").width;

  const [animation] = useState(new Animated.Value(0));

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const close = () => {
    Animated.timing(animation, {
      toValue: screenWidth,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      router.dismiss();
    });
  };

  useImperativeHandle(ref, () => ({
    close
  }));

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ translateX: animation }],
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor:color??"white",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
});

export default Modal;
