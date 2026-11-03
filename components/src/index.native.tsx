import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { SelectionProps } from './types';
import { clamp, nearestEnabled } from './math';
export type { Choice, SelectionProps } from './types';

export function SingleSelectList({options, value, onValueChange, label, disabled}: SelectionProps) {
  return <View accessibilityRole="radiogroup" accessibilityLabel={label}>
    <Text style={styles.heading}>{label}</Text>
    {options.map(option => <Pressable key={option.value} accessibilityRole="radio"
      accessibilityState={{checked: value === option.value, disabled: !!disabled || !!option.disabled}}
      disabled={disabled || option.disabled} onPress={() => onValueChange(option.value)}
      style={[styles.row, value === option.value && styles.rowSelected, (disabled || option.disabled) && styles.disabled]}>
      <View style={[styles.radio, value === option.value && styles.radioSelected]}>{value === option.value && <View style={styles.radioDot}/>}</View>
      <View><Text style={styles.rowTitle}>{option.label}</Text>{option.description && <Text style={styles.description}>{option.description}</Text>}</View>
    </Pressable>)}
  </View>;
}

/** Uses RN's JS-thread PanResponder and Animated.Value; no gesture-handler or Reanimated required. */
export function SegmentedSelector({options, value, onValueChange, label, disabled}: SelectionProps) {
  const [width, setWidth] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const latest = useRef({options, value, onValueChange, disabled, width});
  latest.current = {options, value, onValueChange, disabled, width};
  const segmentWidth = width / Math.max(1, options.length);
  const selected = options.findIndex(option => option.value === value);
  useEffect(() => { Animated.spring(x, {toValue: Math.max(0, selected) * segmentWidth, useNativeDriver: true, damping: 24, stiffness: 280, mass: 0.8}).start(); }, [selected, segmentWidth, x]);
  const responder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => {
      const p = latest.current;
      return !p.disabled && p.options.some(o => !o.disabled) && Math.abs(gesture.dx) > 4 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
    },
    onPanResponderMove: (_event, gesture) => {
      const p = latest.current, w = p.width / Math.max(1, p.options.length);
      const index = Math.max(0, p.options.findIndex(o => o.value === p.value));
      x.setValue(clamp(index * w + gesture.dx, 0, Math.max(0, p.width - w)));
    },
    onPanResponderRelease: (_event, gesture) => {
      const p = latest.current, w = p.width / Math.max(1, p.options.length);
      if (!w) return;
      const index = Math.max(0, p.options.findIndex(o => o.value === p.value));
      const next = nearestEnabled(p.options, clamp(index + gesture.dx / w, 0, p.options.length - 1));
      // Return to controlled value if parent does not update; a subsequent prop update moves it.
      Animated.spring(x, {toValue: index * w, useNativeDriver: true, damping: 24, stiffness: 280, mass: 0.8}).start();
      if (next >= 0 && p.options[next].value !== p.value) p.onValueChange(p.options[next].value);
    },
    onPanResponderTerminate: () => {
      const p = latest.current, index = Math.max(0, p.options.findIndex(o => o.value === p.value));
      x.setValue(index * p.width / Math.max(1, p.options.length));
    },
  })).current;
  if (!options.length) return null;
  return <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.trackShell}>
    <View style={styles.track} onLayout={event => setWidth(event.nativeEvent.layout.width)} {...responder.panHandlers}>
      {selected >= 0 && width > 0 && <Animated.View pointerEvents="none" style={[styles.indicator, {width: segmentWidth, transform: [{translateX: x}]}]}/>}
      {options.map(option => <Pressable key={option.value} accessibilityRole="radio"
        accessibilityState={{checked: value === option.value, disabled: !!disabled || !!option.disabled}}
        disabled={disabled || option.disabled} onPress={() => onValueChange(option.value)}
        style={[styles.segment, (disabled || option.disabled) && styles.disabled]}>
        <Text numberOfLines={1} style={[styles.segmentText, value === option.value && styles.segmentSelected]}>{option.label}</Text>
      </Pressable>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  heading:{fontSize:15,fontWeight:'600',color:'#0f172a',marginBottom:10},
  row:{flexDirection:'row',alignItems:'center',gap:12,padding:14,borderRadius:12,borderWidth:1,borderColor:'#dfe4ea',marginBottom:8},
  rowSelected:{borderColor:'#2563eb',backgroundColor:'#eff6ff'}, rowTitle:{fontSize:15,fontWeight:'600',color:'#0f172a'},description:{fontSize:13,color:'#64748b',marginTop:3},
  radio:{width:18,height:18,borderWidth:2,borderColor:'#94a3b8',borderRadius:9,alignItems:'center',justifyContent:'center'},radioSelected:{borderColor:'#2563eb'},radioDot:{width:8,height:8,borderRadius:4,backgroundColor:'#2563eb'},disabled:{opacity:.45},
  trackShell:{padding:4,borderRadius:12,backgroundColor:'#edf0f4'},track:{height:40,flexDirection:'row',position:'relative'},
  indicator:{position:'absolute',top:0,bottom:0,left:0,borderRadius:9,backgroundColor:'#fff',elevation:2},segment:{flex:1,justifyContent:'center',alignItems:'center',paddingHorizontal:6},segmentText:{fontSize:14,color:'#475569'},segmentSelected:{fontWeight:'600',color:'#0f172a'}
});
