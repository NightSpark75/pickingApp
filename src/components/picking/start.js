'use strict'
import React, { Component } from 'react'
import axios from 'axios'
import Realm from 'realm'
import { itemsRealm, pickingRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, ListView, BackHandler } from 'react-native'
import { Container, Content, StyleProvider, Header, Left, Body } from 'native-base'
import { Button, Title, Text, Icon } from 'native-base'
import { NavigationActions, withNavigation } from 'react-navigation'
import { loadToken } from '../../lib'
import config from '../../config'
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
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.goBack())
    this.getPickingItems()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => { })
  }

  getPickingItems() {
    this.setState({ isLoading: true })
    const self = this
    const { state } = this.props.navigation
    let token = loadToken()
    const Auth = 'Bearer ' + token
    axios.get(config.route.pickingItems + state.params.picking.ststop + '/' + config.date, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.setState({
            pickingItems: response.data,
            isLoading: false,
            vs: ds.cloneWithRows(response.data)
          })
        } else {
          alert(response.data.error)
        }
      }).catch(function (error) {
        alert(error)
      })
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
    const self = this
    let formData = new FormData()
    formData.append('stop', this.props.navigation.state.params.picking.ststop)
    formData.append('date', config.date)
    let token = loadToken()
    const Auth = 'Bearer ' + token;
    axios.post(config.route.pickingStart, formData, { headers: { Authorization: Auth } })
      .then(function (response) {
        if (response.code = 200) {
          self.goItems()
        } else {
          alert(response.data.error)
          self.setState({ isSubmiting: false })
        }
      }).catch(function (error) {
        alert(error)
        self.setState({ isSubmiting: false })
      })
  }

  goItems() {
    const { picking } = this.props.navigation.state.params
    const { pickingItems } = this.state
    this.props.navigation.state.params.unlock();
    this.setCurrentPicking(picking, pickingItems)
    this.setState({ isSubmiting: false })
    const navigationAction = NavigationActions.navigate({
      routeName: 'PickingItems',
    })
    this.props.navigation.dispatch(navigationAction)
  }

  setCurrentPicking(picking, items) {
    let realm = new Realm({ schema: [pickingRealm, itemsRealm] })
    realm.write(() => {
      let deletePicking = realm.objects(pickingRealm.name)
      realm.delete(deletePicking)
      realm.create(pickingRealm.name, picking)

      let deleteItems = realm.objects(itemsRealm.name)
      realm.delete(deleteItems)
      items.map((row) => {
        realm.create(itemsRealm.name, row)
      })
    })
    realm.close()
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
        <Button block primary large onPress={this.pickingStart.bind(this)} style={{ margin: 10 }}>
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
              <Button transparent onPress={this.goBack.bind(this)} style={{ width: 50 }}>
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
              this.submitButton()
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
});

export default withNavigation(PickingStart)
AppRegistry.registerComponent('PickingStart', () => PickingStart);