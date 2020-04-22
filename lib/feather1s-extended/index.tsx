import React from 'react';
import FeatherIcon1s from 'react-native-feather1s';
import { IconProps } from 'react-native-vector-icons/Icon';
import ExtendedIcon from './src';

const FeatherIcon: React.FC<{ thin?: boolean; fontSize?: number } & IconProps> = ({ thin = true, name, fontSize = 24, style, ...props }) => {
  return ExtendedIcon.getRawGlyphMap()[name] != null ? (
    <ExtendedIcon name={name} style={[{ fontSize }, style]} {...props} />
  ) : (
    <FeatherIcon1s thin={thin} name={name} style={[{ fontSize }, style]} {...props} />
  );
};

export default FeatherIcon;
