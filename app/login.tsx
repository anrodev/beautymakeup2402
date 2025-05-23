import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import Toast from "react-native-toast-message";
import LoadingOverlay from "@/components/LoadingOverlay";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const modalRef = useRef<ModalRef>(null);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginType) => {
    try {
      setLoading(true);

      await login(data.email, data.password);

      modalRef.current?.close();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "email o clave incorrectos",
          position: "bottom",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => modalRef.current?.close()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <Text style={styles.textHeader}>Iniciar sesión</Text>
      </View>

      <ImageBackground
        source={require("@/assets/images/loginBackground.png")}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        resizeMode="stretch"
      >
        <View style={{ width: "100%" }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Correo electrónico"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                selectionColor="white"
                textColor="black"
                theme={{
                  colors: {
                    primary: "black",
                    text: "black",
                    onSurface: "black",
                  },
                }}
                style={styles.textInput}
                error={!!errors.email}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Contraseña"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                selectionColor="white"
                textColor="black"
                theme={{
                  colors: {
                    primary: "black",
                    text: "black",
                    onSurface: "black",
                  },
                }}
                style={[styles.textInput, { marginTop: 16 }]}
                error={!!errors.password}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ImageBackground>
      <LoadingOverlay visible={loading} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginLeft: 16,
  },
  textInput: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    borderWidth: 1.2,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  button: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
});
