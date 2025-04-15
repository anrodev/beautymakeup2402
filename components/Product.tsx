import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { useRouter } from "expo-router";

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface ProductComponentProps {
  item: ProductProps;
  row: boolean;
}

export default function Product({ item, row }: ProductComponentProps) {
  const router = useRouter();
  return (
    <>
      {!row ? (
        <TouchableOpacity
          style={stylesTwoItem.card}
          onPress={() =>
            router.push({
              pathname: "/productDetail",
              params: { ...item },
            })
          }
        >
          <View style={stylesTwoItem.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={stylesTwoItem.image}
              resizeMode="cover"
            />
            <View style={stylesTwoItem.stockBadge}>
              <Text style={stylesTwoItem.stockText}>{item.stock} en stock</Text>
            </View>
          </View>
          <Text style={stylesTwoItem.name}>{item.name}</Text>
          <Text style={stylesTwoItem.price}>{item.price} €</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={stylesOneItem.card}
          onPress={() =>
            router.push({
              pathname: "/productDetail",
              params: { ...item },
            })
          }
        >
          <Image
            source={{ uri: item.image }}
            style={stylesOneItem.image}
            resizeMode="cover"
          />

          <View style={stylesOneItem.infoContainer}>
            <Text style={stylesOneItem.name}>{item.name}</Text>
            <Text style={stylesOneItem.price}>{item.price} €</Text>
            <Text style={stylesOneItem.stock}>{item.stock} en stock</Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
}

const stylesTwoItem = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  stockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    textAlign: "justify",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: "#444",
  },
});

const stylesOneItem = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    position: "relative",
    justifyContent: "center",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
    textAlign: "left",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  stock: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
  },
});
