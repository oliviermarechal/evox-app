import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressCircleProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 1
  color: string;
  backgroundColor?: string;
}

export default function ProgressCircle({ 
  size, 
  strokeWidth, 
  progress, 
  color, 
  backgroundColor = 'transparent' 
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Cercle de fond */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Cercle de progression */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
