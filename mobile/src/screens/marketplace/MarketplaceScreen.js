/**
 * KrishiMart Marketplace Screen
 * Farmer marketplace where users can browse listings, list crops for direct sale, upload photos,
 * use WhatsApp link integration, and filter by agricultural categories.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable, Image, Alert, Linking, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import GradientCard from '../../components/GradientCard';
import AppInput from '../../components/AppInput';
import { useThemeStore } from '../../store/themeStore';
import { typography, spacing, borderRadius } from '../../theme';
import { formatINR } from '../../utils/helpers';

const INITIAL_LISTINGS = [
  {
    id: '1',
    title: 'Organic Fresh Potatoes',
    farmer: 'Ramesh Kumar',
    category: 'vegetables',
    price: 25,
    unit: 'kg',
    quantity: '500 kg',
    location: 'Hooghly, West Bengal',
    phone: '9876543210',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'Premium Basmati Paddy',
    farmer: 'Arjun Singh',
    category: 'grains',
    price: 3200,
    unit: 'quintal',
    quantity: '10 tons',
    location: 'Karnal, Haryana',
    phone: '9876543211',
    image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'Hybrid Tomato Seeds',
    farmer: 'Snehasis Agro Ltd',
    category: 'seeds',
    price: 450,
    unit: 'packet',
    quantity: '100 packets',
    location: 'Nadia, West Bengal',
    phone: '9876543212',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=400&q=80',
  }
];

export default function MarketplaceScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New Listing Form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newQty, setNewQty] = useState('');
  const [newCategory, setNewCategory] = useState('vegetables');
  const [newLocation, setNewLocation] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleContact = (phone, title) => {
    const url = `whatsapp://send?phone=91${phone}&text=${encodeURIComponent(`Hello! I saw your listing for "${title}" on BharatFarm. Is it still available?`)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(`https://api.whatsapp.com/send?phone=91${phone}`);
      }
    });
  };

  const handleCreateListing = () => {
    if (!newTitle.trim() || !newPrice.trim() || !newQty.trim() || !newLocation.trim() || !newPhone.trim()) {
      Alert.alert('Error', 'Please fill in all details');
      return;
    }

    const listing = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      farmer: 'You (Farmer)',
      category: newCategory,
      price: parseFloat(newPrice),
      unit: newUnit,
      quantity: newQty.trim(),
      location: newLocation.trim(),
      phone: newPhone.trim(),
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80', // Default crop image
    };

    setListings([listing, ...listings]);
    setIsAdding(false);
    Alert.alert('Success', 'Listing published successfully! Buyers can now contact you on WhatsApp.');

    // Reset Form
    setNewTitle('');
    setNewPrice('');
    setNewQty('');
    setNewLocation('');
    setNewPhone('');
  };

  const filteredListings = listings.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All', icon: '🌾' },
    { id: 'vegetables', label: 'Veg', icon: '🥬' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'seeds', label: 'Seeds', icon: '🌱' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="KrishiMart"
        subtitle="Direct farmer-to-buyer trade"
        onBack={() => navigation.goBack()}
        rightIcon={isAdding ? "close-outline" : "add-circle-outline"}
        rightAction={() => setIsAdding(!isAdding)}
      />

      {isAdding ? (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
            🆕 List Your Produce
          </Text>

          <AppInput label="Product Title" placeholder="e.g. Fresh Organic Tomatoes" value={newTitle} onChangeText={setNewTitle} />

          <View style={styles.formRow}>
            <View style={{ flex: 2, marginRight: 8 }}>
              <AppInput label="Price (₹)" placeholder="e.g. 40" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodySmall, { color: theme.textSecondary, marginBottom: 8, fontWeight: '600' }]}>Unit</Text>
              <Pressable
                onPress={() => setNewUnit(newUnit === 'kg' ? 'quintal' : 'kg')}
                style={[styles.unitSelector, { borderColor: theme.border, backgroundColor: theme.inputBg }]}
              >
                <Text style={{ color: theme.text }}>{newUnit.toUpperCase()}</Text>
              </Pressable>
            </View>
          </View>

          <AppInput label="Available Quantity" placeholder="e.g. 500 kg / 2 tons" value={newQty} onChangeText={setNewQty} />

          <Text style={[typography.bodySmall, { color: theme.textSecondary, marginBottom: 8, fontWeight: '600' }]}>Category</Text>
          <View style={styles.categoryRow}>
            {categories.slice(1).map(cat => (
              <Pressable
                key={cat.id}
                onPress={() => setNewCategory(cat.id)}
                style={[
                  styles.categorySelectBtn,
                  { borderColor: theme.border },
                  newCategory === cat.id && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Text style={{ color: newCategory === cat.id ? '#FFF' : theme.text }}>
                  {cat.icon} {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <AppInput label="Location" placeholder="e.g. Hooghly, West Bengal" value={newLocation} onChangeText={setNewLocation} />
          <AppInput label="WhatsApp Number" placeholder="10-digit number" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />

          <AppButton title="Publish Product" variant="primary" icon="checkmark-circle-outline" onPress={handleCreateListing} style={{ marginTop: spacing.md }} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Search Bar */}
          <View style={[styles.searchBarContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <Ionicons name="search-outline" size={20} color={theme.textMuted} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search crops, farmers or locations..."
              placeholderTextColor={theme.inputPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categories Tab */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={[
                    styles.tab,
                    { borderColor: theme.border },
                    activeCategory === cat.id && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                >
                  <Text style={[styles.tabText, { color: activeCategory === cat.id ? '#FFF' : theme.textSecondary }]}>
                    {cat.icon} {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Listings List */}
          <FlatList
            data={filteredListings}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <GradientCard style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardDetails}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.catBadge, { backgroundColor: theme.primary + '20' }]}>
                      <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[typography.caption, { color: theme.accent, fontWeight: '700' }]}>
                      {item.quantity}
                    </Text>
                  </View>

                  <Text style={[typography.h4, { color: theme.text, marginTop: 4 }]}>
                    {item.title}
                  </Text>

                  <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]}>
                    📍 {item.location}
                  </Text>

                  <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
                    👤 By {item.farmer}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={[typography.h3, { color: theme.text }]}>
                      {formatINR(item.price)} / {item.unit}
                    </Text>
                    <Pressable
                      onPress={() => handleContact(item.phone, item.title)}
                      style={[styles.contactBtn, { backgroundColor: '#25D366' }]}
                    >
                      <Ionicons name="logo-whatsapp" size={16} color="#FFF" style={{ marginRight: 4 }} />
                      <Text style={styles.contactBtnText}>Contact</Text>
                    </Pressable>
                  </View>
                </View>
              </GradientCard>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={theme.textMuted} />
                <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.sm }]}>
                  No active listings found in this category.
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: spacing.base, paddingBottom: 40 },
  formRow: { flexDirection: 'row', alignItems: 'flex-end' },
  unitSelector: {
    height: 52,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  categorySelectBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    height: 48,
    borderBottomWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  tabContainer: { marginVertical: spacing.sm },
  tabScroll: { paddingHorizontal: spacing.base },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginRight: 6,
  },
  tabText: { fontSize: 13, fontWeight: '600' },
  listContainer: { padding: spacing.base, paddingBottom: 60 },
  card: { padding: 0, marginBottom: spacing.base, flexDirection: 'row', overflow: 'hidden' },
  cardImage: { width: 110, height: 150 },
  cardDetails: { flex: 1, padding: spacing.md },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  contactBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
});
