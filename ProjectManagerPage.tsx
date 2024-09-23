import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface RouteParams {
  marketPrice: string;
  loanApprovalValue: string;
  currentDate: string;
}

interface StoredData {
  date: string;
  carats: any[];
}

const ProjectManagerPage = ({route}: {route: {params: RouteParams}}) => {
  const {marketPrice, loanApprovalValue, currentDate} = route.params;

  const [caratValues, setCaratValues] = useState({});

  useEffect(() => {
    calculateCaratValues(marketPrice, loanApprovalValue);
    generateAndStoreData();
  }, [marketPrice, loanApprovalValue]);

  useEffect(() => {
    if (Object.keys(caratValues).length > 0) {
      handleSubmit();
      setStoredData();
    }
  }, [caratValues]);

  const calculateCaratValues = (marketPrice: string, loanValue: string) => {
    // Remove commas from the inputs and convert them to numbers
    const cleanedMarketPrice = parseFloat(marketPrice.replace(/,/g, ''));
    const cleanedLoanValue = parseFloat(loanValue.replace(/,/g, ''));

    const caratValue = cleanedMarketPrice / 22;
    const loanPerCarat = cleanedLoanValue / 22;

    const updatedCaratValues: Record<
      number,
      {marketPrice: string; loanApprovalValue: string; goldPercentage: string}
    > = {};

    for (let carat = 12; carat <= 24; carat++) {
      if (carat !== 23) {
        // Skip carat 23
        const marketValue = (caratValue * carat).toFixed(2);
        const loanApproved = (
          Math.round((loanPerCarat * carat) / 1000) * 1000
        ).toFixed(2); // Round to the nearest thousand and keep two decimal places

        // Calculate the gold percentage using the cleaned numeric value
        const goldPercentage = (
          (parseFloat(marketValue) / cleanedMarketPrice) *
          100
        ).toFixed(2);

        // Format the values with commas before storing
        updatedCaratValues[carat] = {
          marketPrice: formatNumberWithCommas(marketValue),
          loanApprovalValue: formatNumberWithCommas(loanApproved),
          goldPercentage: `${goldPercentage}%`, // Format as a percentage string
        };
      }
    }

    setCaratValues(updatedCaratValues);
  };

  // Function to format numbers with commas
  function formatNumberWithCommas(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  type CaratValue = {
    marketPrice: string;
    loanApprovalValue: string;
    goldPercentage: string;
  };

  const handleSubmit = () => {
    const storedData = Object.entries(caratValues).map(([carat, values]) => {
      const val = values as CaratValue; // Type assertion
      return {
        carat,
        marketPrice: val.marketPrice,
        goldPercentage: val.goldPercentage, // Use the existing calculated percentage
        loanApprovalValue: val.loanApprovalValue,
      };
    });

    const transformedData = {
      date: currentDate.replace(/-/g, '/'),
      carats: storedData,
    };

    const hasValidData = transformedData.carats.every(
      carat => carat.marketPrice !== '0.00' && carat.loanApprovalValue !== '',
    );

    if (!hasValidData) {
      Alert.alert('Warning', 'Please add data for all fields');
    } else {
      axios
        .post(
          'https://gold-management.netlify.app/api/addMarketValues',
          transformedData,
        )
        .then(res => Alert.alert('Success', 'Saved data successfully'))
        .catch(e =>
          Alert.alert('Warning', 'Something went wrong in registration'),
        );
    }
  };

  const setDate = async (date: string) => {
    await AsyncStorage.setItem('date', JSON.stringify(date));
  };

  // Function to generate and store data
  const generateAndStoreData = async () => {
    const storedData = Object.entries(caratValues).map(([carat, values]) => {
      const val = values as CaratValue; // Type assertion
      return {
        carat,
        marketPrice: val.marketPrice,
        goldPercentage: val.goldPercentage, // Use the existing calculated percentage
        loanApprovalValue: val.loanApprovalValue,
      };
    });

    // Store data in AsyncStorage or any other persistent storage
    await AsyncStorage.setItem('storedValues', JSON.stringify(storedData));
  };

  setDate(currentDate);

  const setStoredData = async () => {
    try {
      // Extract data from caratValues into an array
      const storedData = Object.entries(caratValues)
        .reverse()
        .map(([carat, values]) => {
          const val = values as CaratValue; // Type assertion
          return {
            carat: carat,
            marketPrice: val.marketPrice,
            goldPercentage: val.goldPercentage, // Use the existing calculated percentage
            loanApprovalValue: val.loanApprovalValue,
          };
        });

      // Convert the data to a string and store it in AsyncStorage
      await AsyncStorage.setItem('storedValues', JSON.stringify(storedData));

      // Fetch and log the stored data for verification
      await AsyncStorage.getItem('storedValues');
    } catch (error) {
      console.error('Failed to save stored data:', error);
    }
  };

  const generatePDF = async () => {
    const htmlContent = `
    <div style="margin-top: 200px;">
      <h1 style="text-align: center;">Market Values Update</h1>
      <label for="id_of_what_you're_labeling">Current Date: ${new Date().toLocaleDateString()}</label>
      <table style="width: 100%; border-collapse: collapse;" border="1">
        <thead>
          <tr>
            <th style="padding: 8px;">Carat</th>
            <th style="padding: 8px;">Market Price</th>
            <th style="padding: 8px;">Gold Percentage</th>
            <th style="padding: 8px;">Loan Approval Value</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(caratValues)
            .reverse()
            .map(([carat, values]) => {
              const val = values as CaratValue;
              return `
                <tr>
                  <td style="text-align: center; padding: 8px;">${carat}</td>
                  <td style="text-align: center; padding: 8px;">${val.marketPrice}</td>
                  <td style="text-align: center; padding: 8px;">${val.goldPercentage}</td>
                  <td style="text-align: center; padding: 8px;">${val.loanApprovalValue}</td>
                </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
    `;

    try {
      // Determine download directory based on platform
      let downloadDir;
      if (Platform.OS === 'android') {
        downloadDir = RNFS.ExternalDirectoryPath;
      } else if (Platform.OS === 'ios') {
        downloadDir = RNFS.DocumentDirectoryPath; // Or your custom path
      }

      // Generate a unique file name
      let fileName = `MarketValueUpdate_${currentDate}`;
      let filePath = `${downloadDir}/${fileName}.pdf`;

      let options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
      };

      let file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF generated at ${file.filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Market Value Update</Text>
      <Text style={styles.title2}>Current Date: {currentDate}</Text>
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.caratHeader}>Carat</Text>
          <Text style={styles.tableHeader}>Market Price</Text>
          <Text style={styles.tableHeader}>Gold Percentage</Text>
          <Text style={styles.loanHeader}>Loan Approval Value</Text>
        </View>
        {Object.entries(caratValues)
          .reverse()
          .map(([carat, values]) => {
            const val = values as CaratValue;
            const rowStyle = [
              styles.tableRow,
              {backgroundColor: parseInt(carat) === 22 ? 'gold' : 'white'},
            ];

            return (
              <View style={rowStyle} key={carat}>
                <Text style={styles.caratCell}>{carat}</Text>
                <Text style={styles.tableCell}>{val.marketPrice}</Text>
                <Text style={styles.tableCell}>{val.goldPercentage}</Text>
                <Text style={styles.loanCell}>{val.loanApprovalValue}</Text>
              </View>
            );
          })}
      </View>

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.buttonText}> GET PDF </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333333',
  },
  title2: {
    fontSize: 16,
    textAlign: 'right',
    marginBottom: 20,
    color: '#666666',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  caratHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '15%',
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '28%',
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  loanHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '28%',
    color: '#333333',
  },
  caratCell: {
    textAlign: 'center',
    width: '15%',
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    textAlign: 'center',
    width: '28%',
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  loanCell: {
    textAlign: 'center',
    width: '28%',
    color: '#333333',
    paddingVertical: 8,
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProjectManagerPage;
