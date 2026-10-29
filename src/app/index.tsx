import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Rainer from './components/rainer';
import './../global.css';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

export default function App() {
  const showSettingsButton = useSharedValue(false);

  const tap = useTapGesture({
    onActivate: () => {
      showSettingsButton.value = !showSettingsButton.value;
    }
  });

  return (
    <GestureDetector gesture={tap}>
      <View className={'justify-center align-center'} style={styles.container}>
        <Rainer />
        <StatusBar hidden />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
