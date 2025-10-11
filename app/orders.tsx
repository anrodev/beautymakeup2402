import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import Modal, { ModalRef } from "@/components/Modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchOrders } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { OrderType } from "@/types";
import LottieView from "lottie-react-native";
import OrderList from "@/components/OrderList";
import DateRange from "@/components/DateRange";

export default function OrdersScreen() {
  const modalRef = useRef<ModalRef>(null);

  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderType[]>([]);

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [page, setPage] = useState(1);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [clear,setClear] = useState(false);

  const [dateFrom,setDateFrom] = useState("");

  const [dateTo,setDateTo] = useState("");

  const search = () =>{
    setOrders([]);
    setTotal(0);
    setTotalPages(0);

    if(page>1){

      setPage(1);
    }else{

      getOrders(1);
    }
    
  }

  const getOrders = async (
    currentPage: number
  ) => {
    if (!user) return null;
    try {
      setIsLoadingMore(true);

      const { records } = await fetchOrders(
        1,
        10,
        currentPage,
        dateFrom,
        dateTo
      );

      setTotal(records.total);

      setTotalPages(records.totalPages);

      setOrders((prev) => [...prev, ...records.orders]);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && page < totalPages) {
      setPage((prev) => prev + 1);
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
    if (user) {
      getOrders(page);
    } else {
      modalRef.current?.close();
    }
  }, [page]);


  useEffect(()=>{

    if(clear && (!dateFrom && !dateTo)){

      setClear(false);

      search();
    }

  },[clear,dateFrom,dateTo])

  return (
    <Modal ref={modalRef} color="#FADDE0">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => modalRef.current?.close()}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={24}
            color="black"
          />
        </TouchableOpacity>

        <Text style={styles.textHeader}>
          Ordenes {total > 0 && `(${total})`}
        </Text>
      </View>

      <View style={styles.container}>
        {orders.length === 0 && isLoadingMore ? (
          <View style={styles.loaderContainer}>
            <LottieView
              source={require("@/assets/lottiefiles/fullScreenLoader.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        ) : (
          <>
            <DateRange dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} setClear={setClear} search={search}/>
            <FlatList
              data={orders}
              renderItem={({ item }) => <OrderList order={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={1}
              columnWrapperStyle={undefined}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                !isLoadingMore ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      No se encontraron ordenes
                    </Text>
                  </View>
                ) : null
              }
            />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
    marginLeft: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
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
