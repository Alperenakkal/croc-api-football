import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatchResultBar = ({ matches, teamId }) => {
  const getResultLetter = (match) => {
    const [homeGoals, awayGoals] = match.event_final_result.split('-').map(Number);
    if (homeGoals > awayGoals && match.home_team_key === teamId) return 'G'; // Ev sahibi kazanırsa
    if (homeGoals < awayGoals && match.away_team_key === teamId) return 'G'; // Deplasman kazanırsa
    if (homeGoals === awayGoals) return 'B'; // Berabere
    return 'M'; // Kaybederse
  };

  return (
    <View style={styles.resultBar}>
      {matches.slice(0, 5).map((match, index) => (
        <View
          key={index}
          style={[
            styles.resultBox,
            getResultLetter(match) === 'G'
              ? styles.win
              : getResultLetter(match) === 'M'
              ? styles.lose
              : styles.draw,
          ]}
        >
          <Text style={styles.resultText}>{getResultLetter(match)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  resultBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resultBox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 4,
  },
  win: {
    backgroundColor: '#4CAF50', // Yeşil (Kazandı)
  },
  lose: {
    backgroundColor: '#F44336', // Kırmızı (Kaybetti)
  },
  draw: {
    backgroundColor: '#FFC107', // Sarı (Berabere)
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 10,
  },
});

export default MatchResultBar;
