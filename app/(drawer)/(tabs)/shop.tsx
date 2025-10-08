import React, { useEffect, useState, useRef } from "react";
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

import { FilterType, ProductType } from "@/types";

import { useLocalSearchParams } from "expo-router";

import { useRouter } from "expo-router";

import LottieView from "lottie-react-native";

import _ from "lodash";

import { produce } from "immer";

export default function ShopScreen() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [rowColumn, setRowColumn] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  const isFirstRender = useRef(true);

  const cleanFilter = {
    category: null,
    search: "",
  };

  const [filter, setFilter] = useState<FilterType>({
    category: null,
    search: "",
  });

  const activeFilter = !_.isEqual(filter, cleanFilter);

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const getProducts = async (currentPage: number) => {
    try {
      setIsLoadingMore(true);

      const { records } = await fetchProducts(10, currentPage, filter.category, filter.search);

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
    if (params?.filter) {
      const newFilter = JSON.parse(params.filter as string);

      if (!_.isEqual(newFilter, filter)) {
        setTotal(0);
        setTotalPages(0);
        setProducts([]);
        setFilter(
          produce(filter, (draft) => {
            draft.category = newFilter.category;
            draft.search = newFilter.search;
          })
        );
      } else {
        getProducts(page);
      }
    } else {
      getProducts(page);
    }
  }, [page, params?.filter]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (page > 1) {
      setPage(1);
    } else {
      getProducts(1);
    }
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Productos ({total})</Text>

          {!isLoadingMore && activeFilter && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/(tabs)/shop",
                  params: {
                    filter: JSON.stringify({ category: null, search: "" }),
                  },
                })
              }
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Ver todos</Text>
            </TouchableOpacity>
          )}
        </View>

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

      {products.length === 0 && isLoadingMore ? (
        <View style={styles.loaderContainer}>
          <LottieView
            source={require("@/assets/lottiefiles/fullScreenLoader.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
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
                <Text style={styles.emptyText}>
                  No se encontraron productos
                </Text>
              </View>
            ) : null
          }
        />
      )}
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
  link: {
    fontSize: 15,
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
  clearButton: {
    backgroundColor: "#E14BA7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },

  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
