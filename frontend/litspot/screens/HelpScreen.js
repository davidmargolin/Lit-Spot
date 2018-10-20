import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class HelpScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>HelpScreen</Text>
        <Text>HelpScreen</Text>
        <Text>HelpScreen</Text>
        <Text onPress={() => this.props.navigation.navigate('home')}>
          Go bback to home
        </Text>
      </View>
    );
  }
}
