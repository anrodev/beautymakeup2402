import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

const dateRangeSchema = z.object({
  dateFrom: z.string().min(1, "El campo es requerido"),
  dateTo: z.string().min(1, "El campo es requerido"),
});

type DateRangeSchemaType = z.infer<typeof dateRangeSchema>;

export type GiftCardPropsType = {
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  setClear: (value: boolean) => void;
  search: () => void;
};

const DateRange = ({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  search,
  setClear,
}: GiftCardPropsType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DateRangeSchemaType>({
    resolver: zodResolver(dateRangeSchema),
    defaultValues: {
      dateFrom: dateFrom,
      dateTo: dateTo,
    },
  });

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [activeField, setActiveField] = useState<"dateFrom" | "dateTo" | null>(
    null
  );

  const [active, setActive] = useState(false);

  const parseLocalDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const clear = () => {
    setDateFrom("");
    setDateTo("");
    reset();
    setClear(true);
  };

  const onSubmit = async (data: DateRangeSchemaType) => {
    search();
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        style={{...styles.button,backgroundColor:"#EB9CA9"}}
        onPress={() => setActive(!active)}
      >
        <FontAwesome name="calendar" size={20} color="black" />
        <Text style={{...styles.buttonText,color:"black"}}>
          {dateFrom && dateTo ? `${dateFrom} | ${dateTo}` : "Seleccionar fechas"}
        </Text>
      </TouchableOpacity>

      {active && (
        <>
          <View style={{ marginTop: 10 }}>
            <Controller
              control={control}
              name="dateFrom"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity onPress={() => setActiveField("dateFrom")}>
                    <TextInput
                      label="Fecha desde"
                      value={value}
                      editable={false}
                      style={styles.textInput}
                    />
                  </TouchableOpacity>
                  {errors.dateFrom && (
                    <Text style={styles.errorText}>
                      {errors.dateFrom.message}
                    </Text>
                  )}
                  {activeField === "dateFrom" && (
                    <DateTimePicker
                      value={
                        value
                          ? parseLocalDate(value)
                          : parseLocalDate(todayString)
                      }
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setActiveField(null);
                        if (selectedDate) {
                          const formatted = selectedDate
                            .toISOString()
                            .split("T")[0];
                          onChange(formatted);
                          setDateFrom(formatted);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Controller
              control={control}
              name="dateTo"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity onPress={() => setActiveField("dateTo")}>
                    <TextInput
                      label="Fecha hasta"
                      value={value}
                      editable={false}
                      style={styles.textInput}
                    />
                  </TouchableOpacity>
                  {errors.dateTo && (
                    <Text style={styles.errorText}>
                      {errors.dateTo.message}
                    </Text>
                  )}
                  {activeField === "dateTo" && (
                    <DateTimePicker
                      value={
                        value
                          ? parseLocalDate(value)
                          : parseLocalDate(todayString)
                      }
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setActiveField(null);
                        if (selectedDate) {
                          const formatted = selectedDate
                            .toISOString()
                            .split("T")[0];
                          onChange(formatted);
                          setDateTo(formatted);
                        }
                      }}
                    />
                  )}
                </>
              )}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.buttonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
            {(dateFrom || dateTo) && (
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.button} onPress={clear}>
                  <MaterialCommunityIcons
                    name="restart"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.buttonText}>Limpiar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  button: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    width: "100%",
    backgroundColor: "black",
    borderRadius: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DateRange;
