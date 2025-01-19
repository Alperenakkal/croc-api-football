import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { API_KEY } from '@env';
import { formatDate, getTurkeyTime } from './timeUtils';
import H2HMatchDetails from './H2HMatchDetails';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'

const EarlyMatchDetails = ({ match }) => {
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
  console.log("early match");
  
  return (
    <ScrollView style={styles.container}>
      {/* Başlık ve Takımlar */}
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
          <Text style={styles.dateTime}>{formatDate(matchDetails.event_date)}</Text>
          <Text style={styles.time}>{getTurkeyTime(matchDetails.event_time)}</Text>
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

      {/* H2H Bilgileri */}
      <H2HMatchDetails
        firstTeamId={matchDetails.home_team_key}
        secondTeamId={matchDetails.away_team_key}
        matchDetails={matchDetails}
      />

      {/* Genel Bilgiler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genel Bilgiler</Text>
        <View style={styles.infoRow}>
          <Icon name="football-outline" size={20} color="#FFD700" style={styles.icon} />
          <Text style={styles.infoText}>Lig: {matchDetails.league_name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={20} color="#FFD700" style={styles.icon} />
          <Text style={styles.infoText}>Stadyum: {matchDetails.event_stadium}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon2 name="whistle" size={20} color="#FFD700" style={styles.icon} />
          <Text style={styles.infoText}>Hakem: {matchDetails.event_referee}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="time-outline" size={20} color="#FFD700" style={styles.icon} />
          <Text style={styles.infoText}>Durum: {matchDetails.event_status}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF', // Arka plan artık koyu gri bir renk
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#32CD32', // Premium yeşil
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#32CD32', // Premium yeşil
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamBackground: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  imageBackgroundStyle: {
    opacity: 0.1,
    resizeMode: 'contain',
  },
  teamLogo: {
    width: 60,
    height: 60,
    marginBottom: 5,
    
  },
  teamNames: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Premium yeşil
    textTransform: 'uppercase',
    marginTop: 5,
  },
  dateTimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#2A2A2A', // Daha koyu bir arka plan rengi
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#32CD32', // Premium yeşil detay
  },
  dateTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32CD32', // Premium yeşil
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginTop:30,
    borderColor: '#32CD32', // Premium yeşil detay
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C0C0C0', // Premium yeşil
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#C0C0C0', // Premium yeşil
  },
});

export default EarlyMatchDetails;
