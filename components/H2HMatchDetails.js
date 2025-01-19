import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { API_KEY } from '@env';

const MatchResultBar = ({ matches, teamId }) => {
  const getResultLetter = (match) => {
    const [homeGoals, awayGoals] = match.event_final_result.split('-').map(Number);
    if (homeGoals > awayGoals && match.home_team_key === teamId) return 'G';
    if (homeGoals < awayGoals && match.away_team_key === teamId) return 'G';
    if (homeGoals === awayGoals) return 'B';
    return 'M';
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

const H2HMatchDetails = ({ firstTeamId, secondTeamId, matchDetails }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchH2HData = async () => {
      try {
        const response = await fetch(
          `https://apiv2.allsportsapi.com/football/?met=H2H&APIkey=${API_KEY}&firstTeamId=${firstTeamId}&secondTeamId=${secondTeamId}`
        );
        const result = await response.json();

        if (result.success === 1) {
          setData(result.result);
        } else {
          setError('Veri bulunamadı.');
        }
      } catch (err) {
        setError('Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchH2HData();
  }, [firstTeamId, secondTeamId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A67C00" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
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
      <Text style={styles.title}>Form</Text>
      <View style={styles.section}>
        <Image source={{ uri: matchDetails.home_team_logo }} style={styles.teamLogo} />
        <Text style={styles.teamTitle}>{matchDetails.event_home_team}</Text>
        <MatchResultBar matches={data.firstTeamResults} teamId={firstTeamId} />
      </View>

      <View style={styles.vsContainer}>
        <Text style={styles.vsText}>VS</Text>
      </View>

      <View style={styles.section}>
        <Image source={{ uri: matchDetails.away_team_logo }} style={styles.teamLogo} />
        <Text style={styles.teamTitle}>{matchDetails.event_away_team}</Text>
        <MatchResultBar matches={data.secondTeamResults} teamId={secondTeamId} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003300', // Timsah yeşili
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700', // Altın sarısı
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFD700',
    fontSize: 16,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 3,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingBottom: 5,
  },
  section: {
    marginBottom: 10,
    alignItems: 'center',
  },
  teamTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff', // Beyaz
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom:10,
    letterSpacing: 1.5,
  },
  teamLogo: {
    width: 35,
    height: 35,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFD700', // Altın detay
  },
  resultBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 2,
  },
  resultBox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFD700', // Altın detay
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
    backgroundColor: '#003300',
    letterSpacing: 2,
  },
});

export default H2HMatchDetails;
