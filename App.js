import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import AddScreen from './AddScreen';
import DisplayScreen from './DisplayScreen';
import { addReceipt, getAllReceipts, initDB } from './db/database';

const Stack = createNativeStackNavigator();

export default function App() {

  initDB();
  addReceipt({id:'1', store_name:'Biedra', expiration_date: '2026-05-31', qr_value:'acb12345', receipt_value:0.5});
  addReceipt({id:'2', store_name:'Biedra', expiration_date: '2026-05-21', qr_value:'acb12345', receipt_value:20.0})

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
