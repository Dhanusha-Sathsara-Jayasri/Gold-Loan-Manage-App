import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {

  const navigation = useNavigation();

  // Create a reference to the animated value
  const translateY = useRef(new Animated.Value(0)).current;

  // Run the animation when the component mounts
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [translateY]);

  return (
    <View style={styles.container}>

      <View style={{width: '100%', height: '90%'}}>
        <Image
          source={require('./img/log-in-screen-img-2.jpg')}
          style={styles.backgroundImage2}
        />
        <Image
          source={require('./img/log-in-screen-img.jpg')}
          style={styles.backgroundImage}
        />
      </View>

      <Animated.View
        style={[styles.loginContainer1, {transform: [{translateY}]}]}>
        <View>
          <Text style={styles.title}>Gold Loan </Text>
          <Text style={styles.title2}>Management System</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Main Screen')}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.buttonText}> Get Start </Text>
              <Icon name="arrow-forward" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'static',
    backgroundColor: '#e0e0e0',
  },
  backgroundImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: 'absolute',
    zIndex: 1,
  },
  backgroundImage2: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
  },
  loginContainer1: {
    position: 'absolute',
    bottom: 0,
    width: '85%',
    height: '35%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginLeft: 30,
    marginBottom: 100,
    zIndex: 2,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: '8%',
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: '18%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  additionalImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default HomeScreen;
