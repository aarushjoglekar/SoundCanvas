import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function MovingCanvas({ style, scrolling }) {
  const [paths, setPaths] = useState([]);
  const currentPoints = useRef([]);
  const scrollX = useSharedValue(0);
  const speed = -60; // pixels per second (leftward)

  const [, setTick] = useState(false);
  const forceRender = () => setTick((v) => !v);

  // Frame-based animation using JS (compatible with Expo Go)
  useEffect(() => {
    let lastTimestamp = Date.now();
    let running = true;

    const step = () => {
      if (!running) return;

      const now = Date.now();
      const deltaSec = (now - lastTimestamp) / 1000;
      if (scrolling) {
        scrollX.value += speed * deltaSec;
      }
      lastTimestamp = now;

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
    return () => {
      running = false;
    };
  }, [scrolling]);

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
        setPaths((prev) => [...prev, adjustedPath]);
        currentPoints.current = [];
      },
    });
    setPanResponder(responder);
  }, [scrolling]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  return (
    <View
      {...(panResponder ? panResponder.panHandlers : {})}
      style={style}
    >
      <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
        <Svg width={10000} height={height}>
          <G>
            {paths.map((d, index) => (
              <Path
                key={index}
                d={d}
                stroke="black"
                strokeWidth={5}
                fill="none"
              />
            ))}
            {currentPoints.current.length > 0 && (
              <Path
                d={currentPoints.current.join(' ')}
                stroke="black"
                strokeWidth={5}
                fill="none"
              />
            )}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
