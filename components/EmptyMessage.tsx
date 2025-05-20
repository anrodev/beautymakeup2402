import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyMessage = ({message}:{message:string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",                 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  message: {
    fontSize: 18,
    color: '#888'
  },
});

export default EmptyMessage;
