'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, Dimensions } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Right, Body, Title  } from 'native-base'
import { Button, Icon, Text } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { toast } from '../../lib'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

const ScanModule = NativeModules.ScanModule

class Scan extends Component {
  constructor(props) {
    super(props);
    this.state = {
        str: '',
        text: '',
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('onRefreshMessage', this.onUpdateMessage)
    DeviceEventEmitter.addListener('onScanBarcode', this.onUpdateMessage)
    ScanModule.enabledScan()
  }
  componentWillUnmount() {
    DeviceEventEmitter.removeListener('onRefreshMessage', this.onUpdateMessage)
    DeviceEventEmitter.removeListener('onScanBarcode', this.onUpdateMessage)
    ScanModule.disabledScan()
  }

  onUpdateMessage = (str='') => {
    toast(str)
  }

  enabledScan()
  {
    ScanModule.enabledScan()
  }

  disabledScan()
  {
    ScanModule.disabledScan()
  }

  goBack() {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.goBack.bind(this)}>
                <Icon name='ios-arrow-back-outline' />
              </Button>
            </Left>
            <Body>
              <Title>掃描模組測試</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            <Button block success style={styles.button} onPress={this.enabledScan.bind(this)}>
              <Text>開啟掃描模組</Text>
            </Button>
            <Button block danger style={styles.button} onPress={this.disabledScan.bind(this)}>
              <Text>關閉掃描模組</Text>
            </Button>
            <Text>目前螢幕寬度:{Dimensions.get('window').width}</Text>
            <Text>目前螢幕高度:{Dimensions.get('window').height}</Text> 
            <Text>目前螢幕解析度:{Dimensions.get('window').scale}</Text>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  }
});

export default withNavigation(Scan)
AppRegistry.registerComponent('Scan', () => Scan);