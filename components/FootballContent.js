import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY } from '@env';


const FootballContent = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leagueId, setLeagueId] = useState([322, 318, 152, 302, 207]); // İlgili Lig ID'leri
    const [countryId, setCountryId] = useState([111, 44, 6, 5]); // Ülke ID'leri
    const [leaguesByCountry, setLeaguesByCountry] = useState({}); // Ülkeye göre ligler


    useEffect(() => {
        const fetchData = async () => {
            try {
                let combinedMatches = [];
                let leaguesByCountryTemp = {};

                for (let i = 0; i < countryId.length; i++) {
                    const id = countryId[i];


                    // Lig Bilgilerini Çek
                    const leagueResponse = await fetch(
                       `https://apiv2.allsportsapi.com/football/?met=Leagues&APIkey=${API_KEY}&countryId=${id}`
                    );
                    const leagueData = await leagueResponse.json();

                    if (leagueData.success === 1) {
                        leaguesByCountryTemp[id] = leagueData.result.filter((league) =>
                            leagueId.includes(league.league_key)
                        );


                        for (const league of leaguesByCountryTemp[id]) {

                            const matchResponse = await fetch(
                               `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_KEY}&from=2024-12-22&to=2024-12-22&leagueId=${league.league_key}`
                            );
                            const matchData = await matchResponse.json();

                            if (matchData.success === 1) {
                                combinedMatches = [...combinedMatches, ...matchData.result];
                            }
                        }
                    }
                }

                setLeaguesByCountry(leaguesByCountryTemp);
                setMatches(combinedMatches);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        /*
        const intervalId = setInterval(() => {
            fetchData(); // Belirli aralıklarla çalıştır
        }, 30000); // 30 saniye
    
        return () => clearInterval(intervalId); // Bileşen temizlendiğinde interval'i temizle
        */
    }, []);
    


    if (matches.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Veri bulunamadı.</Text>
            </View>
        );
    }

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
        .filter((match) => match.league_key === league.league_key)
        .map((match) => (
          <View key={match.event_key} style={styles.matchContainer}>
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
                    styles.status,
                    match.event_status !== "Finished" && styles.notFinishedStatus, // Sadece status için koşullu stil
                  ]}
                >
                  {match.event_status === "Finished" ? "MS" : match.event_status}
                </Text>
                <Text
                  style={[
                    styles.score,
                    match.event_status !== "Finished" && styles.notFinishedScore, // Sadece score için koşullu stil
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
          </View>
        ))}
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
    },
    countryContainer: {
        marginBottom: 20,
        padding: 10,
    },
    countryHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    leagueContainer: {
        marginBottom: 20,
    },
    leagueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#e6e6e6',
        borderRadius: 5,
        marginHorizontal: 10,
    },
    leagueName: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 20,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    matchContainer: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    matchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      
    },
    teamContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '40%',
        flex:1,
    },
    scoreStatusContainer: {
        alignItems: 'center',
        marginHorizontal: 10, // Daha iyi bir aralık için
    },
    teamName: {
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 14,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    teamImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    notFinishedScore: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white', // Varsayılan renk (MS olanlar için)
        backgroundColor: 'orange',
        borderRadius: 3,
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black', // Varsayılan renk (MS olanlar için)
        backgroundColor: 'transparent', // Ekle
    },
    image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom:2,
    },
    notFinishedStatus:{
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'orange',
        marginBottom:2, 
        borderRadius: 3,
        width: 50
    }
});

export default FootballContent;
