import React from 'react';
import { View, StyleSheet } from 'react-native';
import DateComponent from '../components/DateComponent.js';
import FootballContent from '../components/FootballContent.js';

const FootballPages = () => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <DateComponent />
        <FootballContent />
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
