import styled from 'styled-components/native';

export const CircleButton = styled.TouchableOpacity<{ size?: number }>`
  border-style: solid;
  margin-left: 4px;
  border-color: black;
  border-width: 1px;
  border-radius: ${props => (props?.size ?? 40) / 2}px;
  justify-content: center;
  align-items: center;
  height: ${props => props.size ?? 40}px;
  width: ${props => props.size ?? 40}px;
`;
