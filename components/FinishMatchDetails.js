import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { API_KEY } from '@env';
import MatchSummary from './MatchSummary'; // MatchSummary bileşenini import ediyoruz
import Icon from 'react-native-vector-icons/Ionicons';


const FinishMatchDetails = ({ match }) => {
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await fetch(
          `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_KEY}&matchId=${match}`
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
        <ActivityIndicator size="large" color="#FFD700" />
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

  // Etkinlikleri düzenliyoruz
  const events = [];

  matchDetails.goalscorers.forEach(goal => {
    const isHome = !!goal.home_scorer;
    events.push({
      time: goal.time,
      icon: <Icon name="football" size={20} color="#FFD700" />, // Gol ikonu
      description: `${isHome ? goal.home_scorer : goal.away_scorer} gol attı (${isHome ? matchDetails.event_home_team : matchDetails.event_away_team})`,
      isHome,
      type: 'goal',
    });
  });

  matchDetails.cards.forEach(card => {
    const isHome = !!card.home_fault;
    const cardType = card.card === 'yellow card' ? 'yellow_card' : 'red_card';
    events.push({
      time: card.time,
      icon: <Icon name={card.card === 'yellow card' ? 'warning' : 'close'} size={20} color={card.card === 'yellow card' ? '#FFD700' : '#FF0000'} />, // Kart ikonu
      description: `${isHome ? card.home_fault : card.away_fault} ${card.card === 'yellow card' ? 'Sarı kart' : 'Kırmızı kart'} gördü (${isHome ? matchDetails.event_home_team : matchDetails.event_away_team})`,
      isHome,
      type: cardType,
    });
  });

  matchDetails.substitutes.forEach(sub => {
    if (sub.home_scorer?.in || sub.away_scorer?.in) {
      const isHome = !!sub.home_scorer?.in;
      events.push({
        time: sub.time,
        icon: <Icon name="swap-horizontal" size={20} color="#32CD32" />, // Oyuncu değişikliği ikonu
        description: `Giren: ${isHome ? sub.home_scorer.in : sub.away_scorer.in}, Çıkan: ${isHome ? sub.home_scorer.out : sub.away_scorer.out} (${isHome ? matchDetails.event_home_team : matchDetails.event_away_team})`,
        isHome,
        type: 'substitution',
      });
    }
  });

  events.sort((a, b) => parseInt(a.time) - parseInt(b.time));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.teamContainer}>
          <ImageBackground
            source={{ uri: matchDetails.home_team_logo }}
            style={styles.teamBackground}
            imageStyle={styles.imageBackgroundStyle}
          >
            <Image source={{ uri: matchDetails.home_team_logo }} style={styles.teamLogo} />
            <Text style={styles.teamNames}>{matchDetails.event_home_team}</Text>
          </ImageBackground>
        </View>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>MS</Text>
          <Text style={styles.time}>{matchDetails.event_final_result}</Text>
        </View>
        <View style={styles.teamContainer}>
          <ImageBackground
            source={{ uri: matchDetails.away_team_logo }}
            style={styles.teamBackground}
            imageStyle={styles.imageBackgroundStyle}
          >
            <Image source={{ uri: matchDetails.away_team_logo }} style={styles.teamLogo} />
            <Text style={styles.teamNames}>{matchDetails.event_away_team}</Text>
          </ImageBackground>
        </View>
      </View>

      {/* Özet Bileşeni */}
      <Text style={styles.title}>ÖZET</Text>
      <MatchSummary events={events} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6A5ACD',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6347',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamBackground: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  imageBackgroundStyle: {
    opacity: 0.2,
    resizeMode: 'contain',
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginBottom: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  teamNames: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textTransform: 'uppercase',
    marginTop: 5,
  },
  dateTimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  dateTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#696969',
  },
  time: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4682B4',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 3,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingBottom: 5,
  },
});

export default FinishMatchDetails;
