import { View, Image, useWindowDimensions, Text } from "react-native";
import { GestureDetector, useCompetingGestures, usePanGesture, useTapGesture } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppButton } from "./shared/app-button";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useDenomination } from "../_layout";
import { scheduleOnRN } from 'react-native-worklets';

export default function Rainer() {
  const { denomination } = useDenomination();
  const { height, width } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const dismissed = useSharedValue(false);
  const isActivated = useSharedValue(false);
  const fadeInOpacity = useSharedValue(1);
  const whiteFlashOpacity = useSharedValue(0);
  const [showSettingsMenu, setShowSettingsMenu] = useState(true);
  const [showSwipeArrow, setShowSwipeArrow] = useState(true);
  const [isAutoSwiping, setIsAutoSwiping] = useState(false);
  const [billCount, setBillCount] = useState(0);
  const isAutoSwipingShared = useSharedValue(false);
  const billCountRef = useSharedValue(0);
  const arrowY = useSharedValue(10);

  useEffect(() => {
    setBillCount(0);
    billCountRef.value = 0;
  }, [denomination]);

  let imageSource = require("../../../assets/USD_100.jpg");
  let denominationMarker = "$";
  let denominationValue = 100;

  if (denomination === "$1") {
    imageSource = require("../../../assets/USD_1.jpg");
    denominationValue = 1;
  }
  else if (denomination === "10€") {
    imageSource = require("../../../assets/EUR_10.png");
    denominationMarker = "€";
    denominationValue = 10;
  }
  else if (denomination === "100€") {
    imageSource = require("../../../assets/EUR_100.png");
    denominationMarker = "€";
    denominationValue = 100;
  }

  useEffect(() => {
    if (showSettingsMenu)
      fadeInButton();
    else
      fadeOutButton();
  }, [showSettingsMenu]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBillCount(billCountRef.value);
    }, 100);

    arrowY.value = withSequence(withTiming(-1250, { duration: 2000 }, () => { 
      scheduleOnRN(setShowSwipeArrow, false); 
    }));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    isAutoSwipingShared.value = isAutoSwiping;
  }, [isAutoSwiping]);

  useAnimatedReaction(
    () => isAutoSwipingShared.value,
    (autoSwiping) => {
      if (autoSwiping) {
        const interval = setInterval(() => {
          if (isAutoSwipingShared.value && !dismissed.value) {
            dismissed.value = true;
            translateY.value = withTiming(-height, { duration: 300 }, (finished) => {
              if (finished) {
                whiteFlashOpacity.value = withTiming(1, { duration: 50 }, () => {
                  whiteFlashOpacity.value = withTiming(0, { duration: 150 });
                });
                billCountRef.value += 1;
                translateY.value = 0;
                isActivated.value = false;
                dismissed.value = false;
              }
            });
          }
        }, 200);

        return () => clearInterval(interval);
      }
    }
  );

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
            whiteFlashOpacity.value = withTiming(1, { duration: 50 }, () => {
              whiteFlashOpacity.value = withTiming(0, { duration: 150 });
            });

            billCountRef.value += 1;
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

  const mainTap = useTapGesture({
    runOnJS: true,
    onDeactivate: () => {
      setShowSettingsMenu(prev => !prev);
      setShowSwipeArrow(false);
    }
  });

  const arrowTap = useTapGesture({
    runOnJS: true,
    onDeactivate: () => {
      setShowSettingsMenu(prev => !prev);
      setShowSwipeArrow(false)
    }
  });

  const arrowPan = usePanGesture({
    runOnJS: true,
    onActivate: () => {
      setShowSwipeArrow(false)
    }
  });

  const mainGestures = useCompetingGestures(mainTap, pan);
  const arrowGesture = useCompetingGestures(arrowPan, arrowTap);

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

  const whiteFlashStyle = useAnimatedStyle(() => ({
    opacity: whiteFlashOpacity.value,
  }));

  const counterOpacityStyle = useAnimatedStyle(() => ({
    opacity: isActivated.value || isAutoSwipingShared.value ? 1 : 0,
  }));

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arrowY.value }],
  }));

  return (
    <>
      <View style={{ flex: 1 }}>
        <Animated.Text
          className={'absolute top-1/2 left-1/2 p-1 font-extrabold text-amber-600 z-10'}
          style={[
            {
              fontSize: Math.max(55, 86 - billCount),
              textAlign: 'center',
              transform: [{ translateX: -100 }, { translateY: -60 }],
              textShadowColor: 'rgba(254, 242, 195, 0.9)',
              textShadowOffset: { width: 6, height: 6 },
              textShadowRadius: 4,
            },
            counterOpacityStyle
          ]}
        >
          {denominationMarker}{(billCount * denominationValue).toLocaleString()}
        </Animated.Text>
        <Image
          source={imageSource}
          className={'absolute top-0 left-0'}
          style={{ height, width }}
        />
        <GestureDetector gesture={mainGestures}>
          <Animated.View style={[{ height, width }, yMovementStyle]}>
            <Image source={imageSource} style={{ height, width }} className="border-8 border-white border-solid rounded-2xl" />
          </Animated.View>
        </GestureDetector>

        <Animated.View className={'absolute bottom-4 w-full flex-col justify-center align-middle gap-14'} style={opacityAnimation}>
          {showSwipeArrow &&
            <Animated.View className="w-full h-50 p-2" style={[{ opacity: fadeInOpacity.value }, bounceStyle]}>
              <GestureDetector gesture={arrowGesture}>
                <Text className="text-white text-9xl text-center" style={{ textShadowColor: 'black', textShadowRadius: 18, textShadowOffset: { width: 4, height: 4 } }}>⇧</Text>
                <Text className="text-white text-4xl font-bold text-center" style={{ textShadowColor: 'black', textShadowRadius: 4, textShadowOffset: { width: 4, height: 4 } }}>Swipe up</Text>
              </GestureDetector>
            </Animated.View>
          }

          <View className="flex-row justify-center gap-4">
            <AppButton
              variant="primary"
              label="settings"
              icon="settings"
              onPress={() => { router.push('./components/settings') }}
            />

            <AppButton
              variant="primary"
              label="Auto"
              icon={isAutoSwiping ? "pause" : "play"}
              onPress={() => setIsAutoSwiping(prev => !prev)}
            />
          </View>
        </Animated.View>
      </View>
      <Animated.View
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={[{ backgroundColor: 'white' }, whiteFlashStyle]}
      />
    </>);
}