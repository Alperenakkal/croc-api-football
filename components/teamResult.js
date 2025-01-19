import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { API_KEY } from '@env';

import MatchResultBar from './MatchResultBar';

const TeamResults = ({ firstTeamId, secondTeamId, isFirstTeam }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamResults = async () => {
      try {
        const response = await fetch(
          `https://apiv2.allsportsapi.com/football/?met=H2H&APIkey=${API_KEY}&firstTeamId=${firstTeamId}&secondTeamId=${secondTeamId}`
        );
        const data = await response.json();

        if (data.success === 1) {
          if (isFirstTeam) {
            setResults(data.firstTeamResults || []);
          } else {
            setResults(data.secondTeamResults || []);
          }
        } else {
          setError('Sonuç bulunamadı.');
        }
      } catch (err) {
        setError('Bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamResults();
  }, [firstTeamId, secondTeamId, isFirstTeam]);

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
    <View>
      <Text style={styles.title}>{isFirstTeam ? 'İlk Takım Sonuçları' : 'İkinci Takım Sonuçları'}</Text>
      <MatchResultBar matches={results} teamId={isFirstTeam ? firstTeamId : secondTeamId} />
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TeamResults;
