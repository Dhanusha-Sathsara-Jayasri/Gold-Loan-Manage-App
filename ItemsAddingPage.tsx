import React, {useState, useEffect} from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const ItemsAddingPage = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    {itemName: '', itemsQuantity: '', totalWeight: '', netWeight: ''},
  ]);
  const [storedData, setStoredData] = useState([]);
  const [monetaryValues, setMonetaryValues] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalGrossWeight, setTotalGrossWeight] = useState(0);
  const [totalNetWeight, setTotalNetWeight] = useState(0);
  const [totalPounds, setTotalPounds] = useState(0);
  const [averageCarat, setAverageCarat] = useState(0);
  const [loanApprovalValue, setLoanApprovalValue] = useState(0);

  const parseNumber = value => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const loadStoredData = async () => {
    try {
      const data = await AsyncStorage.getItem('storedValues');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        setStoredData(parsedData);
      } else {
        Alert.alert('Alert', 'No data found. Please enter current ratios.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch stored data. Please try again.');
      console.error('Error fetching stored data:', error);
    }
  };

  useEffect(() => {
    loadStoredData();

    const calculateMonetaryValues = () => {
      let totalQuantityValue = 0;
      let totalGrossWeightValue = 0;
      let totalNetWeightValue = 0;
      let totalPoundsValue = 0;
      let totalMonetaryValue = 0;
      let totalCaratValue = 0;
      let caratCount = 0;
      let totalLoanApprovalValue = 0;

      const calculatedValues = items.map((item, index) => {
        const totalWeightNum = parseNumber(item.totalWeight);
        const netWeightNum = parseNumber(item.netWeight);

        if (totalWeightNum > 0 && netWeightNum > 0) {
          const goldPercentage = (netWeightNum / totalWeightNum) * 100;

          // Determine carat based on gold percentage
          let carat = '';
          if (goldPercentage >= 100) {
            carat = '22';
          } else if (goldPercentage >= 95.45) {
            carat = '21';
          } else if (goldPercentage >= 90.91) {
            carat = '20';
          } else if (goldPercentage >= 86.36) {
            carat = '19';
          } else if (goldPercentage >= 81.82) {
            carat = '18';
          } else if (goldPercentage >= 77.27) {
            carat = '17';
          } else if (goldPercentage >= 72.73) {
            carat = '16';
          } else if (goldPercentage >= 68.18) {
            carat = '15';
          } else if (goldPercentage >= 63.64) {
            carat = '14';
          } else if (goldPercentage >= 59.09) {
            carat = '13';
          } else if (goldPercentage >= 54.55) {
            carat = '12';
          } else {
            carat = ''; // default if no match
          }

          const poundAmount = parseFloat((netWeightNum / 8).toFixed(8)) || 0;

          // Assume the use of carat data to calculate monetary values if needed
          let caratData = storedData.find(data => data.carat === carat);
          let monetaryValue = 0;
          let loanApproved = 0;

          if (caratData) {
            monetaryValue = poundAmount * parseNumber(caratData.marketPrice);
            loanApproved =
              poundAmount * parseNumber(caratData.loanApprovalValue);
          }

          totalQuantityValue +=
            parseInt(item.itemsQuantity.replace(/,/g, '')) || 0;
          totalGrossWeightValue += totalWeightNum;
          totalNetWeightValue += netWeightNum;
          totalMonetaryValue += monetaryValue;
          totalPoundsValue += poundAmount;

          if (carat) {
            totalCaratValue += parseFloat(carat);
            caratCount++;
          }

          totalLoanApprovalValue += loanApproved;

          return {monetaryValue, poundAmount, carat, loanApproved};
        }

        // Return default values if no valid calculation
        return {monetaryValue: 0, poundAmount: 0, carat: '', loanApproved: 0};
      });

      // Update states with calculated values
      setMonetaryValues(calculatedValues);
      setTotalQuantity(totalQuantityValue);
      setTotalGrossWeight(totalGrossWeightValue);
      setTotalNetWeight(totalNetWeightValue);
      setLoanApprovalValue(totalLoanApprovalValue);
      setTotalPounds(Number(parseFloat(totalPoundsValue).toFixed(8)));

      // Calculate average carat if there are valid entries
      setAverageCarat(caratCount > 0 ? totalCaratValue / caratCount : 0);
    };

    calculateMonetaryValues();
  }, [items, storedData]);

  const addItem = () => {
    setItems([
      ...items,
      {itemName: '', itemsQuantity: '', totalWeight: '', netWeight: ''},
    ]);
  };

  const removeItem = index => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleInputChange = (index, value, field) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
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
          <Text style={styles.title}>Item Adding Page</Text>

          {items.map((item, index) => (
            <View key={index} style={styles.container3}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Item {index + 1}</Text>
                {items.length > 1 && (
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Icon name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.itemHeader}>
                <Text style={{color: 'black'}}>Item Name </Text>
                <Text style={{color: 'black'}}>Qty </Text>
              </View>

              <View style={styles.itemHeader}>
                <TextInput
                  style={styles.input3}
                  placeholderTextColor={'#aaa'}
                  value={item.itemName}
                  onChangeText={text =>
                    handleInputChange(index, text, 'itemName')
                  }
                />

                <TextInput
                  style={styles.input4}
                  placeholderTextColor={'#aaa'}
                  value={item.itemsQuantity}
                  onChangeText={text =>
                    handleInputChange(index, text, 'itemsQuantity')
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.itemHeader}>
                <Text style={{color: 'black'}}>Gross Weight </Text>
                <Text style={{color: 'black'}}>Net Weight</Text>
              </View>

              <View style={styles.itemHeader}>
                <TextInput
                  style={styles.input2}
                  placeholderTextColor={'#aaa'}
                  value={item.totalWeight}
                  onChangeText={text =>
                    handleInputChange(index, text, 'totalWeight')
                  }
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input2}
                  placeholderTextColor={'#aaa'}
                  value={item.netWeight}
                  onChangeText={text =>
                    handleInputChange(index, text, 'netWeight')
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.itemHeader}>
                <Text style={{color: 'black'}}>Pounds </Text>
                <Text style={{color: 'black'}}>Carat </Text>
              </View>

              {monetaryValues[index] && (
                <View>
                  <View style={styles.itemHeader}>
                    <TextInput
                      style={[styles.input2,styles.inputBackground]}
                      placeholderTextColor={'#aaa'}
                      value={
                        monetaryValues[index].poundAmount
                          ? monetaryValues[index].poundAmount % 1 !== 0
                            ? monetaryValues[index].poundAmount.toFixed(8) 
                            : monetaryValues[index].poundAmount.toString() 
                          : '0'
                      }
                      editable={false}
                    />

                    <TextInput
                      style={[styles.input2,styles.inputBackground]}
                      placeholderTextColor={'#aaa'}
                      value={monetaryValues[index].carat}
                      editable={false}
                    />
                  </View>

                  <Text style={{color: 'black', margin: 5}}>
                    Today Market Price
                  </Text>
                  <TextInput
                    style={[styles.input,styles.inputBackground]}
                    placeholderTextColor={'#aaa'}

                    value={
                      'Rs. ' +
                      (monetaryValues[index].monetaryValue
                        ? Number(
                            monetaryValues[index].monetaryValue.toFixed(2),
                          ).toLocaleString()
                        : '0.00')
                    }
                    editable={false}
                  />

                  <Text style={{color: 'black', margin: 5}}>
                    Max Loan Value
                  </Text>
                  <TextInput
                    style={[styles.input,styles.inputBackground]}
                    placeholderTextColor={'#aaa'}
                    value={
                      'Rs. ' +(monetaryValues[index].loanApproved? Number(monetaryValues[index].loanApproved.toFixed(2),).toLocaleString(): '0.00')
                    }
                    editable={false}
                  />
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={addItem}>
            <Text style={styles.buttonText}>Add Item</Text>
          </TouchableOpacity>

          <View style={styles.summaryContainer}>
            <Text style={styles.text}>Total Quantity : {totalQuantity}</Text>
            <Text style={styles.text}>
              Total Gross Weight : {totalGrossWeight.toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Total Net Weight : {totalNetWeight.toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Total Pounds : {parseFloat(totalPounds).toFixed(8)}
            </Text>
            <Text style={styles.text}>
              Average Carat : {averageCarat.toFixed(0)}
            </Text>
            <Text style={styles.text}>
              Total Max Loan Value : Rs. {' '}
              {Number(loanApprovalValue.toFixed(2)).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Monthly Installment Page', {
                totalMaxLoanValue: loanApprovalValue.toFixed(2),
              })
            }>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container3: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  removeButton: {
    fontSize: 16,
    color: 'red',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color: 'black',
    backgroundColor: '#f9f9f9',
  },
  summaryContainer: {
    marginTop: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  button1: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 35,
  },
  text: {
    fontSize: 15,
    color: '#000',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#545350',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input2: {
    marginTop: 4,
    height: 40,
    width: '40%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  input3: {
    marginTop: 4,
    height: 40,
    width: '70%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  input4: {
    marginTop: 4,
    height: 40,
    width: '25%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  inputBackground: {
    backgroundColor: '#eeeeee',
  }
});

export default ItemsAddingPage;
