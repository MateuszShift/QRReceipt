import { useCallback, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native"
import { getAllReceipts } from "./db/database";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen( {navigation} ) {
    const [receipts, setReceipts] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setReceipts(getAllReceipts());
        }, [])
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Moje Paragony</Text>
            </View>

            <FlatList 
                data={receipts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Brak paragonów, dodaj pierwszy!</Text>
                }
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Display', {receipt: item})}
                    >
                        <Text style={styles.storeName}>{item.store_name}</Text>
                        <Text style={styles.dateText}>{item.expiration_date}</Text>
                        <Text style={styles.storeName}>{item.receipt_value.toFixed(2)} zł</Text>
                    </TouchableOpacity>
                )}
            />
            
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Add')}
                >
                    <Text style={styles.addButtonText}>Dodaj paragon</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 60,
    fontSize: 15,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})