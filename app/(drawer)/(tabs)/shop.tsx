import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Product from "@/components/Product";

import { fetchProducts } from "@/lib/api";

import { ProductType } from "@/types";

export default function ShopScreen() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [rowColumn, setRowColumn] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    if (!isLoadingMore && page <= totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const getProducts = async (currentPage: number) => {
    try {
      setIsLoadingMore(true);

      const { records } = await fetchProducts(10, currentPage);

      setTotal(records.total);

      setTotalPages(records.totalPages);

      setProducts((prev) => [...prev, ...records.products]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="large" color="#E14BA7" />
      </View>
    );
  };

  useEffect(() => {
    getProducts(page);
  }, [page]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos ({total})</Text>
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
        renderItem={({ item }) => <Product item={item} row={rowColumn} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={rowColumn ? 1 : 2}
        columnWrapperStyle={rowColumn ? undefined : styles.row}
        contentContainerStyle={
          rowColumn
            ? { padding: 16 }
            : { paddingHorizontal: 8, paddingBottom: 20 }
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron productos</Text>
            </View>
          ) : null
        }
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
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
