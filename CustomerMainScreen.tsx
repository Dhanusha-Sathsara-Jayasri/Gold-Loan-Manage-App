import React from 'react';
import { ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function CustomerMainScreen() {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <Image
        style={styles.backgroundImage}
        source={require('./img/Customer-Main-Screen-img.jpg')} />
        
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container2}>
          <Text style={styles.title}>Customer Registration</Text>
          <View style={{ marginTop: 20 }}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="Whatsapp Number"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              placeholder="NIC Number"
              placeholderTextColor="#aaa"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('LoanApplicationsScreen')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.buttonText}>Registration</Text>
              </View>
            </TouchableOpacity>
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
  input: {
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
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
    marginBottom:20,
  },
});

export default CustomerMainScreen;
