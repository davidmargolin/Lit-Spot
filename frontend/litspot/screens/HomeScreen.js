import React from 'react';
import { MapView } from 'expo';
import firebase from 'firebase';
import mapTheme from '../common/maptheme.js';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView,
  Animated,
  Easing,
  Modal
} from 'react-native';
import { Constants } from 'expo';
import PropTypes from 'prop-types';
import {
  MaterialCommunityIcons,
  EvilIcons,
  Ionicons,
  Entypo,
  FontAwesome
} from '@expo/vector-icons';
import TextInputField from '../common/TextInputField.js';
import SnackBar from 'react-native-snackbar-component';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.firstName = '';
    this.lastName = '';
    this.address = '';
    this.capacity = '';
    this.description = '';
    this.region = {
      longitude: -73.976441,
      latitude: 40.723354,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09
    };
    this.state = {
      item: {
        acq_datetime: 'empty'
      },
      modalVisible: false,
      confirmedFires: [],
      data: [],
      circledata: [],
      mapLoaded: false
    };
  }

  componentDidMount() {
    fetch('http://104.248.13.6/api/fires')
      .then(response => response.json())
      .then(data => this.setState({ circledata: data.data }));

    let ref = firebase.database().ref('safehavens');
    ref.on('value', snapshot => {
      let result = snapshot.val();
      this.setState({ data: result });
    });

    let fireRef = firebase.database().ref('fires');
    fireRef.on('value', snapshot => {
      let result = snapshot.val();
      if (result != null) {
        let resultList = Object.keys(result).map(key => result[key]);
        this.setState({ confirmedFires: resultList });
      }
    });
  }

  handleSignUp = () => {};

  reportFire = () => {
    fetch(
      'http://104.248.13.6/api/verify?latitude=' +
        this.state.coords.latitude +
        '&longitude=' +
        this.state.coords.longitude
    )
      .then(response => response.json())
      .then(lit => {
        if (lit.is_lit) {
          let ref = firebase
            .database()
            .ref('fires')
            .push()
            .set(this.state.coords);
        } else {
          setTimeout(() => {
            this.setState({ snackVisible: false });
          }, 2000);
          this.setState({ snackVisible: true });
        }
      });
  };

  getCircleColor = frp => {
    if (frp > 6) {
      return '#f4414166';
    } else if (2 < frp && frp <= 6) {
      return '#f4854166';
    } else {
      return '#f4d04166';
    }
  };

  checkCoords = (newlat, newlon) => {
    this.region = {
      longitude: newlon,
      latitude: newlat,
      longitudeDelta: 0.5,
      latitudeDelta: 0.5
    };
    Number.prototype.toRad = function() {
      return (this * Math.PI) / 180;
    };

    for (let circle of this.state.circledata) {
      var lat2 = newlat;
      var lon2 = newlon;
      var lat1 = circle.latitude;
      var lon1 = circle.longitude;

      let R = Math.round(parseFloat(circle.track) * 60350.4);
      //has a problem with the .toRad() method below.
      var x1 = lat2 - lat1;
      var dLat = x1.toRad();
      var x2 = lon2 - lon1;
      var dLon = x2.toRad();
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) *
          Math.cos(lat2.toRad()) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;

      if (d <= 100) {
        this.setState({
          item: circle,
          coords: { longitude: newlon, latitude: newlat }
        });
        return;
      }
    }

    this.setState({
      item: { acq_datetime: 'notreal' },
      coords: { longitude: newlon, latitude: newlat }
    });
    return true;
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          onPress={e => {
            this.checkCoords(
              e.nativeEvent.coordinate.latitude,
              e.nativeEvent.coordinate.longitude
            );
            console.log(e.nativeEvent.coordinate);
          }}
          initialRegion={this.region}
          style={{ flex: 1 }}
          provider={MapView.PROVIDER_GOOGLE}
          customMapStyle={mapTheme}
        >
          {/*          {this.state.data.map((item, index) => (
            <MapView.Marker
              key={index}
              coordinate={{
                longitude: item.longitude,
                latitude: item.latitude
              }}
            />
          ))}
        */}
          {this.state.confirmedFires.map((item, index) => (
            <MapView.Marker
              key={index}
              image={require('../images/fire.png')}
              coordinate={{
                longitude: item.longitude,
                latitude: item.latitude
              }}
            />
          ))}

          {this.state.circledata.map((item, index) => (
            <MapView.Circle
              fillColor={this.getCircleColor(item.frp)}
              key={index}
              center={{
                longitude: parseFloat(item.longitude),
                latitude: parseFloat(item.latitude)
              }}
              radius={Math.round(parseFloat(item.track) * 37500)}
            />
          ))}
        </MapView>

        {this.state.item.acq_datetime != 'empty' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',

              flex: 1,
              alignItems: 'center',

              marginVertical: Constants.statusBarHeight
            }}
          >
            <View
              style={{
                flex: 1,
                margin: 20,
                backgroundColor: '#2c2e33',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                borderRadius: 20
              }}
            >
              {this.state.item.acq_datetime === 'notreal' ? (
                <Text style={{ fontSize: 16, color: 'white' }}>
                  No Data Found
                </Text>
              ) : (
                <View>
                  <Text style={{ fontSize: 16, color: 'white' }}>
                    Date Scanned:{' '}
                    {this.state.item.acq_datetime.slice(0, 4) +
                      '-' +
                      this.state.item.acq_datetime.slice(4, 6) +
                      '-' +
                      this.state.item.acq_datetime.slice(6, 8)}
                  </Text>
                  <Text style={{ padding: 4, fontSize: 16, color: 'white' }}>
                    Time Scanned:{' '}
                    {this.state.item.acq_datetime.slice(-4, -2) +
                      ':' +
                      this.state.item.acq_datetime.slice(-2)}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                onPress={this.reportFire}
                style={{
                  borderRadius: 15,
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  margin: 10
                }}
              >
                <Text
                  style={{
                    color: 'orange',
                    padding: 6,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                >
                  Report Fire
                </Text>
                <MaterialCommunityIcons
                  style={{ paddingTop: 5 }}
                  name={'fire'}
                  size={30}
                  color="orange"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
          {/*{' '}
          <TouchableOpacity
            style={{
              backgroundColor: '#2c2e33',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 70,
              width: 70,
              borderRadius: 35,
              margin: 10
            }}
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <FontAwesome name={'home'} size={32} color="#7f8d89" />
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={{
              backgroundColor: '#2c2e33',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: 70,
              width: 70,
              borderRadius: 35,
              margin: 10
            }}
            onPress={() => {
              this.props.navigation.navigate('help');
            }}
          >
            <Entypo name={'phone'} size={32} color="#7f8d89" />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20
              }}
            >
              <ScrollView keyboardShouldPersistTaps="always">
                <Text style={styles.loginHeader}> SafeHaven </Text>

                <TextInputField
                  innerOnChangeText={firstName => (this.firstName = firstName)}
                  placeholderText="First name"
                  inputIcon={'ios-person-outline'}
                />

                <TextInputField
                  innerOnChangeText={lastName => (this.lastName = lastName)}
                  placeholderText="Last name"
                  inputIcon={'ios-person-outline'}
                />

                <TextInputField
                  innerOnChangeText={address => (this.address = address)}
                  placeholderText="Address"
                  inputIcon={'address'}
                />

                <TextInputField
                  innerOnChangeText={capacity => (this.capacity = capacity)}
                  placeholderText="Capacity"
                  inputIcon={'ios-people'}
                />

                <TextInputField
                  innerOnChangeText={description =>
                    (this.description = description)
                  }
                  placeholderText="Description"
                  inputIcon={'text'}
                  multiline={true}
                  numberOfLines={4}
                />
                <TouchableOpacity
                  icon={'home'}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    console.log('firstname:' + this.firstName);
                    console.log('clicked');
                  }}
                >
                  <FontAwesome icon={'home'} />
                  Submit
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <SnackBar
          autoHidingTime={2000}
          visible={this.state.snackVisible}
          textMessage="This fire is unconfirmed"
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
    justifyContent: 'flex-end'
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    margin: 20,
    borderRadius: 20,
    paddingTop: Constants.statusBarHeight
  },
  loginHeader: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
    margin: 20
  },

  smallText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 10,
    color: '#666666'
  }
};
