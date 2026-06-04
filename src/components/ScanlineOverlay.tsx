import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const SCREEN_H   = Dimensions.get('window').height;
const LINE_EVERY = 4;   // 1px dark line + 3px gap
const NUM_LINES  = Math.ceil(SCREEN_H / LINE_EVERY);

const LINES = Array.from({ length: NUM_LINES });

const lineStyle = {
  height: LINE_EVERY,
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.055)',
};

export function ScanlineOverlay() {
  return (
    <View pointerEvents="none" style={styles.root}>
      {LINES.map((_, i) => (
        <View key={i} style={lineStyle} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    zIndex: 200,
    overflow: 'hidden',
  },
});
