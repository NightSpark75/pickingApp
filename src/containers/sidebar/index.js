'use strict'
import React, { Component } from 'react'
import { AppRegistry, Alert } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon, Text, List, ListItem } from 'native-base'
import { withNavigation } from 'react-navigation'
import { removeToken, confirm, navigationReset } from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.logout = this.logout.bind(this)
    this.removeUserInfo = this.removeUserInfo.bind(this)
  }

  goPage(page, params={}) {
    const navigationAction = NavigationActions.navigate({
      routeName: page,
      params: params,
    })
    this.props.closeDrawer
    this.props.navigation.dispatch(navigationAction)
  }

  logout() {
    confirm('登出', '您確定要登出系統？', this.removeUserInfo, () => {})
  }

  removeUserInfo() {
    removeToken()
    navigationReset(this, 'Login')
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={{backgroundColor: '#fff', margin: 0}}>
          <Content>
            <List>
              {/*this.state.admin &&
                <ListItem icon onPress={this.goPage.bind(this, 'Scan')}>
                  <Left>
                    <Icon name="ios-barcode" />
                  </Left>
                  <Body>
                    <Text>
                      掃描模組測試
                    </Text>
                  </Body>
                </ListItem>
              */}
              <ListItem icon onPress={this.logout}>
                <Left>
                  <Icon name="ios-log-out" />
                </Left>
                <Body>
                  <Text>
                    登出
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

export default withNavigation(Sidebar)
AppRegistry.registerComponent('Sidebar', () => Sidebar)