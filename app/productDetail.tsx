import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { useRef, useEffect, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Product from "@/components/Product";
import { ProductType, ProductVariationType } from "@/types";
import { useCart } from "@/context/CartContext";
import HeaderActions from "@/components/HeaderActions";
import Toast from "react-native-toast-message";
import ProductVariation from "@/components/ProductVariation";
import LoadingOverlay from "@/components/LoadingOverlay";
import { fetchProductVariations } from "@/lib/api";

type AttributeType = {
  name: string;
  option: string | null;
};

export default function ProductDetailScreen() {
  const { width } = useWindowDimensions();

  const modalRef = useRef<ModalRef>(null);

  const params = useLocalSearchParams();

  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedAttributes, setSelectedAttributes] = useState<AttributeType[]>(
    []
  );

  const [productVariations, setProductVariations] = useState<
    ProductVariationType[]
  >([]);

  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductType>({
    id: Number(params.id),
    name: params.name as string,
    description: params.description as string,
    type: params.type as string,
    price: Number(params.price),
    regular_price: Number(params.regular_price),
    sale_price: Number(params.sale_price),
    price_html: params.price_html as string,
    stock_quantity: Number(params.stock_quantity),
    images: params.images ? JSON.parse(params.images as string) : [],
    attributes: params.attributes
      ? JSON.parse(params.attributes as string)
      : [],
  });

  const [products, setProducts] = useState<ProductType[]>([]);

  const [loading, setLoading] = useState(false);

  const changeAttribute = (name: string, option: string | null) => {
  
    const index = selectedAttributes.findIndex((attr) => attr.name == name);

    if (index !== -1) {
      if (option) {
        setSelectedAttributes((prev) => {
          const attributes = [...prev];
          attributes[index] = { ...attributes[index], option };
          return attributes;
        });
      } else {
        setSelectedAttributes((prev) =>
          prev.filter((attr) => attr.name != name)
        );
      }
    } else {
      if (option) {
        setSelectedAttributes((prev) => [...prev, { name, option }]);
      }
    }
  };

  const getVariant = () => {
    const productVariation = productVariations.find((vrt) =>
      selectedAttributes.every((sattr) =>
        vrt.attributes.some(
          (attr) => attr.name === sattr.name && attr.option === sattr.option
        )
      )
    );

    if (productVariation) {

      setProduct((prev) => ({
        ...prev,
        id:  Number(productVariation.id),
        price: Number(productVariation.price),
        images: [productVariation.image],
        stock_quantity: productVariation.stock_quantity,
      }));

    }
  };

  const getProductVariations = async (id: number) => {
    try {
      
      setLoading(true);

      const variations = await fetchProductVariations(id);

      setProductVariations(variations);


    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      await addToCart({ ...product, amount: 1 });

      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: `${product.name} agregado con éxito 👌`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error al agregar el producto:", error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un problema al agregar el producto 😓",
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    if (product && product.type == "variable") {
      getProductVariations(product.id);
    }
  }, []);

  useEffect(() => {
    getVariant();
  }, [selectedAttributes]);

  return (
    <Modal ref={modalRef}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => modalRef.current?.close()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <HeaderActions />
      </View>

      <FlatList
        data={products}
        ListHeaderComponent={
          <View>
            <FlatList
              data={product.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              contentContainerStyle={{ alignItems: "center" }}
              keyExtractor={(_, idx) => idx.toString()}
              onMomentumScrollEnd={(ev) => {
                const newIndex = Math.round(
                  ev.nativeEvent.contentOffset.x /
                    ev.nativeEvent.layoutMeasurement.width
                );
                setActiveIndex(newIndex);
              }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.src }}
                  style={[styles.image, { width: width - 32 }]}
                  resizeMode="contain"
                />
              )}
            />
            <View style={styles.pagination}>
              {product.images.map((_: { src: string }, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    activeIndex === i ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price_html}</Text>
            <Text
              style={{
                ...styles.stock,
                color: product.stock_quantity > 0 ? "green" : "red",
              }}
            >
              {product.stock_quantity > 0
                ? `${product.stock_quantity} en stock`
                : "Sin stock"}
            </Text>

            {(product.type=="variable" && productVariations.length>0)&&<View>
              {product.attributes.map((attr, i: number) => (
                <ProductVariation
                  key={i}
                  name={attr.name}
                  options={attr.options}
                  setOptionSelected={(option) =>
                    changeAttribute(attr.name, option)
                  }
                />
              ))}

              <Text style={{ ...styles.title, marginTop: 10 }}>
                {product.price} IVA inc.
              </Text>
            </View>}

            <RenderHTML
              contentWidth={width}
              source={{ html: product.description }}
            />
          </View>
        }
        renderItem={({ item }) => <Product item={item} row={true} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />

      {product.stock_quantity > 0 && (
        <View style={{ margin: 20 }}>
          <TouchableOpacity style={styles.button} onPress={addProduct}>
            <Text style={styles.buttonText}>Añadir a la cesta</Text>
          </TouchableOpacity>
        </View>
      )}

      <LoadingOverlay visible={loading} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
  image: {
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  stock: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#F1A3A3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    textAlign: "justify",
    fontSize: 14,
    color: "#555",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#333",
  },
  dotInactive: {
    backgroundColor: "#CCC",
  },
});
