import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

type ProductVariationComponentProps = {
  name: string;
  options: string[];
  setOptionSelected: (value: string | null) => void;
};

export default function ProductVariation({
  name,
  options,
  setOptionSelected,
}: ProductVariationComponentProps) {
  const [selected, setSelected] = useState(
    options.length > 0 ? options[0] : null
  );

  useEffect(() => {
    setOptionSelected(selected);
  }, [selected]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{name}:</Text>
      {options.length === 0 ? (
        <Text>No hay opciones disponibles</Text>
      ) : (
        <View style={styles.buttonGroup}>
          {options.map((option) => (
            <Button
              key={option}
              mode={selected === option ? "contained" : "outlined"}
              onPress={() => setSelected(option)}
              buttonColor={selected === option ? "#E24EA5" : undefined} 
              textColor={selected === option ? "white" : "#E24EA5"} 
              style={styles.button}
            >
              {option}
            </Button>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  button: {
    marginVertical: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
});
