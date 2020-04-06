import React from 'react';
import Animated from 'react-native-reanimated';
import { View } from 'native-base';

export const Handle: React.FC<{ value: Animated.Value<number> }> = ({ value }) => {
  const animatedBar1Rotation = (outputRange: number[]) =>
    Animated.interpolate(value, {
      inputRange: [0, 0.5],
      outputRange: outputRange,
      extrapolate: Animated.Extrapolate.CLAMP,
    });

  const stroke = 2;

  return (
    <View
      style={{
        position: 'absolute',
        alignSelf: 'center',
        top: 10,
        height: 20,
        width: 20,
      }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: '#D1D1D6',
            top: 5,
            borderRadius: 3,
            height: stroke,
            width: 20,
          },
          {
            left: -7.5,
            transform: [
              {
                rotate: Animated.concat(
                  // @ts-ignore
                  animatedBar1Rotation([0.3, 0]),
                  'rad',
                ),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: '#D1D1D6',
            top: 5,
            borderRadius: 3,
            height: stroke,
            width: 20,
          },
          {
            right: -7.5,
            transform: [
              {
                rotate: Animated.concat(
                  // @ts-ignore
                  animatedBar1Rotation([-0.3, 0]),
                  'rad',
                ),
              },
            ],
          },
        ]}
      />
    </View>
  );
};
