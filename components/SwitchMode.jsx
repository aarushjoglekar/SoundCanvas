import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function SwitchMode({ value, onValueChange }) {
  const [isOn, setIsOn] = useState(value);
  const translateX = useRef(new Animated.Value(isOn ? 26 : 0)).current; // thumb position

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOn ? 26 : 0, // move thumb
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOn]);

  const toggleSwitch = () => {
    setIsOn(prev => !prev);
    onValueChange(!isOn);
  };

  // Colors for a modern, vibrant palette
  const trackColor = '#6b7280'
  const thumbColor = isOn ? '#ffe70f' : '#ffc60d';

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX }] },
            { backgroundColor: thumbColor },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 2,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
