'use strict'
import React, { Component } from 'react'
import { AppRegistry, StyleSheet, ListView, BackHandler } from 'react-native'
import { 
  Container, 
  Content, 
  StyleProvider, 
  Header, 
  Left, 
  Body, 
  Button, 
  Title, 
  Text, 
  Icon 
} from 'native-base'
import { withNavigation } from 'react-navigation'
import { loadToken, navigationGo, setCurrentPicking } from '../../lib'
import { getPickingItems, pickingStart } from '../../api'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

class PickingStart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSubmiting: false,
      pickingItems: [],
      vs: ds.cloneWithRows([]),
    }
    this.submitButton = this.submitButton.bind(this)
    this.goBack = this.goBack.bind(this)
    this.pickingStart = this.pickingStart.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.goBack)
    this.getPickingItems()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => {})
  }

  getPickingItems() {
    const { state } = this.props.navigation
    const stop = state.params.picking.ststop
    this.setState({ isLoading: true })
    const success = (res) => {
      this.setState({
        pickingItems: res.data,
        isLoading: false,
        vs: ds.cloneWithRows(res.data)
      })
    }
    const error = (err) => {
      alert(err)
    }
    getPickingItems(stop, success, error)
  }

  goBack() {
    this.props.navigation.state.params.unlock();
    this.props.navigation.goBack()
    return true
  }

  setItem(item, index) {
    const num = '品項' + (Number(index) + 1 < 10 ? '0' : '') + (Number(index) + 1)
    const pslocn = ' [' + item.pslocn.trim() + ']'
    const psrmk = ' [' + item.psrmk.trim() + ']'
    const pslitm = ' [' + item.pslitm.trim() + ']'
    const pslotn = ' [' + item.pslotn.trim() + ']'
    const amt = ' ' + item.pssoqs + '(' + item.psuom + ')'
    return (
      num + pslitm + pslotn + amt
    )
  }

  pickingStart() {
    this.setState({ isSubmiting: true })
    const stop = this.props.navigation.state.params.picking.ststop
    const success = () => {
      this.goItems()
    }
    const error = () => {
      alert(error)
      this.setState({ isSubmiting: false })
    }
    pickingStart(stop, success, error)
  }

  goItems() {
    const { picking } = this.props.navigation.state.params
    const { pickingItems } = this.state
    this.props.navigation.state.params.unlock()
    setCurrentPicking(picking, pickingItems)
    this.setState({ isSubmiting: false })
    navigationGo(this, 'PickingItems')
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
        <Button block primary large onPress={this.pickingStart} style={{ margin: 10 }}>
          <Text>開始揀貨</Text>
        </Button>
      )
    }
  }

  render() {
    const { state } = this.props.navigation
    const { pickingItems } = this.state
    const { picking } = state.params
    return (
      <StyleProvider style={getTheme(material)} >
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.goBack} style={{ width: 50 }}>
                <Icon name='ios-arrow-back-outline' />
              </Button>
            </Left>
            <Body>
              <Title>揀貨確認</Title>
            </Body>
          </Header>
          <Content style={styles.content}>
            <Text style={styles.pickingInfo}>{'揀貨單號:' + picking.sticu}</Text>
            <Text style={styles.pickingInfo}>{'站碼:' + picking.ststop}</Text>
            <Text style={styles.pickingInfo}>{'日期:' + picking.staddj.substring(0, 10)}</Text>
            <ListView
              enableEmptySections={true}
              style={styles.listView}
              dataSource={this.state.vs}
              renderRow={(item, section, row, high) => (
                <Text style={styles.listItems}>{this.setItem(item, row)}</Text>
              )}
            />
            {this.state.isLoading &&
              <Text style={styles.pickingInfo}>揀貨清單讀取中...</Text>
            }
            {!this.state.isLoading &&
              this.state.isSubmiting ?
                <Button block disabled large style={{ margin: 10 }}>
                  <Text>處理中...</Text>
                </Button>
              :
                <Button block primary large onPress={this.pickingStart} style={{ margin: 10 }}>
                  <Text>開始揀貨</Text>
                </Button>
            }
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
  listView: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItems: {
    fontSize: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingTop: 10,
    paddingBottom: 10,
  },
})

export default withNavigation(PickingStart)
AppRegistry.registerComponent('PickingStart', () => PickingStart)