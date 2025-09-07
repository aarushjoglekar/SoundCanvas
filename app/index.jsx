import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import DotCanvas from "../components/DotCanvas";

const lightGrey = '#e6e6e6'
const mediumLightGrey = '#8f8e96'
const mediumGrey = '#343337'
const darkGrey = '#201f21'

export default function Index() {
  const [isDotMode, setIsDotMode] = useState(true)

  const { width, height } = useWindowDimensions();

  const [isPlaying, setIsPlaying] = useState(false)
  const [toBeCleared, setToBeCleared] = useState(true)
  const [mood, setMood] = useState(1)
  const [dotSize, setDotSize] = useState([7])

  useEffect(() => {
    setIsPlaying(false)
  }, [isDotMode])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={{ height: 20 }} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 12 }}>
            <DotCanvas style={[styles.panel, { overflow: 'hidden' }]} isActive={isPlaying} size={dotSize[0]} toBeCleared={toBeCleared} setToBeCleared={setToBeCleared} />
            <View style={{ height: 20 }} />
            <View style={{ height: 80, justifyContent: 'center' }}>
              <Text style={[styles.text, { fontSize: 40, textAlign: 'left', marginLeft: 20 }]}>SOUND CANVAS</Text>
            </View>
          </View>
          <View style={{ width: 20 }} />
          <View style={{ flex: 5 }}>
            <View style={[styles.panel, { justifyContent: 'space-evenly', paddingVertical: 10 }]}>
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ height: 10 }} />
                <Text style={[styles.text, { fontSize: 15 }]}>SWITCH MUSIC MODE</Text>
                <View style={{ height: 20 }} />
                <Switch
                  trackColor={{ true: "#6b7280", false: "6b7280" }}
                  thumbColor={isDotMode ? "#ffe70f" : "#ffc60d"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setIsDotMode}
                  value={isDotMode}
                  style={{ transform: [{ scaleX: 1.25 }, { scaleY: 1.2 }] }}
                />
                <View style={{ height: 10 }} />
                <Text style={[styles.text, { fontSize: 11 }]}>Currently: {isDotMode ? "Dot Mode" : "Paint Mode"}</Text>
              </View>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={[styles.text, { fontSize: 15 }]}>ADJUST BRUSH SIZE</Text>
                <MultiSlider
                  values={dotSize}
                  min={2}
                  max={10}
                  step={1}
                  sliderLength={width / 5}
                  onValuesChange={setDotSize}
                  selectedStyle={{ backgroundColor: mediumLightGrey }}
                  unselectedStyle={{ backgroundColor: lightGrey }}
                  markerStyle={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 0,
                    backgroundColor: mediumLightGrey,
                  }}
                  trackStyle={{
                    height: 4
                  }}
                />
              </View>
            </View>
            <View style={{ height: 20 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.smallButton, { width: "43%", justifyContent: 'space-between', paddingVertical: 12 }]} onPress={() => setToBeCleared(true)}>
                <FontAwesome5 name="eraser" size={33} color={lightGrey} />
                <Text style={styles.text}>CLEAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, { width: "53%" }]} onPress={() => setIsPlaying(prev => !prev)}>
                <Text style={[styles.text, { fontSize: 18 }]}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
                <View style={{ height: 5 }} />
                {isPlaying ? <AntDesign name='pause' size={24} color={lightGrey} /> : <Feather name='play' size={24} color={lightGrey} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mediumGrey
  },

  text: {
    color: lightGrey,
    fontFamily: 'outfit',
    textAlign: 'center',
  },

  smallButton: {
    height: 80,
    backgroundColor: darkGrey,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },

  panel: {
    flex: 1,
    backgroundColor: darkGrey,
    borderRadius: 10
  },
})