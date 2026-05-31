import { useState } from "react"
import { View, Text, Platform, TouchableOpacity, KeyboardAvoidingView, ScrollView, TextInput, StyleSheet, Alert } from "react-native"
import {useCameraPermissions, CameraView} from 'expo-camera'
import { addReceipt } from "./db/database";
import * as Crypto from 'expo-crypto';

export default function AddScreen( {navigation} ) {

    const [qrValue, setQrValue] = useState('');
    const [storeName, setStoreName] =useState('');
    const [expirationDate, setExpirationDate] = useState(new Date().toISOString().split('T')[0]);
    const [receiptValue, setReceiptValue] = useState('');

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [mode, setMode] = useState('form');
  

    const handleScan = async () => {
        if (!permission?.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert('Brak uprawnień', 'Zezwól na dostęp do kamery w ustawieniach');
                return;
            }
        }
        setScanned(false);
        setMode('scan');
    }

    const handleBarcodeScanned = ( {data} ) => {
        if (scanned) return;
        setScanned(true);
        setQrValue(data);
        setMode('form');
    }

    const handleSave = () => {
        if (!storeName.trim()) {
            Alert.alert('Brak nazwy', 'Wpisz nazwę sklepu.');
            return;
        }
        if (!qrValue.trim()) {
            Alert.alert('Brak kodu', 'Zeskanuj lub wpisz kod z paragonu.');
            return;
        }
        if (!receiptValue.trim()) {
            Alert.alert('Brak kwoty', 'Wpisz wartość paragonu.');
            return;
        }

        addReceipt({id: Crypto.randomUUID(), store_name: storeName.trim(), expiration_date: expirationDate.trim(), qr_value: qrValue.trim(), receipt_value: parseFloat(receiptValue)})

        navigation.goBack();
    }

    if (mode === 'scan') {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39']
          }}
        >
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Skieruj kamerę na kod z paragonu</Text>
            <TouchableOpacity
              style={styles.cancelScanButton}
              onPress={() => setMode('form')}
            >
              <Text style={styles.cancelScanText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>Wróć</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nowy paragon</Text>
            </View>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <TouchableOpacity style={styles.label} onPress={handleScan}>
                    <Text style={styles.scanButtonText}>Skanuj kod z paragonu</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Numer kodu kreskowego *</Text>
                <TextInput
                    style={styles.input}
                    value={qrValue}
                    onChangeText={setQrValue}
                    placeholder="Wpisz lub zeskanuj kod kreskowy"
                    autoCapitalize="none"
                    multiline
                />

                <Text style={styles.label}>Nazwa sklepu *</Text>
                <TextInput
                    style={styles.input}
                    value={storeName}
                    onChangeText={setStoreName}
                    placeholder="np.Biedronka, Lidl..."
                />

                <Text style={styles.label}>Data ważności *</Text>
                <TextInput 
                    style={styles.input}
                    value={expirationDate}
                    onChangeText={setExpirationDate}
                    placeholder="RRRR-MM-DD"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Kwota paragonu *</Text>
                <TextInput
                    style={styles.input}
                    value={receiptValue}
                    onChangeText={setReceiptValue}
                    placeholder="np. 17.20"
                    keyboardType="decimal-pad"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Zapisz paragon</Text>
                </TouchableOpacity>

            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  form: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  scanButton: {
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: '#4CAF50',
  },
  scanButtonText: {
    color: '#2e7d32',
    fontSize: 15,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 260,
    height: 160,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  scanHint: {
    color: '#fff',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  cancelScanButton: {
    marginTop: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelScanText: {
    color: '#fff',
    fontSize: 16,
  },
});