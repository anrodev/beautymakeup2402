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
import { fetchCountries, fetchUpdateUserBilling, fetchUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { CountryType, StateCountryType } from "@/types";

const UpdateBillingSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  address_1: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  state: z.string().min(1, "El estado o provincia es obligatorio"),
  postcode: z.string().min(1, "El código postal es obligatorio"),
  country: z.string().min(1, "El país es obligatorio"),
  email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

export type UpdateBillingSchemaType = z.infer<typeof UpdateBillingSchema>;

const UpdateBilling = () => {
  const modalRef = useRef<ModalRef>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [states, setStates] = useState<StateCountryType[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
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

  const watchCountry = watch("country");
  const watchState = watch("state");

  
  useEffect(() => {
    if (!countries.length) return;

    const selectedCountry = countries.find((c) => c.code === watchCountry);
    if (selectedCountry?.states?.length) {
      setStates(selectedCountry.states);

      if (!selectedCountry.states.find((s) => s.code === watchState)) {
        setValue("state", selectedCountry.states[0].code);
      }
    } else {
      setStates([]);
      setValue("state", "");
    }
  }, [watchCountry, countries]);

  const getInfo = async () => {
    if (!user) return null;
    try {
      setLoading(true);

      const newCountries = await fetchCountries();
      setCountries(newCountries);

      const customer = await fetchUser(user.id);

      setValue("first_name", customer.billing.first_name);
      setValue("last_name", customer.billing.last_name);
      setValue("email", customer.billing.email);
      setValue("phone", customer.billing.phone);
      setValue("country", customer.billing.country || "ES");
      setValue("city", customer.billing.city);
      setValue("postcode", customer.billing.postcode);
      setValue("address_1", customer.billing.address_1);
      setValue("state", customer.billing.state || "");
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
    getInfo();
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

          <Text style={styles.label}>País</Text>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  style={{ height: 50 }}
                >
                  {countries.map((country) => (
                    <Picker.Item
                      key={country.code}
                      label={country.name}
                      value={country.code}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.country && (
            <Text style={styles.error}>{errors.country.message}</Text>
          )}

          <Text style={styles.label}>Estado/Provincia</Text>
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  enabled={states.length > 0}
                  style={{ height: 50 }}
                >
                  {states.map((state) => (
                    <Picker.Item
                      key={state.code}
                      label={state.name}
                      value={state.code}
                    />
                  ))}
                </Picker>
              </View>
            )}
          />
          {errors.state && (
            <Text style={styles.error}>{errors.state.message}</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    marginBottom: 8,
  },
});

export default UpdateBilling;
