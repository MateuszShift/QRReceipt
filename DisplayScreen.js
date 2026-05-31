import { useEffect, useRef } from "react";
import { View, Text, Dimensions, Alert, StyleSheet, Platform, TouchableOpacity } from "react-native"
import * as Brightness from 'expo-brightness'
import QRCode from 'react-native-qrcode-svg';

const {width} = Dimensions.get('window');
const QR_SIZE = Math.min(width-80, 300);

export default function DisplayScreen({route, navigation}) {

    const {receipt} = route.params;
    const originalBrightness = useRef(null);

    useEffect(() => {
        const maximize = async () => {
            const {status} = await Brightness.requestPermissionsAsync();
            if (status === 'granted') {
                originalBrightness.current = await Brightness.getBrightnessAsync();
                await Brightness.setBrightnessAsync(1.0);
            }
        }

        maximize();
        return () => {
            if (originalBrightness.current != null) {
                Brightness.setBrightnessAsync(originalBrightness.current);
            }
        }
    }, []);

    const handleDelete = () => {
        Alert.alert(
            'Usuń paragon',
            `Usunąć paragon ze sklepu "${receipt.store_name}"?`,
            [
                { text: 'Anuluj', style: 'cancel' },
                {
                text: 'Usuń',
                style: 'destructive',
                onPress: () => {
                    deleteReceipt(receipt.id);
                    navigation.goBack();
                }
                }
            ]
        );
    };

    return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Wróć</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.storeName}>{receipt.store_name}</Text>
          <Text style={styles.dateText}>{receipt.expiration_date}</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>Usuń</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
            <QRCode
                value={receipt.qr_value}
                size={QR_SIZE}
                backgroundColor="white"
                color="black"
                quietZone={16}
            />
        </View>
        <Text style={styles.hint}>Skieruj skaner kasy na ten kod</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Wartość paragonu</Text>
        <Text style={styles.infoValue}>{receipt.receipt_value} zł</Text>
        <Text style={styles.infoLabel}>Kod</Text>
        <Text style={styles.infoCode} selectable>{receipt.qr_value}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50'
  },
  headerCenter: {
    alignItems: 'center'
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700'
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2
  },
  deleteButton: {
    fontSize: 16,
    color: '#e53935'
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    color: '#888'
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginBottom: Platform.OS === 'ios' ? 40 : 20
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700'
  },
  infoCode: {
    fontSize: 13,
    color: '#4CAF50',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
});