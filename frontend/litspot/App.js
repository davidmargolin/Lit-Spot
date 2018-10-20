import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import HelpScreen from './screens/HelpScreen';
import { createBottomTabNavigator } from 'react-navigation';

const MainNavigator = createBottomTabNavigator(
  {
    home: { screen: HomeScreen },
    help: { screen: HelpScreen }
  },
  {
    navigationOptions: {
      tabBarVisible: false
    }
  }
);

export default class App extends React.Component {
  render() {
    return <MainNavigator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
