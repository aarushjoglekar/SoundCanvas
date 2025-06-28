import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const { height } = Dimensions.get('window');

export default function MovingCanvas({ style, scrolling }) {
  useEffect(() => {
    if (scrolling) {
      playLoop()
    } else {
      stopLoop()
    }
  }, [scrolling])

  const [sound, setSound] = useState(null);

  const playLoop = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../assets/sounds/c-4.mp3'), // Replace with your tone file
      {
        isLooping: true,
        shouldPlay: true,
        volume: 1.0,
      }
    );
    setSound(newSound);
  };

  const stopLoop = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const [paths, setPaths] = useState([]); // paths: { d: string, color: string }[]
  const currentPoints = useRef([]);
  const scrollX = useSharedValue(0);
  const hue = useSharedValue(0);
  const speed = -60; // pixels per second (leftward)

  const [currentHue, setCurrentHue] = useState(0);

  const [, setTick] = useState(false);
  const forceRender = () => setTick((v) => !v);

  // Animate scrollX and hue continuously
  useEffect(() => {
    let running = true;
    let lastTimestamp = Date.now();

    const step = () => {
      if (!running) return;
      const now = Date.now();
      const deltaSec = (now - lastTimestamp) / 1000;

      if (scrolling) {
        scrollX.value += speed * deltaSec;
      }

      hue.value = (hue.value + 120 * deltaSec) % 360; // hue changes 120 deg per second
      runOnJS(setCurrentHue)(hue.value);

      lastTimestamp = now;
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    return () => {
      running = false;
    };
  }, [scrolling]);

  // Setup PanResponder with drawing enabled only when scrolling is true
  const [panResponder, setPanResponder] = useState(null);

  useEffect(() => {
    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => scrolling,

      onPanResponderGrant: (e) => {
        if (!scrolling) return;
        const { locationX, locationY } = e.nativeEvent;
        currentPoints.current = [`M ${locationX} ${locationY}`];
      },

      onPanResponderMove: (e) => {
        if (!scrolling) return;
        const { locationX, locationY } = e.nativeEvent;
        currentPoints.current.push(`L ${locationX} ${locationY}`);
        forceRender();
      },

      onPanResponderRelease: () => {
        if (!scrolling) return;
        const adjustedPath = currentPoints.current.join(' ');
        setPaths((prev) => [
          ...prev,
          { d: adjustedPath, color: `hsl(${currentHue}, 60%, 45%)` },
        ]);
        currentPoints.current = [];
      },
    });
    setPanResponder(responder);
  }, [scrolling, currentHue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  // Current brush color (rainbow)
  const currentColor = `hsl(${currentHue}, 60%, 45%)`;

  return (
    <View {...(panResponder ? panResponder.panHandlers : {})} style={style}>
      <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
        <Svg width={10000} height={height}>
          <G>
            {paths.map(({ d, color }, index) => (
              <Path
                key={index}
                d={d}
                stroke={color}
                strokeWidth={6}
                fill="none"
              />
            ))}
            {currentPoints.current.length > 0 && (
              <Path
                d={currentPoints.current.join(' ')}
                stroke={currentColor}
                strokeWidth={6}
                fill="none"
              />
            )}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
