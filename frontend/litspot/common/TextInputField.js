import React, { Component } from 'react';
import propTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default (TextInputField = ({
  inputIcon,
  placeholderText,
  innerOnChangeText
}) => {
  return (
    <View style={styles.wrapper}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {inputIcon &&
          inputIcon === 'email-outline' && (
            <MaterialCommunityIcons
              name="email-outline"
              size={28}
              color="gray"
            />
          )}
        {inputIcon &&
          inputIcon === 'address' && (
            <Entypo name="address" size={28} color="gray" />
          )}
        {inputIcon &&
          inputIcon === 'ios-person-outline' && (
            <Ionicons name="ios-person-outline" size={28} color="gray" />
          )}
        {inputIcon &&
          inputIcon === 'ios-people' && (
            <Ionicons name="ios-people" size={28} color="gray" />
          )}
        {inputIcon &&
          inputIcon === 'text' && <Entypo name="text" size={28} color="gray" />}

        <TextInput
          onChangeText={innerOnChangeText}
          style={styles.inputField}
          placeholder={placeholderText}
          multiline={placeholderText == 'Description' ? true : false}
          lines={placeholderText == 'Description' ? 4 : 1}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50
  },
  inputField: {
    flex: 1,
    flexGrow: 1,
    margin: 8,
    borderBottomWidth: 0.8,
    fontSize: 20
  },
  showButtonText: {
    color: 'gray',
    fontWeight: '500'
  },
  inputError: {
    position: 'absolute',
    top: 18,
    left: 60,
    fontSize: 12,
    color: 'red'
  }
});
