import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchResetUserPassword,
  fetchSetUserPassword,
  fetchValidateUserCode,
} from "@/lib/api";
import Toast from "react-native-toast-message";
import { useState } from "react";

const sendValidationCodeSchema = z.object({
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
});

type SendValidationCodeSchemaType = z.infer<typeof sendValidationCodeSchema>;

type SendValidationCodePropsType = {
  setLoading: (value: boolean) => void;
  setEmail: (value: string) => void;
};

export const SendValidationCode = ({
  setLoading,
  setEmail,
}: SendValidationCodePropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SendValidationCodeSchemaType>({
    resolver: zodResolver(sendValidationCodeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: SendValidationCodeSchemaType) => {
    try {
      setLoading(true);

      await fetchResetUserPassword(data.email);

      setEmail(data.email);
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message === "No user found with this email address." ? "El usuario no existe" :error.message,
          position: "bottom",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const validateCodeSchema = z.object({
  code: z.string().min(1, "El codigo es requerido"),
});

type ValidateCodeSchemaType = z.infer<typeof validateCodeSchema>;

type ValidateCodePropsType = {
  email: string;
  setLoading: (value: boolean) => void;
  setCode: (value: string) => void;
};

export const ValidateCode = ({
  email,
  setLoading,
  setCode,
}: ValidateCodePropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateCodeSchemaType>({
    resolver: zodResolver(validateCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: ValidateCodeSchemaType) => {
    try {
      setLoading(true);

      await fetchValidateUserCode(email, data.code);

      setCode(data.code);

    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "El codigo no es valido",
          position: "bottom",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={{ ...styles.card, marginBottom: 20 }}>
        <MaterialCommunityIcons
          name="email-send-outline"
          size={48}
          color="#EB9CA9"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.title}>¡Revisa tu correo!</Text>
        <Text style={styles.message}>
          Hemos enviado un código a tu dirección de correo electrónico. Si no
          ves el correo, revisa tu carpeta de spam o promociones.
        </Text>
      </View>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Ingresa el codigo"
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
            error={!!errors.code}
          />
        )}
      />
      {errors.code && (
        <Text style={styles.errorText}>{errors.code.message}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(1, "La clave es requerida")
    .min(6, "Mínimo 6 caracteres"),
});

type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;

type ChangePasswordPropsType = {
  email: string;
  code: string;
  setLoading: (value: boolean) => void;
  close: () => void;
};

export const ChangePassword = ({
  setLoading,
  close,
  email,
  code,
}: ChangePasswordPropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const [successfulChange, setSuccessfulChange] = useState(false);

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    try {
      setLoading(true);

      await fetchSetUserPassword(email, code, data.password);

      setSuccessfulChange(true);

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
    <View style={{ width: "100%" }}>
      {!successfulChange ? (
        <>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nueva Contraseña"
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
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="check-decagram"
            size={60}
            color="#4CAF50"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.title}>¡Contraseña actualizada!</Text>
          <Text style={styles.message}>
            Tu contraseña se ha cambiado exitosamente.{"\n"}
            Ahora puedes iniciar sesión con tus nuevas credenciales.
          </Text>

          <TouchableOpacity style={styles.button} onPress={close}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

  card: {
    backgroundColor: "rgba(250, 221, 224, 0.6)",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: "#000000ff",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
