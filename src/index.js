'use strict'
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Root } from "native-base"
import RouteConfigs from './route/routeConfigs'
import StackNavigatorConfig from './route/stackNavigatorConfig'

const Navigator = StackNavigator(RouteConfigs, StackNavigatorConfig)

export default class EntryPoint extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <Root>
        <Navigator />
      </Root>
    )
  }
}

AppRegistry.registerComponent('Root', () => EntryPoint);