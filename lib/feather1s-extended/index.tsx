import React from 'react';
import FeatherIcon1s from 'react-native-feather1s';
import { IconProps } from 'react-native-vector-icons/Icon';
import ExtendedIcon from './src';

const FeatherIcon: React.FC<{ thin?: boolean } & IconProps> = ({ thin, name, ...props }) => {
  return ExtendedIcon.getRawGlyphMap()[name] != null ? (
    <ExtendedIcon name={name} {...props} />
  ) : (
    <FeatherIcon1s thin={thin} name={name} {...props} />
  );
};

export default FeatherIcon;
