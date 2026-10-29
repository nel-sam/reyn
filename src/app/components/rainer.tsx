import { View, Image, useWindowDimensions } from "react-native";
import { GestureDetector, useCompetingGestures, usePanGesture, useTapGesture } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppButton } from "./shared/app-button";
import { useEffect, useState } from "react";
import { router } from "expo-router";

export default function Rainer() {
  const image = require("../../../assets/USD_100.jpg");
  const { height, width } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const dismissed = useSharedValue(false);
  const isActivated = useSharedValue(false);
  const fadeInOpacity = useSharedValue(0);
  const [showSettingsButton, setShowSettingsButton] = useState(false);

  useEffect(() => {
    console.log(showSettingsButton); // TODO: remove
    if (showSettingsButton)
      fadeInButton();
    else
      fadeOutButton();
  }, [showSettingsButton]);

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

  const gestures = useCompetingGestures(tap, pan);

  // Dollar bill movement
  const yMovementStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: isActivated.value ? 0.90 : 1 }],
  }));

  const fadeInButton = () => {
    fadeInOpacity.value = withTiming(1, { duration: 300, easing: Easing.linear });
  };

  const fadeOutButton = () => {
    fadeInOpacity.value = withTiming(0, { duration: 300, easing: Easing.linear });
  };

  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: fadeInOpacity.value
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

      <Animated.View className={'absolute bottom-4 w-full flex-row justify-center'} style={opacityAnimation}>
        <AppButton variant="primary" label="" icon="settings" onPress={() => { router.push('./components/settings') }} />
      </Animated.View>
    </View>
  );
}