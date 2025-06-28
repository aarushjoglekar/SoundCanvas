import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const ROWS = 15;

const soundPaths = [
  require("../assets/sounds/1.mp3"),
  require("../assets/sounds/2.mp3"),
  require("../assets/sounds/3.mp3"),
  require("../assets/sounds/4.mp3"),
  require("../assets/sounds/5.mp3"),
  require("../assets/sounds/6.mp3"),
  require("../assets/sounds/7.mp3"),
  require("../assets/sounds/8.mp3"),
  require("../assets/sounds/9.mp3"),
  require("../assets/sounds/10.mp3"),
  require("../assets/sounds/11.mp3"),
  require("../assets/sounds/12.mp3"),
  require("../assets/sounds/13.mp3"),
  require("../assets/sounds/14.mp3"),
  require("../assets/sounds/15.mp3"),
];

export default function MovingCanvas({ style, scrolling }) {
  const [sound, setSound] = useState(null);
  const [componentHeight, setComponentHeight] = useState(0);
  const [currentRow, setCurrentRow] = useState(null);

  const rowTimer = useRef(null);
  const previousRow = useRef(null);

  useEffect(() => {
    stopLoop()
    playLoop(soundPaths[currentRow - 1])
  }, [currentRow])

  const playLoop = async (path) => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      path,
      { isLooping: true, shouldPlay: true, volume: 1.0 }
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

  const [paths, setPaths] = useState([]);
  const currentPoints = useRef([]);
  const scrollX = useSharedValue(0);
  const hue = useSharedValue(0);
  const speed = -60;

  const [currentHue, setCurrentHue] = useState(0);
  const [, setTick] = useState(false);
  const forceRender = () => setTick((v) => !v);

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

      hue.value = (hue.value + 120 * deltaSec) % 360;
      runOnJS(setCurrentHue)(hue.value);

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
        handleRowChange(locationY);
      },

      onPanResponderMove: (e) => {
        if (!scrolling) return;
        const { locationX, locationY } = e.nativeEvent;
        currentPoints.current.push(`L ${locationX} ${locationY}`);
        forceRender();
        handleRowChange(locationY);
      },

      onPanResponderRelease: () => {
        if (!scrolling) return;
        const adjustedPath = currentPoints.current.join(' ');
        setPaths((prev) => [
          ...prev,
          { d: adjustedPath, color: `hsl(${currentHue}, 60%, 45%)` },
        ]);
        currentPoints.current = [];
        clearTimeout(rowTimer.current);
        rowTimer.current = null;
        previousRow.current = null;
      },
    });

    setPanResponder(responder);
  }, [scrolling, currentHue, componentHeight]);

  const handleRowChange = (y) => {
    const row = getRow(y);
    if (row !== previousRow.current) {
      previousRow.current = row;

      clearTimeout(rowTimer.current);
      rowTimer.current = setTimeout(() => {
        setCurrentRow(row);
      }, 100);
    }
  };

  const getRow = (y) => {
    if (componentHeight === 0) return 1;
    const rowHeight = componentHeight / ROWS;
    const rowFromTop = Math.floor(y / rowHeight);
    const rowFromBottom = ROWS - rowFromTop;
    return Math.max(1, Math.min(ROWS, rowFromBottom));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  const currentColor = `hsl(${currentHue}, 60%, 45%)`;

  return (
    <View
      {...(panResponder ? panResponder.panHandlers : {})}
      onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        setComponentHeight(height);
      }}
      style={style}
    >
      <Animated.View style={[{ position: 'absolute' }, animatedStyle]}>
        <Svg width={10000} height={componentHeight}>
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
