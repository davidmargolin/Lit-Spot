import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { MapView } from 'expo';
import firebase from 'firebase';
import mapTheme from '../common/maptheme.js';
//import { Button, Icon } from 'react-native-elements';
import Button from '../common/Button.js';

import { FontAwesome } from '@expo/vector-icons';
export default class HomeScreen extends React.Component {
  state = {
    modalVisible: false,
    data: [],
    mapLoaded: false,
    region: {
      longitude: -73.976441,
      latitude: 40.723354,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09
    }
  };
  componentDidMount() {
    let ref = firebase.database().ref('safehavens');
    ref.on('value', snapshot => {
      let result = snapshot.val();
      this.setState({ data: result });
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          region={this.state.region}
          style={{ flex: 1 }}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapTheme}
        >
          {this.state.data.map((item, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                longitude: item.longitude,
                latitude: item.latitude
              }}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button
            icon={'home'}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            SafeHaven
          </Button>

          <Button
            icon={'phone-square'}
            onPress={() => this.props.navigation.navigate('help')}
          >
            GetHelp
          </Button>
        </View>

        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.modalVisible}
        />
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
