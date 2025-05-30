import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ScannerResults() {
  const [lastScannerResults, setLastScannerResults] = useState({
      "disclaimer": "",
      "physical_attributes": {
          "body_shape": "",
          "muscle_tone": "",
          "muscle_symmetry": "",
          "major_muscle_groups": [],
          "major_muscle_groups_indicators": [],
          "weak_muscle_groups": [],
          "weak_muscle_groups_indicators": []
      },
      "estimated_body_fat": {
          "percentage_range": "",
          "indicators": []
      },
      "training_readiness": {
          "score": "",
          "indicators": []
      },
      "training_recommendations": {
          "body_development": {
              "upper_body": {
                  "chest": [
                      "",
                      "",
                      ""
                  ],
                  "back": [
                      "",
                      "",
                      ""
                  ],
                  "shoulders": [
                      "",
                      "",
                      ""
                  ],
                  "arms": [
                      "",
                      "",
                      ""
                  ]
              },
              "lower_body": {
                  "legs": [
                      "",
                      "",
                      ""
                  ],
                  "calves": [
                      "",
                      ""
                  ]
              },
              "core": [
                  "",
                  "",
                  ""
              ],
              "postural_balance": [
                  "",
                  "",
                  ""
              ]
          },
          "body_maintenance": {
              "upper_body": {
                  "chest": [
                      "",
                      ""
                  ],
                  "back": [
                      "",
                      ""
                  ],
                  "shoulders": [
                      "",
                      ""
                  ],
                  "arms": [
                      "",
                      ""
                  ]
              },
              "lower_body": {
                  "legs": [
                      "",
                      ""
                  ],
                  "calves": [
                      ""
                  ]
              },
              "core": [
                  "",
                  ""
              ],
              "postural_balance": [
                  "",
                  ""
              ]
          },
          "fat_loosing": {
              "cardiovascular": [
                  "",
                  "",
                  "",
                  ""
              ]
          }
      }
  });

  useEffect(() => {
    const fetchScanResults = async () => {
      try {
        const token = await AsyncStorage.getItem('Authorization');
        if (!token) {
          console.warn('⚠️ No authorization token found.');
          return;
        }
  
        const response = await fetch('http://89.104.65.131/user/get-scan-result', {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });
  
        if (!response.ok) {
          const error = await response.json();
          console.error('❌ Failed to fetch scan results:', error);
          return;
        }
  
        const resultData = await response.json();
        const values = Object.values(resultData);
        if (values.length === 0) {
          console.warn('⚠️ No scan results found.');
          return;
        }
  
        const last = values[values.length - 1];
        setLastScannerResults(last.results.scanner_result);
        console.log('✅ Last scan result loaded:', last);
      } catch (err) {
        console.error('🔥 Error fetching scan results:', err);
      }
    };
  
    fetchScanResults();
  }, []);  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SCULPTD APP <Text style={styles.title_span}>AI SCAN</Text></Text>
      <View style={styles.info_block}>
        <Image style={styles.logo} source={require('./assets/logo.png')}/>
        <View style={styles.row}>
          <Text style={styles.row_key}>Body shape</Text>
          <Text style={styles.row_value}>{lastScannerResults.physical_attributes.body_shape}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.row_key}>Muscle tone</Text>
          <Text style={styles.row_value}>{lastScannerResults.physical_attributes.muscle_tone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.row_key}>Body fat</Text>
          <Text style={styles.row_value}>{lastScannerResults.estimated_body_fat.percentage_range} %</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.row_key}>Training recommendations</Text>
          <Text style={styles.row_value}>{lastScannerResults.training_recommendations.body_development.upper_body.chest[0]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.row_key}>Training recommendations</Text>
          <Text style={styles.row_value}>{lastScannerResults.training_recommendations.body_development.upper_body.chest[1]}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.row_key}>Training recommendations</Text>
          <Text style={styles.row_value}>{lastScannerResults.training_recommendations.body_development.upper_body.shoulders[1]}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create program with AI</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rescanButton}>
        <Text style={styles.rescanButtonText}>Rescan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFBE17',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  title_span: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  info_block: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    marginHorizontal: 20,
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 16,
    position: 'relative',
  },
  row: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 15,
  },
  row_key: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    opacity: 0.6,
    flex: 1,
  },
  row_value: {
    fontWeight: 400,
    color: '#ffffff',
    fontSize: 16,
  },
  logo: {
    width: 70,
    height: 70,
    position: 'absolute',
    top: -15,
    right: -15,
    zIndex: 100,
  },
  createButton: {
    marginHorizontal: 20,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#FFBE17',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    color: '#121212',
    fontWeight: 900,
  },
  rescanButton: {
    marginHorizontal: 20,
    height: 50,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  rescanButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 900,
  }
});
