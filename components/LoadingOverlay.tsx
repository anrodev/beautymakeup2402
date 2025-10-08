import { View, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';

interface Props {
  visible: boolean;
}

const LoadingOverlay = ({ visible }: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <LottieView
          source={require('@/assets/lottiefiles/loader.json')}
          autoPlay
          loop
          style={styles.animation}
        />
       
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#FADDE0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  text: {
    marginTop: 20,
    color: '#e88bd9',
    fontSize: 20,
    fontWeight:"bold"
  },
});

export default LoadingOverlay;
