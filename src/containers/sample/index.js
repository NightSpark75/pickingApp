'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon, Text, List, ListItem } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { toast } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'

class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
    };
  }

  goDetail(item) {
    const navigationAction = NavigationActions.navigate({
      routeName: 'SampleDetail',
      params: {id: item.id, name: item.name},
    })
    this.props.closeDrawer
    this.props.navigation.dispatch(navigationAction)
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }

  openDrawer = () => {
    this.drawer._root.open()
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Drawer
          ref={(ref) => { this.drawer = ref; }}
          content={<Sidebar navigator={this.navigator} />}
          onClose={() => this.closeDrawer()} 
        >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.openDrawer.bind(this)}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>Sample page</Title>
              </Body>
            </Header>
            <Content>
              <List>
                {list.map((item, index) => (
                  <ListItem key={index} onPress={this.goDetail.bind(this, item)}>
                    <Text>{item.name}</Text>
                  </ListItem>
                ))}
            </List>
            </Content>
          </Container>
          </Drawer>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    margin: 20,
  }
});

const list = [
  {
    id: 'L0001',
    name: '清單1',
  },
  {
    id: 'L0002',
    name: '清單2',
  },
  {
    id: 'L0003',
    name: '清單3',
  },
  {
    id: 'L0004',
    name: '清單4',
  },
  {
    id: 'L0005',
    name: '清單5',
  },
  {
    id: 'L0006',
    name: '清單6',
  },
]

function mapStateToProps(state) {
  const { login } = state
  return {
    login
  }
}

export default connect(mapStateToProps)(withNavigation(Sample))
AppRegistry.registerComponent('Sample', () => Sample);