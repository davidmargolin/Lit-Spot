import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView } from 'expo';
import mapTheme from '../common/maptheme.js';
//import { Button, Icon } from 'react-native-elements';
import Button from '../common/Button.js';

import { FontAwesome } from '@expo/vector-icons';
export default class HomeScreen extends React.Component {
  state = {
    mapLoaded: false,
    region: {
      longitude: -73.976441,
      latitude: 40.723354,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09
    }
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={this.state.region}
          style={{ flex: 1 }}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapTheme}
        >
          <MapView.Marker
            coordinate={{
              longitude: -73.976441,
              latitude: 40.723354
            }}
          />
        </MapView>
        <View style={styles.buttonContainer}>
          <Button icon={'home'}>SafeHaven</Button>
          <Button
            icon={'phone-square'}
            onPress={() => this.props.navigation.navigate('help')}
          >
            GetHelp
          </Button>
        </View>
      </View>
    );
  }
}
const styles = {
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
};
