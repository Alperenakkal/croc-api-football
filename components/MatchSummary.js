import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MatchSummary = ({ events }) => {
  const renderEvent = (time, icon, description, isHome, type) => {
    let backgroundColor;
    console.log("ALpernenn1");
    
    switch (type) {
      case 'yellow_card':
        backgroundColor = '#FFFACD'; // Sarı kart
        break;
      case 'red_card':
        backgroundColor = '#FFB6C1'; // Kırmızı kart
        break;
      case 'goal':
        backgroundColor = '#E0FFD8'; // Gol
        break;
      case 'substitution':
        backgroundColor = '#D6EAF8'; // Oyuncu değişikliği
        break;
      default:
        backgroundColor = isHome ? '#E6FFE6' : '#E6F2FF';
    }

    return (
      <View style={[styles.eventRow, { backgroundColor }, isHome ? styles.homeEvent : styles.awayEvent]}>
        <Text style={styles.time}>{time}'</Text>
        {icon}
        <Text style={[styles.eventText, isHome ? styles.homeText : styles.awayText]}>{description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) =>
        renderEvent(event.time, event.icon, event.description, event.isHome, event.type)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '70%',
  },
  homeEvent: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  awayEvent: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  eventText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
    paddingHorizontal: 5,
  },
  homeText: {
    textAlign: 'left',
  },
  awayText: {
    textAlign: 'right',
  },
  time: {
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MatchSummary;
