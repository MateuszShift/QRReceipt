import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import AddScreen from './AddScreen';
import DisplayScreen from './DisplayScreen';
import { addReceipt, getAllReceipts, initDB } from './db/database';
import {useEffect} from 'react'

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    initDB();
  }, []);

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
