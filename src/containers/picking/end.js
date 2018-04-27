'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Alert, View, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body, Button, Title, Text, Icon } from 'native-base'
import { getPickingInfo, removePicking, confirm, navigationReset } from '../../lib'
import { withNavigation } from 'react-navigation'
import { pickingEnd, pausePicking, pickup } from '../../api'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

class PickingEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmiting: false,
    }
    this.goBackPicking = this.goBackPicking.bind(this)
    this.pickingEnd = this.pickingEnd.bind(this)
    this.cancelPicking = this.cancelPicking.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelPicking())
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
  }

  cancelPicking() {
    const title = '暫停揀貨'
    const msg = '您確定要暫停揀貨？'
    confirm(title, msg, this.goBackPicking(), () => {})
    return true
  }

  goBackPicking() {
    const { item } = this.state
    const success = (res) => {
      this.setState({isLoading: true})
      navigationReset(this, 'PickingList')
    }
    const error = (err) => {
      alert(err.response.data)
    }
    pausePicking(item.stop, success, error)
  }

  pickingEnd() {
    const { picking } = this.props.navigation.state.params
    this.setState({ isSubmiting: true })
    const success = (res) => {
      alert('單號:' + picking.sticu + ', 站碼:' + picking.ststop + ' 已完成鍊料')
      navigationReset(this, 'PickingList')
    }
    const error = (err) => {
      alert(err)
      this.setState({ isSubmiting: false })
    }
    pickingEnd(picking.ststop, success, error)
  }

  submitButton() {
    if (this.state.isSubmiting) {
      return (
        <Button block disabled large style={{ margin: 10 }}>
          <Text>處理中...</Text>
        </Button>
      )
    } else {
      return (
        <Button block primary large onPress={this.pickingEnd} style={{ margin: 10 }}>
          <Text>完成揀貨</Text>
        </Button>
      )
    }
  }

  render() {
    const { state } = this.props.navigation;
    const { picking } = this.props.navigation.state.params
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              {/*<Button transparent onPress={this.cancelPicking} style={{ width: 50 }}>
                <Icon name='md-close' />
              </Button>*/}
            </Left>
            <Body>
              <Title>完成揀貨</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            <View>
              <Text style={styles.pickingInfo}>{'揀貨單號:' + picking.sticu}</Text>
              <Text style={styles.pickingInfo}>{'站碼:' + picking.ststop}</Text>
              <Text style={styles.pickingInfo}>{'日期:' + picking.staddj.substring(0, 10)}</Text>
              <Text style={styles.message}>
                所有品項已完成，按下按鈕完成揀貨...
              </Text>
              {this.submitButton()}
            </View>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  pickingInfo: {
    fontSize: 20,
  },
  message: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
})

export default withNavigation(PickingEnd)
AppRegistry.registerComponent('PickingEnd', () => PickingEnd)