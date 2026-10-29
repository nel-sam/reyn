import { View, Image, useWindowDimensions, Text, Pressable } from "react-native";
import { GestureDetector, useCompetingGestures, usePanGesture, useTapGesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AppButton from "./shared/app-button";
import { useState } from "react";

export default function Rainer() {
  const image = require("../../../assets/USD_100.jpg");
  const { height, width } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const dismissed = useSharedValue(false);
  const isActivated = useSharedValue(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);

  const pan = usePanGesture({
    onActivate: () => {
      isActivated.value = true;
    },
    onUpdate: (event) => {
      if (!dismissed.value) {
        translateY.value = Math.min(event.translationY, 0);
      }
    },
    onDeactivate: (event) => {
      if (dismissed.value) return;

      if (event.translationY < -height * 0.40 || event.velocityY < -800) {
        // If swiped enough, send off the screen
        dismissed.value = true;
        translateY.value = withTiming(-height, { duration: 150 }, (finished) => {
          if (finished) {
            translateY.value = 0;
            isActivated.value = false;
            dismissed.value = false;
          }
        });
      } else {
        // If not swiped enough, reset position
        isActivated.value = false;
        translateY.value = withSpring(0);
      }
    },
  });

  const tap = useTapGesture({
    runOnJS: true, // keeps the pan animation on the UI thread while letting the tap update React state.
    onDeactivate: () => {
      setShowSettingsButton(prev => !prev);
    }
  });

  const gestures = useCompetingGestures(tap,pan);

  const yMovementStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: isActivated.value ? 0.90 : 1 }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={image}
        className={'absolute top-0 left-0'}
        style={{ height, width }}
      />
      <GestureDetector gesture={gestures}>
        <Animated.View style={[{ height, width }, yMovementStyle]}>
          <Image
            source={image}
            style={{ height, width }}
          />
        </Animated.View>
      </GestureDetector>

      {showSettingsButton && <AppButton text="Settings" onPress={() => { }} />}
    </View>
  );
}