import React from 'react';
import { Text, View } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';

class Header extends React.Component {
  render() {
    const { textStyle, viewStyle } = styles;
    return (
      <View style={viewStyle}>
        <Ionicons
          style={{ paddingLeft: 10 }}
          name="ios-arrow-back"
          size={30}
          color="#1b3039"
          onPress={() => this.props.navigation.navigate('home')}
        />
        <Text style={{ paddingLeft: 120, fontSize: 20 }}>Help Info</Text>
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    backgroundColor: '#aabedd',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 90,
    paddingTop: 30,
    shadowColor: '#181f28',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: 20
  }
};
export default withNavigation(Header);
