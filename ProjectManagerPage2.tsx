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

const ProjectManagerPage2 = () => {
  const [storedData, setStoredData] = useState<
    {
      carat: string;
      marketPrice: string;
      goldPercentage: string;
      loanApprovalValue: string;
    }[]
  >([]);
  const [storedDate, setStoredDate] = useState(); // Store the date

  useEffect(() => {
    const getStoredData = async () => {
      try {
        const storedValues = await AsyncStorage.getItem('storedValues'); // Fetch the stored data
        if (storedValues) {
          const parsedData = JSON.parse(storedValues);
          setStoredData(parsedData); // Update the storedData state with the parsed data
        }
      } catch (error) {
        console.error('Failed to fetch stored data:', error);
      }
    };
    const getStoredDate = async () => {
      try {
        const storedDate = await AsyncStorage.getItem('date');
        if (storedDate) {
          const parsedDate = JSON.parse(storedDate);
          setStoredDate(parsedDate);
        }
      } catch (error) {
        console.error('Failed to fetch stored data:', error);
      }
    };

    getStoredData();
    getStoredDate();
  }, []);

  const generatePDF = async () => {
    const htmlContent = `
    <div style="margin-top: 200px;">
      <h1 style="text-align: center;">Stored Market Values</h1>
      <label>Current Date: ${storedDate}</label>
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
          ${storedData
            .map(
              item => `
                <tr>
                  <td style="text-align: center; padding: 8px;">${item.carat}</td>
                  <td style="text-align: center; padding: 8px;">${item.marketPrice}</td>
                  <td style="text-align: center; padding: 8px;">${item.goldPercentage}</td>
                  <td style="text-align: center; padding: 8px;">${item.loanApprovalValue}</td>
                </tr>`,
            )
            .join('')}
        </tbody>
      </table>
    </div>
    `;

    try {
      let downloadDir;
      if (Platform.OS === 'android') {
        downloadDir = RNFS.ExternalDirectoryPath;
      } else if (Platform.OS === 'ios') {
        downloadDir = RNFS.DocumentDirectoryPath;
      }

      // Generate a unique file name using the storedDate and current date/time
      let fileName = `StoredMarketValueUpdate_${storedDate}`;
      let filePath = `${downloadDir}/${fileName}.pdf`;

      // Check if the file already exists, if so, increment the number
      while (await RNFS.exists(filePath)) {
        fileName = `StoredMarketValueUpdate_${storedDate}`;
        filePath = `${downloadDir}/${fileName}.pdf`;
      }

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
      <Text style={styles.title}>Stored Market Values</Text>
      <Text style={styles.title2}>Current Date: {storedDate}</Text>
      <View style={styles.table}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.caratHeader}>Carat</Text>
          <Text style={styles.tableHeader}>Market Price</Text>
          <Text style={styles.tableHeader}>Gold Percentage</Text>
          <Text style={styles.loanHeader}>Loan Approval Value</Text>
        </View>
        {storedData.length > 0 ? (
          storedData.map((item, index) => {
            // Create a new style object, conditionally adding backgroundColor
            const dynamicStyle =
              item.carat === '22' ? {backgroundColor: 'gold'} : {};

            return (
              <View style={{...styles.tableRow, ...dynamicStyle}} key={index}>
                <Text style={styles.caratCell}>{item.carat}</Text>
                <Text style={styles.tableCell}>{item.marketPrice}</Text>
                <Text style={styles.tableCell}>{item.goldPercentage}</Text>
                <Text style={styles.loanCell}>{item.loanApprovalValue}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title2: {
    fontSize: 15,
    color: '#000',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 10,
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
    width: '15%', // Reduced width for the Carat column
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  tableHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: '28%', // Adjusted width for other columns
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  loanHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '28%', // Adjusted width for other columns
    color: '#333333',
  },
  caratCell: {
    textAlign: 'center',
    width: '15%', // Reduced width for the Carat column
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  tableCell: {
    textAlign: 'center',
    width: '28%', // Adjusted width for other columns
    color: '#333333',
    borderRightWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
  },
  loanCell: {
    textAlign: 'center',
    width: '28%', // Adjusted width for other columns
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
  noDataText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
  },
});

export default ProjectManagerPage2;
