'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import { AppRegistry } from 'react-native'
import { Container, Content, StyleProvider } from 'native-base'
import { Form, Item, Input, Title, Label, Button, Text } from 'native-base'
import { withNavigation } from 'react-navigation'
import config from '../../config'
import { jwtPayload, toast, saveToken, navigationReset } from '../../lib'
import Navbar from '../navbar'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import { login } from '../../api'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: '',
      password: '',
      isLoading: false,
    }
    this.login = this.login.bind(this)
    this.setLoginUser = this.setLoginUser.bind(this)
    this.loginSuccess = this.loginSuccess.bind(this)
  }

  login() {
    const { id, password } = this.state
    const success = (res) => {
      this.setState({isLoading: false})
      this.setLoginUser(res.data.token)
      this.loginSuccess()
    }
    const error = (err) => {
      alert(err)
      this.setState({isLoading: false})
    }

    this.setState({isLoading: true}, () => {
      login(id, password, success, error)
    })
  }

  setLoginUser(token) {
    saveToken(token)
    const user = jwtPayload(token)
    toast(user.name + '您好...')
  }

  loginSuccess() {
    navigationReset(this, 'PickingList')
  }

  render() {
    const { id, password, isLoading } = this.state
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Navbar title="使用者登入" />
          <Content>
            <Form>
              <Item floatingLabel>
                <Label>帳號</Label>
                <Input
                  onChange={(e) => this.setState({ id: e.nativeEvent.text })}
                  autoFocus={true}
                  value={id}
                  onSubmitEditing={() => this._password._root.focus()}
                />
              </Item>
              <Item floatingLabel last>
                <Label>密碼</Label>
                <Input
                  getRef={(c) => this._password = c}
                  secureTextEntry={true}
                  onChange={(e) => this.setState({ password: e.nativeEvent.text })}
                  value={password}
                  onSubmitEditing={this.login}
                />
              </Item>
            </Form>
            {isLoading ?
              <Button block disabled style={{ margin: 10 }}>
                <Text>處理中...</Text>
              </Button>
              :
              <Button block primary onPress={this.login} style={{ margin: 10 }}>
                <Text>登入</Text>
              </Button>
            }
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

export default withNavigation(Login)
AppRegistry.registerComponent('Login', () => Login)