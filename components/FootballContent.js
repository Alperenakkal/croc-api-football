import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';
import { getTurkeyTime } from './timeUtils.js';


const formatMonth = (month) => {
  // Ay değerini 1 artır ve iki haneli hale getir (01, 02, ..., 12)
  return String(month + 1).padStart(2, '0');
};

const FootballContent = ({ day, month, year,navigation }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leagueId, setLeagueId] = useState([322, 318, 152, 302, 207]); // İlgili Lig ID'leri
    const [countryId, setCountryId] = useState([111, 44, 6, 5]); // Ülke ID'leri
    const [leaguesByCountry, setLeaguesByCountry] = useState({}); // Ülkeye göre ligler

  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          let combinedMatches = [];
          let leaguesByCountryTemp = {};
    
          for (let i = 0; i < countryId.length; i++) {
            const id = countryId[i];
            const currentMonth = formatMonth(month);
    
            const leagueResponse = await fetch(
              `https://apiv2.allsportsapi.com/football/?met=Leagues&APIkey=${API_KEY}&countryId=${id}`
            );
            const leagueData = await leagueResponse.json();
    
            if (leagueData.success === 1 && leagueData.result) {
              let leaguesWithMatches = [];
    
              for (const league of leagueData.result.filter((league) =>
                leagueId.includes(league.league_key)
              )) {
                const matchResponse = await fetch(
                  `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_KEY}&from=${year}-${currentMonth}-${day}&to=${year}-${currentMonth}-${day}&leagueId=${league.league_key}`
                );
                const matchData = await matchResponse.json();
    
                if (
                  matchData.success === 1 &&
                  Array.isArray(matchData.result) &&
                  matchData.result.length > 0
                ) {
                  leaguesWithMatches.push(league);
                  combinedMatches = [...combinedMatches, ...matchData.result];
                }
              }
    
              if (leaguesWithMatches.length > 0) {
                leaguesByCountryTemp[id] = leaguesWithMatches;
              }
            }
          }
    
          // Maçları saatine göre sırala
          combinedMatches.sort((a, b) => {
            const [hourA, minuteA] = a.event_time.split(':').map(Number);
            const [hourB, minuteB] = b.event_time.split(':').map(Number);
    
            if (hourA === hourB) {
              return minuteA - minuteB; // Aynı saatlerde dakika karşılaştırması
            }
            return hourA - hourB; // Saat karşılaştırması
          });
    
          setLeaguesByCountry(leaguesByCountryTemp);
          setMatches(combinedMatches);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [day, month, year]);
    

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text>Veriler yükleniyor, lütfen bekleyin...</Text>
        </View>
      );
    }
    
    if (matches.length === 0) {
      return (
        <View style={styles.noDataContainer}>
          <Text>Veri bulunamadı.</Text>
        </View>
      );
    }
  if (error) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true)}>
                <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
        </View>
    );
}
const handleMatchPress = (match) => {
  console.log("Tıklanan maç:", match.event_key);
  navigation.navigate('MatchDetailsPage', { match: match.event_key, status:match.event_status });
};
  
    return (
        <ScrollView>
        {countryId.map((country) => (
          leaguesByCountry[country] && (
            <View key={country} style={styles.countryContainer}>
              {leaguesByCountry[country].map((league) => (
                <View key={league.league_key} style={styles.leagueContainer}>
                  {/* Lig Başlığı */}
                  <View style={styles.leagueHeader}>
                    <Image source={{ uri: league.country_logo }} style={styles.image} />
                    <Text style={styles.leagueName}>{league.league_name}</Text>
                  </View>
  
                  {/* Bu Lige Ait Maçlar */}
                  {matches
  .filter((match) => match.league_key === league.league_key).length > 0 ? (
  matches
    .filter((match) => match.league_key === league.league_key)
    .map((match) => (
      <TouchableOpacity
        key={match.event_key}
        style={styles.matchContainer}
        onPress={() => handleMatchPress(match)} // Butona tıklandığında çalışacak fonksiyon
      >
        <View style={styles.matchRow}>
          {/* Ev Sahibi Takım */}
          <View style={styles.teamContainer}>
            <Image style={styles.teamImage} source={{ uri: match.home_team_logo }} />
            <Text style={styles.teamName}>{match.event_home_team}</Text>
          </View>

          {/* Skor ve Maç Durumu */}
          <View style={styles.scoreStatusContainer}>
            <Text
              style={[
                match.event_status === "Finished"
                  ? styles.defaultStatus 
                  : match.event_status === ""
                  ? styles.inProgressStatus 
                  : styles.notFinishedStatus, 
              ]}
            >
              {match.event_status === "Finished" 
                ? "MS" 
                : match.event_status === "" 
                ? getTurkeyTime(match.event_time)
                : match.event_status}
            </Text>
            <Text
              style={[
                match.event_status === "Finished" ? styles.score:
                match.event_status === "" ? styles.inProgressScore:
                styles.notFinishedScore, 
              ]}
            >
              {match.event_final_result || "N/A"}
            </Text>
          </View>

          {/* Deplasman Takımı */}
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{match.event_away_team}</Text>
            <Image style={styles.teamImage} source={{ uri: match.away_team_logo }} />
          </View>
        </View>
      </TouchableOpacity>
    ))
) : (
  <View style={styles.noMatchContainer}>
    <Text style={styles.noMatchText}>Bu ligde bugün maç bulunmamaktadır.</Text>
  </View>
)}

                </View>
              ))}
            </View>
          )
        ))}
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // Hafif bir arka plan rengi
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  countryContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android gölgelendirme
  },
  leagueContainer: {
    marginBottom: 12,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 8,
  },
  leagueName: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  matchContainer: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noMatchContainer: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  noMatchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  teamImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  scoreStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  notFinishedScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  inProgressScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#66BB6A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: 'transparent',
  },
  notFinishedStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  inProgressStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  defaultStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#666',
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});


export default FootballContent;
