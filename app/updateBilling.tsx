import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchUpdateUserBilling, fetchUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import Toast from "react-native-toast-message";

const UpdateBillingSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  address_1: z.string(),
  city: z.string(),
  state: z.string(),
  postcode: z.string(),
  country: z.string(),
  email: z.string().email("Correo inválido"),
  phone: z.string(),
});

export type UpdateBillingSchemaType = z.infer<typeof UpdateBillingSchema>;

const UpdateBilling = () => {
  const modalRef = useRef<ModalRef>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateBillingSchemaType>({
    resolver: zodResolver(UpdateBillingSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address_1: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: "",
      phone: "",
    },
  });

  const getUser = async () => {
    if (!user) return null;
    try {
      setLoading(true);
      const customer = await fetchUser(user.id);
      setValue("first_name", customer.billing.first_name);
      setValue("last_name", customer.billing.last_name);
      setValue("address_1", customer.billing.address_1);
      setValue("city", customer.billing.city);
      setValue("state", customer.billing.state);
      setValue("postcode", customer.billing.postcode);
      setValue("country", customer.billing.country);
      setValue("email", customer.billing.email);
      setValue("phone", customer.billing.phone);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateBillingSchemaType) => {
    if (!user) return null;
    try {
      setLoading(true);

      await fetchUpdateUserBilling(user.id, data);

      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: `Información de pago editada con éxito 👌`,
        position: "bottom",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);

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

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => modalRef.current?.close()}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Información de Pago</Text>
        </View>
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.label}>Nombre</Text>
          <Controller
            control={control}
            name="first_name"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.first_name && (
            <Text style={styles.error}>{errors.first_name.message}</Text>
          )}

          <Text style={styles.label}>Apellido</Text>
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.last_name && (
            <Text style={styles.error}>{errors.last_name.message}</Text>
          )}

          <Text style={styles.label}>Dirección</Text>
          <Controller
            control={control}
            name="address_1"
            render={({ field }) => (
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Dirección"
                multiline
                numberOfLines={4}
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.address_1 && (
            <Text style={styles.error}>{errors.address_1.message}</Text>
          )}

          <Text style={styles.label}>Ciudad</Text>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Ciudad"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.city && (
            <Text style={styles.error}>{errors.city.message}</Text>
          )}

          <Text style={styles.label}>Estado</Text>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Estado"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.state && (
            <Text style={styles.error}>{errors.state.message}</Text>
          )}

          <Text style={styles.label}>Código Postal</Text>
          <Controller
            control={control}
            name="postcode"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Código postal"
                keyboardType="default"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.postcode && (
            <Text style={styles.error}>{errors.postcode.message}</Text>
          )}

          <Text style={styles.label}>País</Text>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="País"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.country && (
            <Text style={styles.error}>{errors.country.message}</Text>
          )}

          <Text style={styles.label}>Correo Electrónico</Text>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <Text style={styles.label}>Teléfono</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                onBlur={field.onBlur}
                onChangeText={field.onChange}
                value={field.value}
              />
            )}
          />
          {errors.phone && (
            <Text style={styles.error}>{errors.phone.message}</Text>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.checkoutText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
      <LoadingOverlay visible={loading} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  checkoutButton: {
    backgroundColor: "#EB9CA9",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    borderRadius: 12,
  },
  checkoutText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
    color: "#333",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});

export default UpdateBilling;
