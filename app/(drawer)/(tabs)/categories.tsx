import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { fetchCategories } from "@/lib/api";
import { CategoryType } from "@/types";
import Category from "@/components/Category"

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  const handleLoadMore = () => {
    if (!isLoadingMore && page <= totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const getCategories = async (currentPage: number) => {
    try {

      setIsLoadingMore(true);

      const { records } = await fetchCategories(100, currentPage);

      setTotal(records.total);

      setTotalPages(records.totalPages);

      setCategories((prev) => [...prev, ...records.categories]);

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
    getCategories(page);
  }, [page]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorías de productos ({total})</Text>
        <Ionicons name="chevron-forward" size={20} color="#000" />
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => <Category item={item}/>}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoadingMore ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No se encontraron categorías</Text>
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
    justifyContent: "flex-start",
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
  }
});
