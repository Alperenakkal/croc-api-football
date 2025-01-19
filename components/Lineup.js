import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Lineup = ({ lineup }) => {
    console.log("alperenna2");
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kadro</Text>
      <View>
        <Text style={styles.teamTitle}>Ev Sahibi</Text>
        {lineup.home_team.map((player, index) => (
          <Text key={index} style={styles.player}>
            {player.name}
          </Text>
        ))}
      </View>
      <View>
        <Text style={styles.teamTitle}>Deplasman</Text>
        {lineup.away_team.map((player, index) => (
          <Text key={index} style={styles.player}>
            {player.name}
          </Text>
        ))}
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  player: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
  },
});

export default Lineup;
