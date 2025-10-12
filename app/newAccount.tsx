import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchCreateUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const newAccountSchema = z.object({
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
  username: z.string().min(1, "El nombre de usuario es requerido"),
  name: z.string(),
  password: z
    .string()
    .min(1, "La clave es requerida")
    .min(6, "Mínimo 6 caracteres"),
});

type NewAccountType = z.infer<typeof newAccountSchema>;

export default function NewAccountScreen() {
  const modalRef = useRef<ModalRef>(null);

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<NewAccountType>({
    resolver: zodResolver(newAccountSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: NewAccountType) => {
    try {
      setLoading(true);

      const user = await fetchCreateUser(
        data.email,
        data.username,
        data.name,
        data.password
      );

      await login(user.email, data.password);

      reset();

      modalRef.current?.close();

    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
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

        <Text style={styles.textHeader}>Nueva Cuenta</Text>
      </View>

      <View style={styles.container}>
        <ScrollView>
          <View style={{ width: "100%" }}>
            <View style={{ marginBottom: 16 }}>
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
            </View>

            <View style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Nombre de usuario "
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
                    error={!!errors.username}
                  />
                )}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Nombre"
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
                    error={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name.message}</Text>
              )}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Contraseña"
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
                    style={[styles.textInput]}
                    error={!!errors.password}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

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

  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
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
