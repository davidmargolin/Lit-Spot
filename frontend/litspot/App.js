import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import HomeScreen from './screens/HomeScreen';
import HelpScreen from './screens/HelpScreen';
import TestScreen from './screens/TestScreen';
import { createBottomTabNavigator } from 'react-navigation';

const MainNavigator = createBottomTabNavigator(
  {
    home: { screen: HomeScreen },
    help: { screen: TestScreen }
  },
  {
    navigationOptions: {
      tabBarVisible: false
    }
  }
);

export default class App extends React.Component {
  componentWillMount() {
    var config = {
      apiKey: 'AIzaSyCiWt8-c3xOqWm_psv2rEeQTJQj4XyGnIs',
      authDomain: 'litspot-cd4d5.firebaseapp.com',
      databaseURL: 'https://litspot-cd4d5.firebaseio.com',
      projectId: 'litspot-cd4d5',
      storageBucket: 'litspot-cd4d5.appspot.com',
      messagingSenderId: '1022551548038'
    };
    firebase.initializeApp(config);
  }
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
