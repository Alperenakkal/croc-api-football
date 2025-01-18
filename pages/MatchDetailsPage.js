import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DateComponent from '../components/DateComponent.js';
import FootballContent from '../components/FootballContent.js';
import MatchDetails from '../components/MatchDetails.js';
import FinishMatchDetails from '../components/FinishMatchDetails.js';

const MatchDetailsPage = ({ route }) => {
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const handleDateChange = (newDay, newMonth, newYear) => {
    setDay(newDay);
    setMonth(newMonth);
    setYear(newYear);
  };
  const { match,status } = route.params;


  return (
    <View style={styles.container}>
    {status === "Finished" ? <FinishMatchDetails match={match} /> : <MatchDetails match={match} />}
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

export default MatchDetailsPage;
