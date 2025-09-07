import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

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

const LAYER_COUNT = 15;
const LAYER_COLORS = ['#1b1a1c', '#282729'];
const CENTER_ROW_COLOR = '#343236';

export default function DotCanvas({ style, isActive, size, toBeCleared, setToBeCleared }) {
  const [dots, setDots] = useState([]);
  const [currentHue, setCurrentHue] = useState(0);
  const hueRef = useRef(0);
  const viewHeight = useRef(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const soundRef = useRef(null);

  // Clear dots if triggered
  useEffect(() => {
    if (toBeCleared) {
      setDots([]);
      setToBeCleared(false);
    }
  }, [toBeCleared]);

  // Stop sound on deactivate
  useEffect(() => {
    if (!isActive) {
      async function stopSound() {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
      }
      stopSound();
    }
  }, [isActive]);

  // Animate hue color
  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      hueRef.current = (hueRef.current + 1) % 360;
      setCurrentHue(hueRef.current);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      running = false;
    };
  }, []);

  // Stop and play appropriate sound for row
  const stopAndPlaySound = async (rowIndex) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(
        soundPaths[rowIndex],
        { shouldPlay: true, isLooping: false }
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const getRowFromY = (y) => {
    if (viewHeight.current === 0) return 0;
    const rowHeight = viewHeight.current / LAYER_COUNT;
    const rowFromTop = Math.floor(y / rowHeight);
    const rowFromBottom = LAYER_COUNT - 1 - rowFromTop;
    return Math.max(0, Math.min(LAYER_COUNT - 1, rowFromBottom));
  };

  // Pan responder for tapping
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: async (evt) => {
      if (!isActive) return;

      const { locationX, locationY } = evt.nativeEvent;
      const color = `hsl(${Math.floor(hueRef.current)}, 100%, 50%)`;

      // Add dot
      setDots((prevDots) => [
        ...prevDots,
        { x: locationX, y: locationY, color },
      ]);

      // Play corresponding sound
      const rowIndex = getRowFromY(locationY);
      await stopAndPlaySound(rowIndex);
    },
    onPanResponderMove: () => { },
    onPanResponderRelease: () => { },
  });

  return (
    <View
      style={style}
      {...panResponder.panHandlers}
      onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        viewHeight.current = height;
        setCanvasHeight(height);
      }}
    >
      <Svg height="100%" width="100%">
        {/* Background rows */}
        {Array.from({ length: LAYER_COUNT }).map((_, i) => {
          const rowHeight = canvasHeight / LAYER_COUNT;
          let fillColor = LAYER_COLORS[i % 2];

          // Override center row
          if (i === Math.floor(LAYER_COUNT / 2)) {
            fillColor = CENTER_ROW_COLOR;
          }

          return (
            <Rect
              key={`bg-${i}`}
              x={0}
              y={i * rowHeight}
              width="100%"
              height={rowHeight}
              fill={fillColor}
            />
          );
        })}

        {/* Dots */}
        {dots.map((dot, index) => (
          <Circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={size}
            fill={dot.color}
          />
        ))}
      </Svg>
    </View>
  );
}
