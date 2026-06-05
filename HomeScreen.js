import { useCallback, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAllReceipts } from "./db/database";
import { useFocusEffect } from "@react-navigation/native";

function isExpiringSoon(dateStr) {
    const exp = new Date(dateStr);
    const diff = (exp - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
}

function isExpired(dateStr) {
    return new Date(dateStr) < new Date();
}

export default function HomeScreen({ navigation }) {
    const [receipts, setReceipts] = useState([]);
    const insets = useSafeAreaInsets();

    useFocusEffect(
        useCallback(() => {
            setReceipts(getAllReceipts());
        }, [])
    );

    const renderItem = ({ item }) => {
        const expired = isExpired(item.expiration_date);
        const soon = !expired && isExpiringSoon(item.expiration_date);
        const badgeColor = expired ? '#e53935' : soon ? '#FF9800' : '#4CAF50';
        const badgeLabel = expired ? 'Wygasł' : soon ? 'Wkrótce' : 'Ważny';

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('Display', { receipt: item })}
            >
                <View style={styles.cardLeft}>
                    <Text style={styles.storeName} numberOfLines={1}>{item.store_name}</Text>
                    <Text style={styles.dateText}>Ważny do: {item.expiration_date}</Text>
                </View>
                <View style={styles.cardRight}>
                    <Text style={styles.amount}>{parseFloat(item.receipt_value).toFixed(2)} zł</Text>
                    <View style={[styles.badge, { backgroundColor: badgeColor + '22', borderColor: badgeColor }]}>
                        <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeLabel}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={styles.headerTitle}>Moje Paragony</Text>
                <Text style={styles.headerSubtitle}>{receipts.length} {receipts.length === 1 ? 'paragon' : 'paragonów'}</Text>
            </View>

            <FlatList
                data={receipts}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 90 }]}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🧾</Text>
                        <Text style={styles.emptyText}>Brak paragonów</Text>
                        <Text style={styles.emptyHint}>Dodaj pierwszy paragon przyciskiem poniżej</Text>
                    </View>
                }
                renderItem={renderItem}
            />

            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('Add')}
                >
                    <Text style={styles.addButtonText}>+ Dodaj paragon</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    header: {
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    list: {
        padding: 16,
        gap: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.07,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cardLeft: {
        flex: 1,
        marginRight: 12,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: 6,
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2e7d32',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#555',
    },
    emptyHint: {
        fontSize: 13,
        color: '#aaa',
        marginTop: 6,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingTop: 12,
        paddingHorizontal: 16,
        borderTopWidth: 0.5,
        borderTopColor: '#e0e0e0',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
