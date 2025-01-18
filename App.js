import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import FootballPages from './pages/FootballPages';
import MatchDetailsPage from './pages/MatchDetailsPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer
      linking={{
        prefixes: ['http://localhost:8081'], // Yerel geliştirme için
        config: {
          screens: {
            FootballPages: '/', // Ana ekran URL'si
            MatchDetailsPage: '/match-details', // Detay ekranı URL'si
          },
        },
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="FootballPages" component={FootballPages} options={{ title: 'Football Matches' }} />
        <Stack.Screen name="MatchDetailsPage" component={MatchDetailsPage} options={{ title: 'Match Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
