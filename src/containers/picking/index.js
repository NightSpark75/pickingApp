'use strict'
import React, { Component } from 'react'
import Realm from 'realm'
import { pickingRealm, itemsRealm } from '../../realm/schema'
import { AppRegistry, StyleSheet, RefreshControl, View, ListView, TouchableHighlight } from 'react-native'
import { Drawer, Container, Content, StyleProvider, Header, Left, Body } from 'native-base'
import { Button, Title, Icon, Text } from 'native-base'
import { withNavigation } from 'react-navigation'
import { navigationGo } from '../../lib'
import config from '../../config'
import getTheme from '../../nativeBase/components'
import material from '../../nativeBase/variables/material'
import Sidebar from '../sidebar'
import { goCurrentPicking, getPickingList } from '../../api'

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
let doubleClick = false

class Picking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuShow: false,
      refreshing: false,
      pickingList: [],
      vs: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.setState({ refreshing: true }, () => this.onRefresh())
  }

  getPickingList() {
    const success = (res) => {
      if (res.data.current === null) {
        this.setState({
          pickingList: res.data.list,
          refreshing: false,
          vs: ds.cloneWithRows(res.data.list)
        })
      } else {
        this.goCurrentPicking(res.data.current)
      }
    }
    const error = (err) => {
      alert(err)
    }
    getPickingList(success, error)
  }

  goCurrentPicking(data) {
    const picking = {
      sticu: data.sticu,
      ststop: data.ststop,
      staddj: data.staddj,
    }
    const params = { picking: picking }
    navigationGo(this, 'PickingItems', params)
  }

  goPickingStart(item) {
    if (!doubleClick) {
      doubleClick = true
      const params = {
        picking: item,
        unlock: () => doubleClick = false
      }
      this.props.closeDrawer
      navigationGo(this, 'PickingStart', params)
    }
  }

  closeDrawer = () => {
    this.drawer._root.close()
  }

  openDrawer = () => {
    this.drawer._root.open()
  }

  onRefresh() {
    this.setState({
      refreshing: true,
      pickingList: [],
    }, () => this.getPickingList())
  }

  render() {
    const { pickingList, message } = this.state
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
                <Button transparent onPress={this.openDrawer.bind(this)} style={{ width: 50 }}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>揀貨單列表</Title>
              </Body>
            </Header>
            <Content
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                  colors={['red', 'orange']}
                />
              }
            >
              {pickingList.length === 0 ?
                <View style={{ alignItems: 'center', }}>
                  <Text style={{ fontSize: 24 }}>
                    目前沒有揀貨單...
                </Text>
                </View>
                :
                <ListView
                  enableEmptySections={true}
                  style={styles.listView}
                  dataSource={this.state.vs}
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      underlayColor='rgb(143, 186, 239)'
                      onPress={this.goPickingStart.bind(this, rowData)}
                    >
                      <Text
                        style={rowData.sticu !== null ? styles.listItems : styles.listItemsWar}
                      >
                        {'單號:' + rowData.sticu + ' 站碼:' + rowData.ststop}
                      </Text>
                    </TouchableHighlight>
                  )}
                />
              }
            </Content>
          </Container>
        </Drawer>
      </StyleProvider>
    )
  }
}

const styles = StyleSheet.create({
  listView: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItems: {
    fontSize: 24,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 10
  },
  listItemsWar: {
    fontSize: 24,
    fontWeight: '600',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    color: '#F75000',
    padding: 10
  },
})

export default withNavigation(Picking)
AppRegistry.registerComponent('Picking', () => Picking)