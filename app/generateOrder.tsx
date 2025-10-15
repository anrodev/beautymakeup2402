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
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContext";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchGenerateOrder, fetchAddGiftCards, fetchUser, fecthCalculateShipping } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import { ProductGiftCardType } from "@/types";
import Toast from "react-native-toast-message";

const schema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  address_1: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  state: z.string().min(1, "El estado es obligatorio"),
  postcode: z.string().min(1, "El código postal es obligatorio"),
  country: z.string().min(1, "El país es obligatorio"),
  email: z.string().email("Correo inválido"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

export type OrderSchemaType = z.infer<typeof schema>;

export default function GenerateOrderScreen() {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();
  const { cart, coupons, giftCards } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderSchemaType>({
    resolver: zodResolver(schema),
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

  const getCustomer = async () => {
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

  const isDateValidAndOneDayAhead = (dateStr: string): boolean => {
    const formatRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!formatRegex.test(dateStr)) return false;

    const inputDate = new Date(dateStr.replace(" ", "T"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return inputDate >= tomorrow;
  };

  const newDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);
    return now.toISOString().replace("T", " ").slice(0, 19);
  };

  const onSubmit = async (data: OrderSchemaType) => {
    try {
      setLoading(true);

      const calculateShipping = await fecthCalculateShipping(data, cart);

      const chosenMethod = calculateShipping.chosen_method;

      const code = coupons.length > 0 ? coupons[0].code : null;

      const order = await fetchGenerateOrder(data, cart, code, giftCards, chosenMethod);

      const giftCardsOrder = cart
        .filter((item) => item.gift_card != null)
        .map((item) => {
          const { recipient, sender, message, balance, deliver_date } =
            item.gift_card!;

          const deliverDate = isDateValidAndOneDayAhead(deliver_date!)
            ? deliver_date
            : newDate();

          const order_item = order.lineItems.find(
            (ord) => ord.product_id === item.id
          );

          const newGiftCards: ProductGiftCardType = {
            recipient,
            sender,
            balance,
            message,
            order_id: order.orderId,
            order_item_id: order_item?.id,
          };

          if (deliverDate) {
            newGiftCards.deliver_date = deliverDate;
          }

          return newGiftCards;
        });

      if (giftCardsOrder.length > 0) {
        await fetchAddGiftCards(giftCardsOrder);
      }

      console.log("cart:",JSON.stringify(cart,null,2));

      console.log("data:",JSON.stringify(data,null,2));

      router.push({
        pathname: "/checkout",
        params: {
          orderId: order.orderId,
          orderKey: order.orderKey,
          paymentUrl: order.paymentUrl,
        },
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
    getCustomer();
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
          <Text style={styles.textHeader}>Información del Pedido</Text>
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
}

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
