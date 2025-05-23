import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { useRouter } from "expo-router";
import { CategoryType } from "@/types";

const Category = ({ item }: { item: CategoryType }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "/(drawer)/(tabs)/shop",
          params: {
            category:item.id.toString()
          },
        })
      }
    >
      <View style={styles.imageWrapper}>
        {item.image?.src ? (
          <Image
            source={{ uri: item.image.src }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("@/assets/images/categories/notfound.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </View>
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "33.33%",
    padding: 8,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 5,
  },
});

export default Category;
