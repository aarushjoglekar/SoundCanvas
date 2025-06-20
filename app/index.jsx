import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import MovingCanvas from "../components/MovingCanvas";

const lightGrey = '#e6e6e6'
const mediumLightGrey = '#8f8e96'
const mediumGrey = '#343337'
const darkGrey = '#201f21'

export default function Index() {
  const { width, height } = useWindowDimensions();

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false)
  const [mood, setMood] = useState(1)
  const [tempo, setTempo] = useState([120])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={{ height: 20 }} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 12 }}>
            <MovingCanvas style={[styles.panel, {overflow: 'hidden'}]} scrolling={isPlaying}/>
            <View style={{ height: 20 }} />
            <View style={{ height: 80, justifyContent: 'center' }}>
              <Text style={[styles.text, { fontSize: 40, textAlign: 'left', marginLeft: 20 }]}>SOUND CANVAS</Text>
            </View>
          </View>
          <View style={{ width: 20 }} />
          <View style={{ flex: 5 }}>
            <View style={[styles.panel, { justifyContent: 'space-between', paddingVertical: 10 }]}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ height: 10 }} />
                <Text style={[styles.text, { fontSize: 15 }]}>ADJUST MOOD</Text>
                <View style={{ height: 10 }} />
                <View style={{ flexDirection: "row" }} bounces={false}>
                  <ColorBox color={'#f5473e'} onPress={() => setMood(1)} selected={mood == 1} />
                  <ColorBox color={'orange'} onPress={() => setMood(2)} selected={mood == 2} />
                  <ColorBox color={'#f7f437'} onPress={() => setMood(3)} selected={mood == 3} />
                  <ColorBox color={'#2cd14f'} onPress={() => setMood(4)} selected={mood == 4} />
                </View>
                <View style={{ height: 10 }} />
                <View style={{ flexDirection: "row" }} bounces={false}>
                  <ColorBox color={'#2c47bf'} onPress={() => setMood(5)} selected={mood == 5} />
                  <ColorBox color={'#471b96'} onPress={() => setMood(6)} selected={mood == 6} />
                  <ColorBox color={'#7F00FF'} onPress={() => setMood(7)} selected={mood == 7} />
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.text, { fontSize: 15 }]}>ADJUST SPEED - {tempo} BPM</Text>
                <MultiSlider
                  values={tempo}
                  min={60}
                  max={160}
                  step={1}
                  sliderLength={width / 5}
                  onValuesChange={setTempo}
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
              <TouchableOpacity style={[styles.smallButton, { width: "43%", backgroundColor: isMetronomePlaying ? "#4f9e73" : darkGrey }]} onPress={() => setIsMetronomePlaying(prev => !prev)}>
                <MaterialCommunityIcons name="metronome" size={35} color={lightGrey} />
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

function ColorBox({ color, onPress, selected }) {
  return (
    <TouchableOpacity style={{ backgroundColor: color, aspectRatio: 1, height: 30, borderRadius: 3, marginLeft: 7, borderColor: lightGrey, borderWidth: selected ? 1 : 0 }} onPress={onPress} />
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
    textAlign: 'center'
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