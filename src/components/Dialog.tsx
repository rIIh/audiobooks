import styled from 'styled-components/native';
import {PixelRatio} from 'react-native';

export class Dialog {
  static Container = styled.View`
    background-color: white;
    border-radius: 4px;
    padding: 16px;
  `;
  static Title = styled.Text`
    font-weight: bold;
    font-size: ${PixelRatio.get() * 8}px;
  `;
  static Actions = styled.View`
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding-top: 12px;
  `;
}
