'use strict'
import React, { Component } from 'react'
import { AppRegistry, Alert } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body, Right } from 'native-base'
import { Button, Title, Icon, Text, List, ListItem } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { jwtPayload, loadToken, removeToken } from '../../lib'
import { userLogout } from '../../actions'
import getTheme from '../../nativeBase/components';
import material from '../../nativeBase/variables/material';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: false
    };
  }

  componentDidMount() {
    this.checkAdmin()
  }
  
  checkAdmin() {
    let token = loadToken()
    let payload = jwtPayload(token)
    if (payload.sub = '106013') [
      this.setState({ admin: true })
    ]
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
    Alert.alert(
      '登出',
      '您確定要登出系統？',
      [
        {text: '確定', onPress: () => this.removeUserInfo()},
        {text: '取消', onPress: () => null},
      ],
      { cancelable: false }
    )
  }

  removeUserInfo() {
    const { dispatch } = this.props
    removeToken()
    dispatch(userLogout())
    const login = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Login',
        })
      ]
    })
    this.props.navigation.dispatch(login)
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
              <ListItem icon onPress={this.logout.bind(this)}>
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

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(withNavigation(Sidebar))
AppRegistry.registerComponent('Sidebar', () => Sidebar)