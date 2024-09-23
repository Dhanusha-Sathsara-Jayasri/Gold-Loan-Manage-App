import React, {useState} from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import {StyleSheet, Text, View, Image} from 'react-native';

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';

function LoanApplicationsScreen({}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isSwiped, setIsSwiped] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const numOfPages = 4;

  interface NativeEvent {
    translationX: number;
  }

  const onSwipe = ({nativeEvent}: {nativeEvent: NativeEvent}) => {
    if (isSwiped) return; // Prevent multiple swipes at the same time

    if (nativeEvent.translationX > 50 && currentPage > 0) {
      // Swipe right
      setCurrentPage(prev => Math.max(prev - 1, 0));
      setIsSwiped(true);
      setTimeout(() => setIsSwiped(false), 300); // Set a small delay to prevent double swipe
    } else if (nativeEvent.translationX < -50 && currentPage < numOfPages - 1) {
      // Swipe left
      setCurrentPage(prev => Math.min(prev + 1, numOfPages - 1));
      setIsSwiped(true);
      setTimeout(() => setIsSwiped(false), 300); // Set a small delay to prevent double swipe
    }
  };

  //Date Picker code start
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');

  const handleConfirm = (selectedDate: Date) => {
    setOpen(false);
    setDate(selectedDate);
    setFormattedDate(selectedDate.toLocaleDateString('en-CA')); // Format the date as YYYY-MM-DD
  };
  //Date Picker code end

  //Date Picker 2 code start
  const [open2, setOpen2] = useState(false);
  const [date2, setDate2] = useState(new Date());
  const [formattedDate2, setFormattedDate2] = useState('');

  const handleConfirm2 = (selectedDate2: Date) => {
    setOpen2(false);
    setDate2(selectedDate2);
    setFormattedDate2(selectedDate2.toLocaleDateString('en-CA')); // Format the date as YYYY-MM-DD
  };
  //Date Picker 2 code end

  const renderDots = () => {
    return [...Array(numOfPages)].map((_, i) => {
      const opacity = currentPage === i ? 1 : 0.3;
      const size = currentPage === i ? 12 : 8;
      return (
        <TouchableOpacity key={i} onPress={() => setCurrentPage(i)}>
          <Animated.View
            style={[styles.dot, {opacity, width: size, height: size}]}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Image
          style={styles.backgroundImage}
          source={require('./img/Customer-Main-Screen-img.jpg')}
        />

        <View style={{marginVertical: '6%'}}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled">
            <PanGestureHandler
              onGestureEvent={onSwipe}
              onHandlerStateChange={() => {
                setScrollEnabled(false);
                setTimeout(() => setScrollEnabled(true), 300);
              }}>
              <View>
                {currentPage === 0 && (
                  <View style={styles.container3}>
                    <Text style={styles.title}>Previous Mortgage Details</Text>
                    <View style={{marginTop: 20}}>
                      <TextInput
                        style={styles.input}
                        placeholder="NAME WITH MORTGAGEE'S INITIALS"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="MORTGAGE INSTITUTE OR BANK NAME"
                        placeholderTextColor="#aaa"
                      />

                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        <TextInput
                          style={styles.input2}
                          value={formattedDate}
                          placeholderTextColor={'#adadad'}
                          placeholder="Mtg Start Date"
                          onFocus={() => setOpen(true)}
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
                          style={styles.input2}
                          value={formattedDate2}
                          placeholderTextColor={'#adadad'}
                          placeholder="Mtg Mat Date"
                          onFocus={() => setOpen2(true)}
                        />
                        <DatePicker
                          modal
                          open={open2}
                          date={date2}
                          mode="date"
                          onConfirm={handleConfirm2}
                          onCancel={() => setOpen2(false)}
                        />
                      </View>

                      <TextInput
                        style={styles.input}
                        placeholder="NUMBER OF THE MORTGAGE INSTITUTE"
                        placeholderTextColor="#aaa"
                      />
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 10,
                      }}>
                      <TextInput
                        style={styles.input2}
                        placeholder="BRANCH NAME"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input2}
                        placeholder="INTEREST RATE"
                        placeholderTextColor="#aaa"
                      />
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="APPRAISED PROPERTY VALUE"
                      placeholderTextColor="#aaa"
                    />

                    <View style={styles.dotsContainer}>{renderDots()}</View>
                  </View>
                )}

                {currentPage === 1 && (
                  <View style={styles.container4}>
                    <Text style={styles.title}>
                      Details Related To Mortgage Relief
                    </Text>
                    <View style={{marginTop: 20}}>
                      <TextInput
                        style={styles.input}
                        placeholder="LOAN AMOUNT TAKEN"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="DAILY INTEREST ACCRUED"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="TOTAL DUE ON REDEMPTION"
                        placeholderTextColor="#aaa"
                      />

                      <View style={styles.dotsContainer}>{renderDots()}</View>
                    </View>
                  </View>
                )}

                {currentPage === 2 && (
                  <View style={styles.container4}>
                    <Text style={styles.title}>Applicant's Occupation</Text>
                    <View style={{marginTop: 20}}>
                      <TextInput
                        style={styles.input}
                        placeholder="JOB TITLE"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="JOB NAME"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="AVERAGE MONTHLY INCOME"
                        placeholderTextColor="#aaa"
                      />

                      <View style={styles.dotsContainer}>{renderDots()}</View>
                    </View>
                  </View>
                )}

                {currentPage === 3 && (
                  <View style={styles.container3}>
                    <Text style={styles.title}>
                      Information Of A Family Member
                    </Text>
                    <View style={{marginTop: 20}}>
                      <TextInput
                        style={styles.input}
                        placeholder="RELATIONSHIP TO LOAN APPLICANT"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="FULL NAME"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="ADDRESS"
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="ADDRESS LINE 2 (Optional)"
                        placeholderTextColor="#aaa"
                      />

                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        <TextInput
                          style={styles.input2}
                          placeholder="PHONE NO"
                          placeholderTextColor="#aaa"
                        />
                        <TextInput
                          style={styles.input2}
                          placeholder="WHATSAPP NO"
                          placeholderTextColor="#aaa"
                        />
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                          gap: 10,
                        }}>
                        <TextInput
                          style={styles.input2}
                          placeholder="NIC NUMBER"
                          placeholderTextColor="#aaa"
                        />
                        <TextInput
                          style={styles.input2}
                          placeholder="JOB NAME"
                          placeholderTextColor="#aaa"
                        />
                      </View>

                      <TouchableOpacity style={styles.button}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text style={styles.buttonText}>Sumbit</Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.dotsContainer}>{renderDots()}</View>
                    </View>
                  </View>
                )}
              </View>
            </PanGestureHandler>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
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
    marginTop: 45,
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
  container3: {
    marginVertical: '20%',
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginLeft: '7.5%',
  },
  container4: {
    marginVertical: '50%',
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginLeft: '7.5%',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  title2: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: '#adadad',
  },
  input2: {
    color: '#adadad',
    gap: 0,
    marginTop: 10,
    height: 40,
    width: '48%',
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
    marginBottom: 10,
  },
  dotsContainer: {
    gap: 10,
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    backgroundColor: '#000',
    borderRadius: 6,
    margin: 4,
  },
});

export default LoanApplicationsScreen;
