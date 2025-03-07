import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DateComponent from '../components/DateComponent.js';
import FootballContent from '../components/FootballContent.js';

const FootballPages = ({ navigation }) => {
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
      <DateComponent onDateChange={handleDateChange} />
      <FootballContent day={day} month={month} year={year} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
});

export default FootballPages;
