import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { fetchCoupon } from "@/lib/api";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Ionicons } from "@expo/vector-icons";
import { CouponType } from "@/types";

const couponSchema = z.object({
  coupon: z.string().min(1, "El cupon es requerido"),
});

type CouponSchemaType = z.infer<typeof couponSchema>;

type CouponProps = {
  coupons: CouponType[];
  setCoupons: (value: CouponType[]) => void;
};

export default function Coupon({ coupons, setCoupons }: CouponProps) {
  const [loading, setLoading] = useState(false);
  const [applyCoupon, setApplyCoupon] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponSchemaType>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      coupon: "",
    },
  });

  const clear = () => {
    setCoupons([]);

    reset();

    setApplyCoupon(false);
  };

  const isCouponExpired = (coupon: CouponType): boolean => {
    if(coupon.date_expires==null){
      return false;
    }
    const now = new Date();
    const expires = new Date(coupon.date_expires);
    return expires < now;
  };

  const isCouponUsed = (coupon: CouponType): boolean => {
    return coupon.usage_count > 0 || coupon.used_by.length > 0;
  };

  const isCouponValid = (coupon: CouponType[]): boolean => {
    if (coupon.length > 0) {
      return !isCouponExpired(coupon[0]);
    }

    return false;
  };

  const onSubmit = async (data: CouponSchemaType) => {
    setLoading(true);

    try {
      const coupon = await fetchCoupon(data.coupon);

      console.log(coupon);

      reset();

      if (isCouponValid(coupon)) {

        setCoupons([...coupon]);

        Toast.show({
          type: "success",
          text1: "¡Éxito!",
          text2: `cupon agregado con éxito 👌`,
          position: "bottom",
        });

      }else{

        Toast.show({
          type: "error",
          text1: "Error",
          text2: `El cupon no es válido 😓`,
          position: "bottom",
        });
      }

    } catch (error) {
      console.error("Error:", error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un problema al validar cupon 😓",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!applyCoupon && (
        <TouchableOpacity
          style={styles.coupon}
          onPress={() => setApplyCoupon(true)}
        >
          <Ionicons name="pricetag-outline" size={20} color="black" />
          <Text style={styles.couponText}>Aplicar cupón</Text>
        </TouchableOpacity>
      )}

      {applyCoupon && (
        <TouchableOpacity style={styles.coupon} onPress={clear}>
          <Ionicons name="pricetag-outline" size={20} color="red" />
          <Ionicons name="remove-circle-outline" size={20} color="red" />
          <Text style={{ ...styles.couponText, color: "red" }}>
            Cancelar cupón
          </Text>
        </TouchableOpacity>
      )}

      {applyCoupon && coupons.length == 0 && (
        <>
          <Controller
            control={control}
            name="coupon"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Ingrese el cupón"
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
                error={!!errors.coupon}
              />
            )}
          />
          {errors.coupon && (
            <Text style={styles.errorText}>{errors.coupon.message}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Aplicar</Text>
          </TouchableOpacity>
        </>
      )}

      {coupons.map((item, index) => (
        <View
          style={{ ...styles.coupon, backgroundColor: "#dfdfdfff" }}
          key={index}
        >
          <Ionicons name="pricetag-outline" size={20} color="black" />
          <Text style={styles.couponText}>
            {item.amount} {item.discount_type === "percent" ? "%" : "€"} de
            descuento
          </Text>
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
});
