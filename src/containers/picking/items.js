'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { withNavigation } from 'react-navigation'
import { AppRegistry, StyleSheet, NativeModules, DeviceEventEmitter, BackHandler } from 'react-native'
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
  Icon,
  Item,
  Input,
  Label,
} from 'native-base'
import {
  toast,
  getAllItems,
  removePicking,
  checkFinished,
  confirm,
  navigationReset,
  navigationGo,
} from '../../lib'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import { pausePicking, pickup, getPickingItem } from '../../api'

const ScanModule = NativeModules.ScanModule
const msgOption = ['儲位', '料號', '批號']
const scanColumn = ['psrmk', 'pslitm', 'pslotn']

const styles = StyleSheet.create({
  content: {
    padding: 10
  },
  scanInfo: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#f0ad4e',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  scanInfoSuccess: {
    fontSize: 20,
    fontWeight: '400',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: '#36D025',
    borderRadius: 1,
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  pickingInfo: {
    fontSize: 20,
    fontWeight: '400',
    padding: 5,
    marginTop: 2,
    marginBottom: 3,
  },
  message: {
    fontSize: 20,
    color: '#f0ad4e',
    marginTop: 20,
    marginBottom: 20,
  }
})

class PickingItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scanIndex: 0,
      item: {},
      amt: null,
      isLoading: false,
      message: '',
      passing: false,
      saving: false,
    }
    this.cancelPicking = this.cancelPicking.bind(this)
    this.pickup = this.pickup.bind(this)
    this.checkAmt = this.checkAmt.bind(this)
    this.goBackPicking = this.goBackPicking.bind(this)
  }

  componentDidMount() {
    this.getItem()
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelPicking())
    DeviceEventEmitter.addListener('onScanBarcode', this.onScanBarcode.bind(this))
    DeviceEventEmitter.addListener('onRefreshMessage', (msg) => toast(msg))
    ScanModule.enabledScan()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress')
    DeviceEventEmitter.removeListener('onScanBarcode')
    DeviceEventEmitter.removeListener('onRefreshMessage')
    ScanModule.disabledScan()
  }

  getItem() {
    const stop = this.props.navigation.state.params.picking.ststop
    this.setState({ isLoading: true })
    const success = (res) => {
      this.setState({
        item: res.data,
        isLoading: false,
      }, () => this.checkFinished())
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    getPickingItem(stop, success, error)
  }

  onScanBarcode(code) {
    const { item, scanIndex } = this.state
    let index = scanIndex%5
    if (index >= 3) return
    if (Object.keys(item).length > 0) {
      if (code === item[scanColumn[index]]) {
        index++
        this.setState({
          scanIndex: index,
          message: '',
        })
      } else {
        this.setState({ message: msgOption[index] + '錯誤(' + code + ')' })
      }
    }
  }

  checkAmt() {
    const { item, amt } = this.state
    if (Number(item.pssoqs) === Number(amt)) {
      this.setState({
        passing: true,
        message: '',
      })
    } else {
      this.setState({
        passing: false,
        message: '揀貨數量錯誤' + amt
      })
    }
  }

  cancelPicking() {
    const title = '暫停揀貨'
    const msg = '您確定要匠停揀貨？'
    confirm(title, msg, this.goBackPicking, () => { })
    return true
  }

  goBackPicking() {
    const { item } = this.state
    const success = (res) => {
      this.setState({isLoading: true})
      navigationReset(this, 'PickingList')
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    pausePicking(item.psstop, success, error)
  }

  pickup() {
    const { item } = this.state
    this.setState({saving: true})
    const success = (res) => {
      this.setState({
        item: res.data,
        scanIndex: 0,
        amt: null,
        isLoading: false,
        passing: false,
        saving: false,
      }, () => this.checkFinished())
    }
    const error = (err) => {
      alert(err.response.data.message)
    }
    pickup(item, success, error)
  }

  checkFinished() {
    const { picking } = this.props.navigation.state.params
    const { item } = this.state
    if (Object.keys(item).length === 0) {
      const params = {
        picking: picking,
      }
      navigationGo(this, 'PickingEnd', params)
    }
  }

  render() {
    const { item, isLoading, scanIndex, passing, amt, message, saving } = this.state
    return (
      <StyleProvider style={getTheme(material)} >
        {isLoading ?
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking} style={{ width: 50 }}>
                  <Icon name='md-pause' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>揀貨作業</Title>
              </Body>
            </Header>
            <Content style={styles.content}>
              <Text style={styles.pickingInfo}>資料處理中...</Text>
            </Content>
          </Container>
          :
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.cancelPicking} style={{ width: 50 }}>
                  <Icon name='md-pause' />
                </Button>
              </Left>
              <Body>
                <Title style={{ width: 100 }}>揀貨作業</Title>
              </Body>
            </Header>
            {Object.keys(item).length > 0 &&
              <Content style={styles.content}>
                <Text style={styles.pickingInfo}>{'倉別: ' + item.pslocn.trim()}</Text>
                <Text style={scanIndex > 0 ? styles.scanInfoSuccess : styles.scanInfo}>{'儲位: ' + item.psrmk.trim()}</Text>
                <Text style={scanIndex > 1 ? styles.scanInfoSuccess : styles.scanInfo}>{'料號: ' + item.pslitm.trim()}</Text>
                <Text style={scanIndex > 2 ? styles.scanInfoSuccess : styles.scanInfo}>{'批號: ' + item.pslotn.trim()}</Text>
                <Text style={styles.pickingInfo}>{'揀貨數量: ' + item.pssoqs + ' ' + item.psuom.trim()}</Text>
                {shwoDetail(Number(item.pssoqs), item.tag1, item.tag2, item.tag3)}
                {scanIndex === 3 &&
                  <Item floatingLabel>
                    <Label>輸入揀貨數量</Label>
                    <Input
                      keyboardType="numeric"
                      onChange={(e) => this.setState({ amt: e.nativeEvent.text, passing: false })}
                      autoFocus={true}
                      value={amt}
                      onSubmitEditing={this.checkAmt}
                    />
                  </Item>
                }
                {message !== '' &&
                  <Text style={styles.message}>{message}</Text>
                }
                {passing && !saving &&
                  <Button block primary large onPress={this.pickup}>
                    <Text>確認</Text>
                  </Button>
                }
                {passing && saving &&
                  <Button block primary large disabled>
                    <Text>處理中...</Text>
                  </Button>
                }
              </Content>
            }
          </Container>
        }
      </StyleProvider>
    )
  }
}

function shwoDetail(soqs, tag1, tag2, tag3) {
  soqs = Number(soqs)
  let t1 = Number(tag1)
  let t2 = Number(tag2) * t1
  let t3 = Number(tag3) * t2
  let b1, b2, b3, msg
  if (t3 > 0) {
    b3 = Math.floor(soqs / t3) 
    soqs = soqs % t3
    b2 = Math.floor(soqs / t2)
    soqs = soqs % t2
    b1 = Math.floor(soqs / t1)
    msg = b3 + '箱' + b2 + '盒又' + b1
  } else if (t2 > 0) {
    b2 = Math.floor(soqs / t2)
    soqs = soqs % t2
    b1 = Math.floor(soqs / t1)
    msg = b2 + '盒又' + b1
  } else if (t1 > 0) {
    b1 = Math.floor(soqs / t1)
    msg = b1 + '銷售包裝'
  } else {
    msg = '--'
  }
  return (
    <Text style={styles.pickingInfo}>{'揀貨數量: ' + msg}</Text>
  )
}

export default withNavigation(PickingItems)
AppRegistry.registerComponent('PickingItems', () => PickingItems)