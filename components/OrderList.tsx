import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { OrderType } from "@/types";
import RenderHTML from "react-native-render-html";

type OrderProps = {
  order: OrderType;
};

const OrderList = ({ order }: OrderProps) => {
  const [expanded, setExpanded] = useState(false);

  const translateOrderStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: "Pendiente",
      processing: "Procesando",
      on_hold: "En espera",
      completed: "Completada",
      cancelled: "Cancelada",
      refunded: "Reembolsada",
      failed: "Fallida",
      trash: "Eliminada",
    };

    return statusMap[status] || "Desconocido";
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <Text style={styles.orderNumber}>🧾 Orden #{order.number}</Text>

        <View style={{backgroundColor:"#f7e4e5ff",padding:5,borderRadius: 8}}>
          <Text>
            💰 SubTotal:
            {(
              parseFloat(order.total) - parseFloat(order.shipping_total)
            ).toFixed(2)}{" "}
            {order.currency_symbol}
          </Text>
          <Text>
            🚚 Envío: {order.shipping_total} {order.currency_symbol}
          </Text>
          <Text style={styles.orderNumber}>
            💰 Total: {order.total} {order.currency_symbol}
          </Text>
        </View>
        <Text>📅 Creada: {new Date(order.date_created).toLocaleString()}</Text>
        <Text>
          ✅ Pagada:{" "}
          {order.date_paid
            ? new Date(order.date_paid).toLocaleString()
            : "pendiente"}
        </Text>
        <Text>📦 Estado: {translateOrderStatus(order.status)}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.details}>
          {order.line_items.map((item) => (
            <View key={item.id} style={styles.item}>
              {item.image?.src ? (
                <Image
                  source={{ uri: item.image.src }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("@/assets/images/notfound.jpg")}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  <RenderHTML
                    source={{ html: `<b>${item.name}</b>` }}
                    tagsStyles={{
                      b: { fontWeight: "bold", color: "#333" },
                    }}
                  />
                </Text>
                <Text>Cantidad: {item.quantity}</Text>
                <Text>
                  Total: {item.total} {order.currency_symbol}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    padding: 12,
    backgroundColor: "#f0f0f0",
  },
  orderNumber: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  details: {
    padding: 12,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default OrderList;
