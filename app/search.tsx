import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-paper";
import LoadingOverlay from "@/components/LoadingOverlay";

const searchSchema = z.object({
  search: z.string().min(1, "El campo es requerido"),
});

type SearchSchemaType = z.infer<typeof searchSchema>;

export default function SearchScreen() {
  const modalRef = useRef<ModalRef>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: "",
    },
  });

  const onSubmit = async (data: SearchSchemaType) => {
    setLoading(true);
    setTimeout(() => {
      router.replace({
        pathname: "/(drawer)/(tabs)/shop",
        params: {
          filter: JSON.stringify({ category: null, search: data.search }),
        },
      });
      setLoading(false);
    }, 500);
  };

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

          <Text style={styles.textHeader}>Buscar</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Buscar"
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
              error={!!errors.search}
            />
          )}
        />
        {errors.search && (
          <Text style={styles.errorText}>{errors.search.message}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Buscar</Text>
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
    padding: 20,
    backgroundColor: "white",
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
});
