import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen';
import AddScreen from './AddScreen';
import DisplayScreen from './DisplayScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Add' component={AddScreen} />
        <Stack.Screen name='Display' component={DisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
