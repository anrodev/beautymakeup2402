import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { fetchGiftCard } from "@/lib/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Ionicons } from "@expo/vector-icons";
import { GiftCardOrderType } from "@/types";

const GiftCardCodeSchema = z.object({
  code: z.string().min(1, "El codigo es requerido"),
});

type GiftCardCodeSchemaType = z.infer<typeof GiftCardCodeSchema>;

type GiftCardCodeProps = {
  giftCards: GiftCardOrderType[];
  setGiftCards: (value: GiftCardOrderType[]) => void;
};

export default function GiftCardCode({
  giftCards,
  setGiftCards,
}: GiftCardCodeProps) {
  const [loading, setLoading] = useState(false);
  const [applyCode, setApplyCode] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GiftCardCodeSchemaType>({
    resolver: zodResolver(GiftCardCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const deleteGiftCard = (code: string) => {
    const newGiftCard = giftCards.filter((item) => item.code !== code);

    setGiftCards([...newGiftCard]);
  };

  const clear = () => {
    reset();
    setApplyCode(false);
  };

  const onSubmit = async (data: GiftCardCodeSchemaType) => {
    setLoading(true);

    try {
      const giftCard = await fetchGiftCard(data.code);

      reset();

      if (giftCard.length>0 && giftCard[0].is_active==="on") {

        setApplyCode(false);

        setGiftCards([...giftCards, {code:giftCard[0].code,amount:giftCard[0].balance}]);

        Toast.show({
          type: "success",
          text1: "¡Éxito!",
          text2: `Tarjeta de regalo agregada con éxito 👌`,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `Tarjeta de regalo no válida 😓`,
          position: "bottom",
        });
      }
    } catch (error) {
      console.error("Error:", error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un problema al validar tarjeta de regalo 😓",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!applyCode && (
        <TouchableOpacity
          style={styles.coupon}
          onPress={() => setApplyCode(true)}
        >
          <Ionicons name="gift-sharp" size={20} color="black" />
          <Text style={styles.couponText}>Aplicar tarjeta de regalo</Text>
        </TouchableOpacity>
      )}

      {applyCode && (
        <TouchableOpacity style={styles.coupon} onPress={clear}>
          <Ionicons name="gift-sharp" size={20} color="red" />
          <Ionicons name="remove-circle-outline" size={20} color="red" />
          <Text style={{ ...styles.couponText, color: "red" }}>
            Cancelar tarjeta de regalo
          </Text>
        </TouchableOpacity>
      )}

      {applyCode && (
        <>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Ingrese el codigo"
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Aplicar</Text>
          </TouchableOpacity>
        </>
      )}

      {giftCards.map((item, index) => (
        <View style={styles.giftCard} key={index}>
          <View style={styles.cardContent}>
            <Ionicons
              name="gift-sharp"
              size={24}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.balanceText}>
              {item.amount} € de descuento
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteGiftCard(item.code)}
          >
            <Ionicons name="close-circle" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      <LoadingOverlay visible={loading} />
    </>
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
  coupon: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  couponText: { marginLeft: 10 },
  giftCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5b4bfff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  balanceText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 4,
  },
});
