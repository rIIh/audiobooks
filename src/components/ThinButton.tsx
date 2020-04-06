import React from "react";
import FeatherIcon from "../../lib/feather1s-extended";
import styled from "styled-components/native";
import {BorderlessButton} from "react-native-gesture-handler";

export const StyledButton = styled(BorderlessButton)`
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
`;

export const ThinButton: React.FC<{ name: string; size?: number; onPress?: (event: any) => void }> = ({name, size, onPress}) => {
  return <StyledButton onPress={onPress}>
    <FeatherIcon name={name} style={{fontSize: size ?? 18}}/>
  </StyledButton>;
};
