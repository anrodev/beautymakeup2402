import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, forwardRef, useImperativeHandle } from "react";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ProductGiftCardType } from "@/types";


const giftCardSchema = z.object({
  email: z.string().email("Correo inválido"),
  from: z.string().min(1, "El campo es requerido"),
  message: z.string(),
  date: z.string(),
});

type GiftCardSchemaType = z.infer<typeof giftCardSchema>;

export type GiftCardRefType = {
  submit: () => void;
};

export type GiftCardPropsType = {
  price: number;
  addProduct: (giftCard: ProductGiftCardType) => void;
};

const GiftCard = forwardRef<GiftCardRefType, GiftCardPropsType>(
  ({ price, addProduct}, ref) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<GiftCardSchemaType>({
      resolver: zodResolver(giftCardSchema),
      defaultValues: {
        email: "",
        from: "",
        message: "",
        date: new Date().toISOString().split("T")[0],
      },
    });

    useImperativeHandle(ref, () => ({
      submit: handleSubmit(async (data) => {
        const giftCardData: ProductGiftCardType = {
          recipient: data.email,
          sender: data.from,
          balance: price,
          deliver_date: `${data.date} 00:00:00`,
        };

        console.log("tarjeta de regalo", giftCardData);

        addProduct(giftCardData);

        reset();
      }),
    }));

    const [showPicker, setShowPicker] = useState(false);

    return (
      <View>
        <View style={{ marginTop: 10 }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="A"
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

        <View style={{ marginTop: 10 }}>
          <Controller
            control={control}
            name="from"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="De"
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
                error={!!errors.from}
              />
            )}
          />
          {errors.from && (
            <Text style={styles.errorText}>{errors.from.message}</Text>
          )}
        </View>

        <View style={{ marginTop: 10 }}>
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Mensaje"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                selectionColor="white"
                textColor="black"
                theme={{
                  colors: {
                    primary: "black",
                    text: "black",
                    onSurface: "black",
                  },
                }}
                style={[styles.textInput, styles.textArea]}
              />
            )}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                  <TextInput
                    label="Fecha de entrega"
                    value={value}
                    editable={false}
                    style={styles.textInput}
                  />
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      setShowPicker(false);
                      if (selectedDate) {
                        const formatted = selectedDate
                          .toISOString()
                          .split("T")[0];
                        onChange(formatted);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    borderWidth: 1.2,
    borderColor: "black",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 8,
  },
});

export default GiftCard;
