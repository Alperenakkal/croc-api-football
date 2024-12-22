import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import FootballPages from './pages/FootballPages';




export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: '#ffffffff'}} >
         <FootballPages/>
    </View>
  
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
