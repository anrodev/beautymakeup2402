import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { useRouter } from "expo-router";

import { ProductType } from "@/types";

import cleanHtml from "@/lib/utils/cleanHtml";

export type ProductComponentProps = {
  item: ProductType;
  row: boolean;
};

const Product = ({ item, row }: ProductComponentProps) => {


  const router = useRouter();
  return (
    <>
      {!row ? (
        <TouchableOpacity
          style={stylesTwoItem.card}
          onPress={() =>
            router.push({
              pathname: "/productDetail",
              params: {
                ...item,
                id: item.id.toString(),
                price: item.price.toString(),
                price_html: cleanHtml(item.price_html),
                stock_quantity: item.stock_quantity.toString(),
                images: JSON.stringify(item.images),
                attributes: JSON.stringify(item.attributes)
              },
            })
          }
        >
          <View style={stylesTwoItem.imageWrapper}>
            {item.images.length > 0 ? (
              <Image
                source={{ uri: item.images[0].src }}
                style={stylesTwoItem.image}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("@/assets/images/categories/notfound.jpg")}
                style={stylesTwoItem.image}
                resizeMode="cover"
              />
            )}

            {item.stock_quantity > 0 ? (
              <View style={stylesTwoItem.stockBadge}>
                <Text style={stylesTwoItem.stockText}>
                  {item.stock_quantity} en stock
                </Text>
              </View>
            ) : (
              <View style={stylesTwoItem.stockBadgeError}>
                <Text style={stylesTwoItem.stockText}>sin en stock</Text>
              </View>
            )}
          </View>
          <Text style={stylesTwoItem.name}>{item.name}</Text>
          <Text style={stylesTwoItem.price}>{cleanHtml(item.price_html)}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={stylesOneItem.card}
          onPress={() =>
            router.push({
              pathname: "/productDetail",
              params: {
                ...item,
                id: item.id.toString(),
                price: item.price.toString(),
                price_html: cleanHtml(item.price_html),
                stock_quantity: item.stock_quantity.toString(),
                images: JSON.stringify(item.images),
                attributes: JSON.stringify(item.attributes)
              },
            })
          }
        >
          {item.images.length > 0 ? (
            <Image
              source={{ uri: item.images[0].src }}
              style={stylesOneItem.image}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@/assets/images/categories/notfound.jpg")}
              style={stylesOneItem.image}
              resizeMode="cover"
            />
          )}

          <View style={stylesOneItem.infoContainer}>
            <Text style={stylesOneItem.name}>{item.name}</Text>
            <Text style={stylesOneItem.price}>{cleanHtml(item.price_html)}</Text>
            {item.stock_quantity > 0 ? (
              <Text style={stylesOneItem.stock}>
                {item.stock_quantity} en stock
              </Text>
            ) : (
              <Text style={stylesOneItem.stockError}>sin stock</Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

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
  stockBadgeError: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#d92b10",
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
  stockError: {
    fontSize: 13,
    color: "#d92b10",
    fontWeight: "600",
  },
});

export default Product;
