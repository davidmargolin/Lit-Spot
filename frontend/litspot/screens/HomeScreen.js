import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Constants, Location, MapView, Notifications, Permissions } from 'expo';
import firebase from 'firebase';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SnackBar from 'react-native-snackbar-component';
import mapTheme from '../common/maptheme.js';

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

      this._getLocationAsync();
  }

  _getLocationAsync = async () => {

    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)
    firebase.database().ref('users').once('value').then((snapshot) =>{
      let users = snapshot.val()
      console.log(users)
      users=users.filter(item => item.deviceid !== token)
      users.push({
        deviceid: token,
        longitude: -73.976441,
        latitude: 40.723354
      })
      firebase.database().ref('users').set(users)
    })
  
  };

  handleSignUp = () => { };

  reportFire = () => {
    console.log(      'http://104.248.13.6/api/verify?latitude=' +
    this.state.coords.latitude +
    '&longitude=' +
    this.state.coords.longitude)
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
    if (frp > 5) {
      return '#f4414135';
    } else if (2 < frp && frp <= 5) {
      return '#f4854135';
    } else {
      return '#f4d04135';
    }
  };

  checkCoords = (newlat, newlon) => {
    this.region = {
      longitude: newlon,
      latitude: newlat,
      longitudeDelta: 0.5,
      latitudeDelta: 0.5
    };
    Number.prototype.toRad = function () {
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
              width: 300,
              right: 0,
              flex: 1,
              alignItems: 'center',

              marginVertical: Constants.statusBarHeight
            }}
          >
            <View
              style={{
                width: 300,
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
            >
              <View style={{
                borderRadius: 20, padding: 12, borderRadius: 15,
                borderWidth: 1, margin: 15, width: 300,
                backgroundColor: '#2c2e33'
              }}>
                {this.state.item.acq_datetime === 'notreal' ? (
                  <Text style={{ fontSize: 16, color: 'white' }}>
                    No Data Found
                </Text>
                ) : (
                    <View>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Longitude: {this.state.coords.longitude}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Latitude: {this.state.coords.latitude}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        FRP: {this.state.item.frp}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Brightness: {this.state.item.bright_ti5}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Track: {this.state.item.scan}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Scan: {this.state.item.track}
                      </Text>
                      <Text style={{ fontSize: 16, color: 'white' }}>
                        Date Scanned:{' '}
                        {this.state.item.acq_datetime.slice(0, 4) +
                          '-' +
                          this.state.item.acq_datetime.slice(4, 6) +
                          '-' +
                          this.state.item.acq_datetime.slice(6, 8)}
                      </Text>
                      <Text style={{ paddingBottom: 4, fontSize: 16, color: 'white' }}>
                        Time Scanned:{' '}
                        {this.state.item.acq_datetime.slice(-4, -2) +
                          ':' +
                          this.state.item.acq_datetime.slice(-2)}
                      </Text>
                    </View>
                  )}
              </View>
              <TouchableOpacity
                onPress={this.reportFire}
                style={{
                  borderRadius: 15,
                  borderWidth: 1,
                  flexDirection: 'row',
                  backgroundColor: '#2c2e33',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  marginRight: 15
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
            <Entypo name={'phone'} size={32} color="#f44141" />
          </TouchableOpacity>
        </View>

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
