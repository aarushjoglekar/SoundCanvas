import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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

export default function DotCanvas({ style, isActive }) {
    const [dots, setDots] = useState([]);
    const [currentHue, setCurrentHue] = useState(0);
    const hueRef = useRef(0);
    const viewHeight = useRef(0);
    const soundRef = useRef(null);

    useEffect(() => {
        if (!isActive) {
            async function stopSound() {
                if (soundRef.current) {
                    await soundRef.current.stopAsync();
                    await soundRef.current.unloadAsync();
                    soundRef.current = null;
                }
            }
            stopSound()
        }
    }, [isActive])

    // Animate hue value
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

    const stopAndPlaySound = async (rowIndex) => {
        try {
            // Stop current sound if playing
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

        const rowHeight = viewHeight.current / 15;
        const rowFromTop = Math.floor(y / rowHeight);
        const rowFromBottom = 14 - rowFromTop; // index: 0 = bottom (1.mp3), 14 = top (15.mp3)

        return Math.max(0, Math.min(14, rowFromBottom));
    };

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

            // Determine row and play sound
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
                viewHeight.current = e.nativeEvent.layout.height;
            }}
        >
            <Svg height="100%" width="100%">
                {dots.map((dot, index) => (
                    <Circle
                        key={index}
                        cx={dot.x}
                        cy={dot.y}
                        r="5"
                        fill={dot.color}
                    />
                ))}
            </Svg>
        </View>
    );
}
