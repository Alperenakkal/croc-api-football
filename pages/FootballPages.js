import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DateComponent from '../components/DateComponent.js';
import FootballContent from '../components/FootballContent.js';
import { Text } from 'react-native-web';

const FootballPages = () => {
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const handleDateChange = (newDay, newMonth, newYear) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
  };

  
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <DateComponent onDateChange={handleDateChange} />
        
       
        <FootballContent day={day} month={month} year={year} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start', // Bileşenlerin üst üste gelmesini sağlar
  },
});

export default FootballPages;
