import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import Header from '../common/Header';

export default class HelpScreen extends React.Component {
  render() {
    return (
      <View>
        <Header />
        <ScrollView>
          <View style={styles.cardStyle}>
            <TouchableHighlight
              onPress={() => Linking.openURL('tel:911')}
            >
              <View style={styles.sectionStyle}>
                <View style={styles.thumbnailContainerStyle}>
                  <Text
                    style={{ fontSize: 17 }}
                  >
                    Emergency 911:
                  </Text>
                </View>
                <View style={{ paddingLeft: 168 }}>
                  <Feather
                    style={{ paddingTop: 5 }}
                    name="phone-call"
                    size={30}
                    color="#70aa31"
                  />
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.cardStyle}>
            <TouchableHighlight
              onPress={() => Linking.openURL('tel:311')}
            >
              <View style={styles.sectionStyle}>
                <View style={styles.thumbnailContainerStyle}>
                  <Text
                    style={{ fontSize: 17 }}
                  >
                    Non-Emergency 311:
                  </Text>
                </View>
                <View style={{ paddingLeft: 130 }}>
                  <Feather
                    style={{ paddingTop: 5 }}
                    name="phone-call"
                    size={30}
                    color="#70aa31"
                  />
                </View>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.cardStyle}>
            <View style={styles.sectionStyle1}>
              <Text style={{ fontSize: 19, paddingHorizontal: 10, paddingTop: 10 }}>
                When to evacuate:
              </Text>
            </View>
            <View style={styles.sectionStyle1}>
              <Text style={{ fontSize: 15, padding: 10 }}>
                Leave as soon as evacuation is recommended by fire officials to
                avoid being caught in fire, smoke or road congestion. Don’t wait
                to be ordered by authorities to leave.
              </Text>
            </View>
          </View>

          <View style={styles.cardStyle}>
            <View style={styles.sectionStyle1}>
              <Text style={{ fontSize: 19, paddingHorizontal: 10, paddingTop: 10 }}>
                Where to find shelters:
              </Text>
            </View>
            <View style={styles.sectionStyle1}>
              <Text style={{ fontSize: 15, padding: 10 }}>
                Litspot has a list of available shelters
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  },
  sectionStyle: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },

  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1
  },
  sectionStyle1: {
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative'
  }
};
