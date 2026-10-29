import { useState } from "react";
import { View,Image, useWindowDimensions } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function Rainer() {
  const { height, width } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const dismissed = useSharedValue(false);
  const isActivated = useSharedValue(false);

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
        translateY.value = withTiming(-height, { duration: 250 });
      } else {
        // If not swiped enough, reset position
        isActivated.value = false;
        translateY.value = withSpring(0);
      }
    },
  });

  const yMovementStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: isActivated.value ? 1 : 0.75,
  }));

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[{ height, width }, yMovementStyle, opacityStyle]}>
          <Image
            source={require("../../../assets/USD_1.jpg")}
            style={{ height, width }}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}