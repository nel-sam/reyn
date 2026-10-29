import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Rainer from './components/rainer';
import './../global.css';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useUniwind } from 'uniwind';
import { Stack } from 'expo-router';

export default function App() {
  const showSettingsButton = useSharedValue(false);
  const { theme } = useUniwind();

  const tap = useTapGesture({
    onActivate: () => {
      showSettingsButton.value = !showSettingsButton.value;
    }
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: 'Reyn'
        }}
      />
      <GestureDetector gesture={tap}>
        <View className={'justify-center align-center'} style={styles.container}>
          <Rainer />
          <StatusBar hidden style={theme === "dark" ? "light" : "dark"} />
        </View>
      </GestureDetector></>
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
