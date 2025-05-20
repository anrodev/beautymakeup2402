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
import { ProductType } from "@/types";
import { useCart } from "@/context/CartContext";
import CartMenu from "@/components/CartMenu";
import Toast from "react-native-toast-message";

export default function ProductDetailScreen() {
  const { width } = useWindowDimensions();

  const modalRef = useRef<ModalRef>(null);

  const params = useLocalSearchParams();

  const [activeIndex, setActiveIndex] = useState(0);

  const { addToCart } = useCart();

  const mockProducts: ProductType[] = [
    {
      id: 1,
      name: "Contorno de Ojos Serum Hyaluronic Acid",
      description:
        "¡Descubre la magia de la hidratación y el rejuvenecimiento con nuestro Contorno de Ojos de Ácido Hialurónico en Roll-On!",
      price: 2.95,
      stock_quantity: 24,
      images: [
        {
          src: "https://beautymakeup2402.es/wp-content/uploads/2025/03/47664AE1-B9D2-42B2-8FB0-C5A3215874F7-1000x769.jpeg.webp",
        },
      ],
    },
    {
      id: 2,
      name: "Primer para sombra de ojos",
      description:
        "Consigue que tu sombra dure todo el dia con nuestro primer.",
      price: 2.95,
      stock_quantity: 24,
      images: [
        {
          src: "https://beautymakeup2402.es/wp-content/uploads/2025/03/61FA5F00-98D6-4DD5-B7FA-D4CE2D6BBA45-1000x769.jpeg.webp",
        },
      ],
    },
    {
      id: 3,
      name: "Paleta de sombras stich and friends",
      description:
        "La Paleta de Sombras Stitch and Friends es un producto inspirado en el encantador universo de Lilo & Stitch. Diseñada para los amantes del maquillaje y los fans de Disney",
      price: 10.95,
      stock_quantity: 6,
      images: [
        {
          src: "https://beautymakeup2402.es/wp-content/uploads/2025/03/1C93CF04-C76D-4905-AD56-58CF0D5144E3.jpeg",
        },
      ],
    },
    {
      id: 4,
      name: "Caja de labiales Hello Kitty",
      description:
        "La Caja de Labiales Hello Kitty es un producto encantador que combina estilo y funcionalidad, ideal para los amantes de esta icónica gatita",
      price: 9.95,
      stock_quantity: 8,
      images: [
        {
          src: "https://beautymakeup2402.es/wp-content/uploads/2025/03/0E753BD2-52C2-4B34-BDF3-36351F296922.jpg",
        },
      ],
    },
  ];

  const product = {
    id: Number(params.id),
    images: params.images ? JSON.parse(params.images as string) : [],
    name: params.name as string,
    description: params.description as string,
    price: Number(params.price),
    stock_quantity: Number(params.stock_quantity),
  };

  const [products, setProducts] = useState<ProductType[]>([]);

  const addProduct = async() => {
    try {
      await addToCart({ ...product, amount: 1 });

      Toast.show({
        type: "success",
        text1: "¡Éxito!",
        text2: `${product.name} agregado con éxito 👌`,
        position: "bottom"
      });


    } catch (error) {
      console.error("Error al agregar el producto:", error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Hubo un problema al agregar el producto 😓",
        position: "bottom"
      });
    }
  };

  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

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
        <CartMenu />
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
            <Text style={styles.price}>{product.price} €</Text>
            <Text style={styles.stock}>{product.stock_quantity} en stock</Text>
            <TouchableOpacity style={styles.button} onPress={addProduct}>
              <Text style={styles.buttonText}>Añadir a la cesta</Text>
            </TouchableOpacity>
            <RenderHTML
              contentWidth={width}
              source={{ html: product.description }}
            />
            <TouchableOpacity style={styles.optionContainer}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionText}>Más vistos</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => <Product item={item} row={true} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 14,
    color: "green",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#F1A3A3",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
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
