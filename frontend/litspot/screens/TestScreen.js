import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  DatePickerIOS,
  ScrollView,
  Animated,
  Easing,
} from 'react-native'
import { Constants } from 'expo'
import PropTypes from 'prop-types'
import moment from 'moment'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { validateEmail } from '../common/validators'
import { 
  JWT,
  FNAME,
  FNAME_ERROR_MISSING,
  LNAME,
  LNAME_ERROR_MISSING,
  DOB,
  EMAIL_REQUIRED,
  EMAIL_MALFORMED,
  PASSWORD_REQUIRED,
  DOB_ERROR_MISSING,
  NETWORK_ERROR,
  USER_EMAIL_EXISTS
} from '../common/constants'
import TextInputField from '../common/TextInputField.js'
import colors from '../common/colors'

// Main Component
export default class TestScreen extends React.Component {
    static navigationOptions = {
    header: null
  }

  state = {
    loading: false,
    firstName: '',
    firstNameError: '',
    lastName: '',
    lastNameError: '',
    address: '',
    addressError: '',
    capacity: '',
    capacityError: '',
    description: '',
    descriptionError: '',
    generalError: '',
     
  }

  updateFirstName = (firstName) => {
    let generalError = ''
    this.setState({ firstName, generalError, firstNameError: '' })
  }

  updateLastName = (lastName) => {
    let generalError = ''
    this.setState({ lastName, generalError, lastNameError: '' })
  }

  updateAddress = (address) => {
    let generalError = ''
    this.setState({ address, generalError, addressError: '' })
  }

  updateCapacity = (capacity) => {
    let generalError = ''
    this.setState({ capacity, generalError, capacityErrore: '' })
  }

  updateDescription = (description) => {
    let generalError = ''
    this.setState({ description, generalError, decriptionError: '' })
    
  }

  handleSignUp = async () => {
    let { firstName, lastName, address, capcity, description } = this.state

    email = email.toLowerCase()

    //handle validation
    if (!firstName) {
      return this.setState({firstNameError: FNAME_ERROR_MISSING})
    } else if (!lastName) {
      return this.setState({lastNameError: LNAME_ERROR_MISSING})
    } else if (!address) {
      return this.setState({dateOfBirthError: GENERAL_ERROR})
    } else if (!capcity) {
      return this.setState({emailError: GENERAL_ERROR})
    } else if (!description) {
      return this.setState({passwordError: GENERAL_ERROR})
    }

    this.props.signup(email, password, firstName, lastName, dateOfBirth)
      .then(async (response) => {
        let { data } = response
        await deviceStorage.saveItem(JWT, data.signup.token)
        // update App state with jwt and rerender
        this.props.screenProps.saveJWT(data.signup.token)
      }).catch((error) => {
        if (error && error.graphQLErrors.length >= 1) {
          if (error.graphQLErrors[0].message === USER_EMAIL_EXISTS) {
            let emailError = USER_EMAIL_EXISTS
            return this.setState({emailError})
          } 
        } else if (error && error.networkError) {
          console.log(error)
          let generalError = NETWORK_ERROR
          return this.setState({generalError})
        }
      })
  }

  render() {
    const {

      firstName,
      lastName,
      address,
      capacity,
      description,
      
    } = this.state



  

    return (
      <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
        <View>
          <ScrollView keyboardShouldPersistTaps="always">
            {/* <TouchableOpacity onPress={() => {goBack()}}>
              icon={<EvilIcons name="close" size={30} color="black" />}
            </TouchableOpacity> */}
            <Text style={styles.loginHeader}> SafeHaven  </Text>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'}}>
            </View>

            <TextInputField 
              innerOnChangeText={(firstName) => this.updateFirstName(firstName)}
              innerValue={firstName}
              innerReturnKeyType={"next"}
              
              borderBottomColor={colors.black}
              inputError={this.state.firstNameError || this.state.generalError}
              placeholderText="First name"
              inputIcon={"ios-person-outline"}
            />

            <TextInputField
              
              innerOnChangeText={(lastName) => this.updateLastName(lastName)} 
              innerValue={lastName}
              innerReturnKeyType={"next"}
              
              borderBottomColor={colors.black}
              inputError={this.state.lastNameError || this.state.generalError }
              placeholderText="Last name"
              inputIcon={"ios-person-outline"}
            />

            <TextInputField
              
              innerOnChangeText={(address) => this.updateAddress(address)} 
              innerValue={address}
              innerReturnKeyType={"next"}
              
              borderBottomColor={colors.black}
              inputError={this.state.generalError }
              placeholderText="Address"
              inputIcon={"address"}
            />
            
            
            
            <TextInputField
              
              innerOnChangeText={(capacity) => this.updateCapacity(capacity)} 
              innerValue={capacity}
              innerReturnKeyType={"next"}
              
              borderBottomColor={colors.black}
              inputError={this.state.generalError }
              placeholderText="Capacity"
              inputIcon={"ios-people"}
            />
            

            <TextInputField
              
              innerOnChangeText={(description) => this.updateDescription(description)} 
              innerValue={description}
              innerReturnKeyType={"next"}
              
              borderBottomColor={colors.black}
              inputError={this.state.decription || this.state.generalError }
              placeholderText="Description"
              inputIcon={"text"}
              multiline={true}
              numberOfLines = {4} 
            />
        
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
  }
}


const styles = StyleSheet.create({
  wrapper:{
    display:'flex',
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  loginHeader: {
    textAlign:'center',
    fontSize: 28,
    fontWeight:'500',
    marginBottom: 50
  },

  datePicker: {
    position: 'relative',
    overflow: 'hidden',
    top: -20
  },
  smallText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize:10,
    color: '#666666',
  } 
})