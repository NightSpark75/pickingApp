'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import Toast from 'react-native-root-toast'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

class SampleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  goBack() {
    this.props.navigation.goBack()
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.goBack.bind(this)}>
                <Icon name='ios-arrow-back-outline' />
              </Button>
            </Left>
            <Body>
              <Title>清單詳細資料</Title>
            </Body>
            <Right>
            </Right>
          </Header>
          <Content>
            <Text>{state.params.id}</Text>
            <Text>{state.params.name}</Text>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
});

export default withNavigation(SampleDetail)
AppRegistry.registerComponent('SampleDetail', () => SampleDetail);