import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { API_KEY } from '@env';

const MatchDetails = ({ match }) => {
 
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(
          `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${API_KEY}&matchId=${match}`
        );
        const data = await response.json();

        if (data.success === 1) {
          setMatchDetails(data.result[0]);
        } else {
          setError('Maç bilgisi bulunamadı.');
        }
      } catch (err) {
        setError('Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [match]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Maç Başlığı */}
      <View style={styles.header}>
        <Image source={{ uri: matchDetails.home_team_logo }} style={styles.teamLogo} />
        <Text style={styles.vsText}>VS</Text>
        <Image source={{ uri: matchDetails.away_team_logo }} style={styles.teamLogo} />
      </View>

      <Text style={styles.teamNames}>
        {matchDetails.event_home_team} - {matchDetails.event_away_team}
      </Text>

      <Text style={styles.dateTime}>
        {matchDetails.event_date} | {matchDetails.event_time}
      </Text>

      {/* Maç Detayları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genel Bilgiler</Text>
        <Text style={styles.infoText}>Lig: {matchDetails.league_name}</Text>
        <Text style={styles.infoText}>Stadyum: {matchDetails.event_stadium}</Text>
        <Text style={styles.infoText}>Hakem: {matchDetails.event_referee}</Text>
        <Text style={styles.infoText}>Durum: {matchDetails.event_status}</Text>
      </View>

      {/* İstatistikler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İstatistikler</Text>
        {matchDetails.statistics.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statText}>{stat.type}</Text>
            <Text style={styles.statText}>
              {stat.home} - {stat.away}
            </Text>
          </View>
        ))}
      </View>

      {/* Oyuncu Kadroları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kadrolar</Text>
        <Text style={styles.infoText}>Ev Sahibi:</Text>
        {matchDetails.lineups.home_team.starting_lineups.map((player, index) => (
          <Text key={index} style={styles.playerText}>
            {player.player_number}. {player.player}
          </Text>
        ))}
        <Text style={styles.infoText}>Deplasman:</Text>
        {matchDetails.lineups.away_team.starting_lineups.map((player, index) => (
          <Text key={index} style={styles.playerText}>
            {player.player_number}. {player.player}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamNames: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statText: {
    fontSize: 14,
  },
  playerText: {
    fontSize: 14,
    marginBottom: 3,
  },
});

export default MatchDetails;
