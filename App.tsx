/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { StatusBar, Text } from 'react-native';
import {
  Button,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Icon,
  Left,
  Right,
  Title,
  Body,
} from 'native-base';
import WebView from 'react-native-webview';

// import styled from 'styled-components/native';

declare var global: { HermesInternal: null | {} };

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <WebView source={{ uri: 'https://google.com' }} />
          {/*<Text>This is Content Section</Text>*/}
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
};

export default App;
