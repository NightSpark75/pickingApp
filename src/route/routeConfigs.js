import Scan from '../containers/scan'
import Update from '../containers/update'
import Login from '../containers/login'
import Sample from '../containers/sample'
import SampleDetail from '../containers/sample/detail'
import PickingList from '../containers/picking/index'
import PickingItems from '../containers/picking/items'
import PickingStart from '../containers/picking/start'
import PickingEnd from '../containers/picking/end'

export default {
  Scan: {
    screen: Scan,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Update: {
    screen: Update,
    natigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  Sample: {
    screen: Sample,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  SampleDetail: {
    screen: SampleDetail,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    }),
  },
  PickingList: {
    screen: PickingList,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  PickingItems: {
    screen: PickingItems,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  PickingStart: {
    screen: PickingStart,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
  PickingEnd: {
    screen: PickingEnd,
    navigationOptions: ({ navigation }) => ({
      header: null,
      headerBackTitle: null,
    })
  },
}