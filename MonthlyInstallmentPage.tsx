import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

interface Multipliers {
  [key: number]: number;
}

const multipliers: Multipliers = {
  6: 0.5,
  12: 1.0,
  18: 1.5,
  24: 2.0,
  36: 3.0,
  48: 4.0,
  60: 5.0,
};

function MonthlyInstallmentPage() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [requestedValue, setRequestedValue] = useState('');
  const [interest, setInterest] = useState(30);
  const [paymentDetails, setPaymentDetails] = useState<
    {months: string; totalPayment: string; monthlyPayment: string}[]
  >([]);

  const [selectedMonthlyPayment, setSelectedMonthlyPayment] = useState<
    string | undefined
  >(undefined);
  const [selectedMonths, setSelectedMonths] = useState<string | undefined>(
    undefined,
  );

  // State to keep the last valid input and its calculation
  const [lastValidMonthlyPayment, setLastValidMonthlyPayment] =
    useState<string>('0.00');
  const [lastValidRequestedValue, setLastValidRequestedValue] =
    useState<string>('');

  const navigation = useNavigation();
  const route = useRoute();
  const {totalMaxLoanValue} = route.params;

  useEffect(() => {
    calculateMonthlyPayment(''); // Initialize with empty input
  }, []);

  useEffect(() => {
    // Update the selected row details whenever requestedValue or selectedMonth changes
    if (selectedMonth !== null) {
      const selectedPaymentDetail = paymentDetails.find(
        detail => Number(detail.months) === selectedMonth,
      );
      if (selectedPaymentDetail) {
        setSelectedMonthlyPayment(selectedPaymentDetail.monthlyPayment);
        setSelectedMonths(selectedPaymentDetail.months);
      }
    }
  }, [requestedValue, selectedMonth, paymentDetails]);

  const handleSelect = (month: number, payment: string) => {
    setSelectedMonth(month);
    storeValue(month.toString(), payment);
  };

  function calculateMonthlyPayment(value: string) {
    setRequestedValue(value);

    const requestedAmount = parseFloat(value.replace(/,/g, '')); // Remove commas for calculation
    const isValidAmount = !isNaN(requestedAmount) && requestedAmount > 0;

    const calculatedPayments = Object.keys(multipliers).map(months => {
      const monthsNumber = Number(months);
      const baseMultiplier = multipliers[monthsNumber];

      const interestAmount =
        requestedAmount * baseMultiplier * (interest / 100);
      const totalPayment = isValidAmount ? requestedAmount + interestAmount : 0;
      const monthlyPayment = isValidAmount ? totalPayment / monthsNumber : 0;

      return {
        months,
        totalPayment: totalPayment.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
      };
    });

    setPaymentDetails(calculatedPayments);

    // Update last valid monthly payment if the amount is valid
    if (isValidAmount) {
      const selectedPaymentDetail = calculatedPayments.find(
        detail => Number(detail.months) === selectedMonth,
      );
      if (selectedPaymentDetail) {
        setLastValidMonthlyPayment(selectedPaymentDetail.monthlyPayment);
        setLastValidRequestedValue(value);
      }
    } else if (value === '') {
      setLastValidMonthlyPayment('0.00'); // Reset to zero when the input is cleared
    }
  }

  function storeValue(months: string, monthlyPayment: string) {
    setSelectedMonthlyPayment(monthlyPayment);
    setSelectedMonths(months);
  }

  const formatNumberWithCommas = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleInputChange = (text: string) => {
    const formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    calculateMonthlyPayment(formattedText);

    // If input is cleared, maintain the last valid payment in the display
    if (formattedText === '') {
      setSelectedMonthlyPayment(undefined);
    }
  };

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
          <Text style={styles.title}>Monthly Installment Values</Text>

          <View style={{marginTop: 20}}>
            <Text style={styles.title3}>
              Total Max Loan Value        : Rs.{' '}
              {Number(totalMaxLoanValue).toLocaleString()}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{paddingBottom: '3%'}}>
                <Text style={{color: 'black', fontSize: 14}}>
                  Requested Loan Amount : Rs.{' '}
                </Text>
              </View>

              <TextInput
                value={formatNumberWithCommas(requestedValue)}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.tableContainer}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cell1, styles.headerCell]}>Tenor</Text>
                <Text style={[styles.cell, styles.headerCell]}>
                  Monthly Installment (Rs.)
                </Text>
              </View>

              {paymentDetails.map(detail => (
                <View
                  style={[
                    styles.row,
                    selectedMonth === Number(detail.months) && {
                      backgroundColor: '#ddfcd4',
                    },
                  ]}
                  key={detail.months}>
                  <TouchableOpacity
                    style={styles.cell2}
                    onPress={() =>
                      handleSelect(Number(detail.months), detail.monthlyPayment)
                    }>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Text style={styles.monthFontWeight}>{detail.months}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cell2}
                    onPress={() =>
                      handleSelect(Number(detail.months), detail.monthlyPayment)
                    }>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <Text style={{color: 'black'}}>
                        {formatNumberWithCommas(detail.monthlyPayment)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}

              <Text
                style={{
                  color: 'black',
                  marginTop: 20,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                Requested Loan Amount :{' '}
                {Number(requestedValue).toLocaleString()}
              </Text>
              <Text
                style={{
                  color: 'black',
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                Tenor : {selectedMonths || ' Select amount from the table'}
              </Text>
              <Text
                style={{
                  color: 'black',
                  marginTop: 5,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}>
                Monthly Installment : Rs.{' '}
                {Number(
                  selectedMonthlyPayment ?? lastValidMonthlyPayment,
                ).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{paddingBottom: '3%'}}>
                <Text style={{color: 'black', fontSize: 15}}>
                  Approval of the customer :
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Loan Applications Screen')}>
                <Text style={styles.buttonText}>Approved</Text>
              </TouchableOpacity>
            </View>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container2: {
    marginTop: 15,
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginLeft: '7.5%',
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    paddingRight:4,
    paddingLeft:4
  },
  title3: {
    fontSize: 14,
    color: '#000',
    marginLeft:'4%',
    marginBottom:8,
  },
  input: {
    width: '33.5%',
    height: 38,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: '#adadad',
  },
  tableContainer: {
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
    height: '12.5%',
  },
  cell: {
    flex: 1,
    borderLeftWidth: 2,
    borderColor: '#d9d9d9',
    padding: 10,
    justifyContent: 'center',
  },
  cell2: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    padding: 10,
    justifyContent: 'center',
  },
  cell1: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginLeft: '6.5%',
    justifyContent: 'center',
  },
  headerCell: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  monthFontWeight:{
    fontWeight: 'bold',
    color: 'black',
  }
});

export default MonthlyInstallmentPage;
