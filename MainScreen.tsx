import React, {useState} from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {StyleSheet, Text, View, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {NativeSyntheticEvent} from 'react-native';
import {TextInputChangeEventData} from 'react-native';

import axios from 'axios';

function MainScreen() {
  const navigation = useNavigation();
  const [activeForm, setActiveForm] = useState('Customer Registration');
  const [marketPrice, setMarketPrice] = useState('');
  const [marketPriceField, setMarketPriceField] = useState('');
  const [loanApprovalValue, setLoanApprovalValue] = useState('');
  const [LoanApprovalValueField, setLoanApprovalValueField] = useState('');

  //Date Picker code start
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');

  const handleConfirm = (selectedDate: Date) => {
    setOpen(false);
    setDate(selectedDate);
    setFormattedDate(selectedDate.toLocaleDateString('en-CA')); // Format the date as YYYY-MM-DD
  };

  const [name, setName] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [whatsAppVerify, setWhatsAppVerify] = useState(false);
  const [NIC, setNIC] = useState('');

  function handleName(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
  }
  function handleWhatsApp(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const whatsAppVar = e.nativeEvent.text;
    setWhatsApp(whatsAppVar);
    setWhatsApp(whatsAppVar);

    if (whatsAppVar.length == 10) {
      setWhatsAppVerify(true);
    } else {
      setWhatsAppVerify(false);
    }
  }

  function handleNIC(e: NativeSyntheticEvent<TextInputChangeEventData>) {
    const nicVar = e.nativeEvent.text;
    setNIC(nicVar);
  }

  function formatNumberWithCommas(value: string): string {
    // Remove any non-digit characters (except for the decimal point)
    const cleanedValue = value.replace(/[^0-9.]/g, '');

    // Split the value on the decimal point
    const parts = cleanedValue.split('.');

    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Join the integer and decimal parts (if any)
    return parts.join('.');
  }

  function handleSubmit() {
    const CustomerData = {
      name: name,
      whatsApp: whatsApp,
      NIC: NIC,
    };

    if (CustomerData.name == '') {
      Alert.alert('Information', 'Please Enter Full Name');
    } else if (CustomerData.whatsApp == '') {
      Alert.alert('Information', 'Please Enter WhatsApp Number');
    } else if (CustomerData.NIC == '') {
      Alert.alert('Information', 'Please Enter NIC Number');
    } else {
      axios
        .post('https://gold-management.netlify.app/api/register', CustomerData)
        .then(res => navigation.navigate('Items Adding Page'))
        .catch(e =>
          Alert.alert('Warning', 'Someting went wrong in registration'),
        );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Image
        style={styles.backgroundImage}
        source={require('./img/Customer-Main-Screen-img.jpg')}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container2}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                activeForm === 'Customer Registration' && styles.activeButton,
              ]}
              onPress={() => setActiveForm('Customer Registration')}>
              <Text style={styles.headerButtonText}>Customer</Text>
              <Text style={styles.headerButtonText}>Registration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                activeForm === 'Project Management' && styles.activeButton,
              ]}
              onPress={() => setActiveForm('Project Management')}>
              <Text style={styles.headerButtonText}>Project</Text>
              <Text style={styles.headerButtonText}>Managemer Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hr} />

          <View style={styles.formContainer}>
            {activeForm === 'Customer Registration' && (
              <>
                <Text style={styles.title}>Customer Registration</Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#aaa"
                    onChange={e => handleName(e)}
                  />

                  {whatsApp.length < 1 ? null : whatsAppVerify ? (
                    <Text style={{color: 'green'}}>Verifyed</Text>
                  ) : (
                    <Text style={{color: 'red'}}>
                      WhatsApp number Should be 10 characters
                    </Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Whatsapp Number"
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                    onChange={e => handleWhatsApp(e)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="NIC Number"
                    placeholderTextColor="#aaa"
                    onChange={e => handleNIC(e)}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Items Adding Page')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.buttonText}>Registration</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.buttonText}>Registration</Text>
                    </View>
                  </TouchableOpacity> */}
                </View>
              </>
            )}

            {activeForm === 'Project Management' && (
              <>
                <Text style={styles.title}>Project Managemer Login</Text>
                <Text style={styles.title2}>(Market Value Update)</Text>
                <View style={{marginTop: 20}}>
                  <TextInput
                    style={styles.input2}
                    value={formattedDate}
                    placeholder="Select Current Day"
                    placeholderTextColor={'#adadad'}
                    onFocus={() => setOpen(true)}
                    onChangeText={text => setFormattedDate(text)}
                  />
                  <DatePicker
                    modal
                    open={open}
                    date={date}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={() => setOpen(false)}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Today Market Price"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={marketPriceField}
                    onChangeText={text => {
                      const formattedText = formatNumberWithCommas(text);
                      setMarketPriceField(formattedText);
                      setMarketPrice(text);
                    }}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Loan Approval Value"
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                    value={LoanApprovalValueField}
                    onChangeText={text => {
                      const formattedText = formatNumberWithCommas(text);
                      setLoanApprovalValueField(formattedText);
                      setLoanApprovalValue(text);
                    }}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('Project Manager Page', {
                        marketPrice: marketPrice,
                        loanApprovalValue: loanApprovalValue,
                        currentDate: formattedDate,
                      })
                    }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.buttonText}>Submit</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button2}
                    onPress={() =>
                      navigation.navigate('Previouly Updated Data Page')
                    }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.buttonText}>View Stored Values</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container2: {
    marginTop: 90,
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginLeft: '7.5%',
    marginBottom: 150,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  title2: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    color: '#adadad',
    marginTop: 10,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  button2: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#545350',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#e4c37c',
  },
  headerButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  hr: {
    height: 1,
    backgroundColor: 'black',
    marginTop: 10,
  },
  formContainer: {},
  input2: {
    color: '#adadad',
    gap: 0,
    marginTop: 10,
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
});

export default MainScreen;
