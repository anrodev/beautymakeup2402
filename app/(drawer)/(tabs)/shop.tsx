import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Product,{ProductProps} from "@/components/Product"

import { fetchProducts } from "@/lib/api";

export const mockProducts: ProductProps[] = [
  {
    id: 1,
    name: "Contorno de Ojos Serum Hyaluronic Acid",
    description:"¡Descubre la magia de la hidratación y el rejuvenecimiento con nuestro Contorno de Ojos de Ácido Hialurónico en Roll-On!",
    price: 2.95,
    stock: 24,
    image:
      "https://beautymakeup2402.es/wp-content/uploads/2025/03/47664AE1-B9D2-42B2-8FB0-C5A3215874F7-1000x769.jpeg.webp",
  },
  {
    id: 2,
    name: "Primer para sombra de ojos",
    description:"Consigue que tu sombra dure todo el dia con nuestro primer.",
    price: 2.95,
    stock: 24,
    image:
      "https://beautymakeup2402.es/wp-content/uploads/2025/03/61FA5F00-98D6-4DD5-B7FA-D4CE2D6BBA45-1000x769.jpeg.webp",
  },
  {
    id: 3,
    name: "Paleta de sombras stich and friends",
    description:"La Paleta de Sombras Stitch and Friends es un producto inspirado en el encantador universo de Lilo & Stitch. Diseñada para los amantes del maquillaje y los fans de Disney",
    price: 10.95,
    stock: 6,
    image:
      "https://beautymakeup2402.es/wp-content/uploads/2025/03/1C93CF04-C76D-4905-AD56-58CF0D5144E3.jpeg",
  },
  {
    id: 4,
    name: "Caja de labiales Hello Kitty",
    description:"La Caja de Labiales Hello Kitty es un producto encantador que combina estilo y funcionalidad, ideal para los amantes de esta icónica gatita",
    price: 9.95,
    stock: 8,
    image:
      "https://beautymakeup2402.es/wp-content/uploads/2025/03/0E753BD2-52C2-4B34-BDF3-36351F296922.jpg",
  },
];

export default function ShopScreen() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [rowColumn, setRowColumn] = useState(true);

  const getProducts = async() =>{

    try {

      let fetchedProducts = await fetchProducts(10,1);

      console.log(fetchedProducts);
      
    } catch (error) {
      
      if (error instanceof Error) {
        console.log(error.message);
      }
    }

    
  }

  useEffect(() => {
    setProducts([...mockProducts]);
    getProducts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos ({products.length})</Text>
        <TouchableOpacity onPress={() => setRowColumn(!rowColumn)}>
          {rowColumn ? (
            <MaterialCommunityIcons
              name="format-list-text"
              size={26}
              color="#000"
            />
          ) : (
            <Ionicons name="grid-outline" size={26} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        key={rowColumn ? "one" : "two"}
        data={products}
        renderItem={({item}) => <Product item={{...item}} row={rowColumn}/>}
        keyExtractor={(item) => item.id.toString()}
        numColumns={rowColumn ? 1 : 2}
        columnWrapperStyle={rowColumn ? undefined : styles.row}
        contentContainerStyle={
          rowColumn
            ? { padding: 16 }
            : { paddingHorizontal: 8, paddingBottom: 20 }
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    justifyContent: "space-between",
  }
});