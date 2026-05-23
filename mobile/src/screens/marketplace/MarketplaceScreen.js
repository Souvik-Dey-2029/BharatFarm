/**
 * KrishiMart Marketplace Screen
 * Farmer marketplace where users can browse listings, list crops for direct sale, upload photos,
 * use WhatsApp link integration, and filter by agricultural categories.
 * Upgraded to high-fidelity dark glassmorphic layout, glowing golden price indicators, and frosted forms.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable, Image, Alert, Linking, ScrollView, Dimensions, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import GradientCard from '../../components/GradientCard';
import AppInput from '../../components/AppInput';
import { useThemeStore } from '../../store/themeStore';
import { typography, spacing, borderRadius } from '../../theme';
import { formatINR } from '../../utils/helpers';

const { width } = Dimensions.get('window');

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
    { id: 'all', label: 'All Crops', icon: '🌾' },
    { id: 'vegetables', label: 'Vegetables', icon: '🥬' },
    { id: 'fruits', label: 'Fruits', icon: '🍎' },
    { id: 'grains', label: 'Grains', icon: '🌾' },
    { id: 'seeds', label: 'Seeds', icon: '🌱' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background ambient lighting */}
      <View style={styles.marketAmbientGlow} />

      <ScreenHeader
        title="KrishiMart"
        subtitle="Direct farmer-to-buyer trade"
        onBack={() => navigation.goBack()}
        rightIcon={isAdding ? "close-outline" : "add-circle-outline"}
        rightAction={() => setIsAdding(!isAdding)}
      />

      {isAdding ? (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.glassFormCard}>
            <Text style={styles.formTitle}>
              🆕 List Your Produce
            </Text>
            <Text style={styles.formSubtitle}>
              Directly advertise to wholesale bulk agricultural buyers
            </Text>

            <AppInput label="Product Title" placeholder="e.g. Organic Potatoes" value={newTitle} onChangeText={setNewTitle} />

            <View style={styles.formRow}>
              <View style={{ flex: 2, marginRight: 8 }}>
                <AppInput label="Price (₹)" placeholder="e.g. 40" value={newPrice} onChangeText={setNewPrice} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabelStyle}>Unit</Text>
                <Pressable
                  onPress={() => setNewUnit(newUnit === 'kg' ? 'quintal' : 'kg')}
                  style={styles.unitSelectorGlass}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{newUnit.toUpperCase()}</Text>
                </Pressable>
              </View>
            </View>

            <AppInput label="Available Quantity" placeholder="e.g. 500 kg / 2 tons" value={newQty} onChangeText={setNewQty} />

            <Text style={styles.inputLabelStyle}>Category</Text>
            <View style={styles.categoryRow}>
              {categories.slice(1).map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setNewCategory(cat.id)}
                  style={[
                    styles.categorySelectBtn,
                    newCategory === cat.id && styles.categorySelectBtnActive
                  ]}
                >
                  <Text style={{ color: newCategory === cat.id ? '#000000' : '#E8F5EC', fontWeight: '700', fontSize: 12 }}>
                    {cat.icon} {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <AppInput label="Location" placeholder="e.g. Hooghly, West Bengal" value={newLocation} onChangeText={setNewLocation} />
            <AppInput label="WhatsApp Number" placeholder="10-digit number" value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />

            <AppButton title="Publish Product" variant="primary" icon="checkmark-circle-outline" onPress={handleCreateListing} style={{ marginTop: spacing.md }} />
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Glowing Search Bar */}
          <View style={styles.searchBarGlass}>
            <Ionicons name="search-outline" size={18} color="#688E75" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search crops, farmers or locations..."
              placeholderTextColor="#688E75"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categories Frosted Horizontal Tab Row */}
          <View style={styles.tabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {categories.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={[
                    styles.tabGlass,
                    activeCategory === cat.id && styles.tabActiveStyle
                  ]}
                >
                  <Text style={[styles.tabText, { color: activeCategory === cat.id ? '#000000' : '#A2C2AC' }]}>
                    {cat.icon} {cat.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Listings Grid */}
          <FlatList
            data={filteredListings}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.listingCardGlass}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardDetails}>
                  <View style={styles.badgeRow}>
                    <View style={styles.catBadgeGlass}>
                      <Text style={styles.catBadgeText}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.quantityTag}>
                      {item.quantity}
                    </Text>
                  </View>

                  <Text style={styles.itemTitleText}>
                    {item.title}
                  </Text>

                  <Text style={styles.itemMetaText}>
                    📍 {item.location}
                  </Text>

                  <Text style={styles.itemFarmerText}>
                    👤 By {item.farmer}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>
                      {formatINR(item.price)} <Text style={styles.priceUnitText}>/ {item.unit}</Text>
                    </Text>
                    
                    <Pressable
                      onPress={() => handleContact(item.phone, item.title)}
                      style={({ pressed }) => [
                        styles.contactBtnStyle,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] }
                      ]}
                    >
                      <Ionicons name="logo-whatsapp" size={14} color="#000000" style={{ marginRight: 4 }} />
                      <Text style={styles.contactBtnText}>Contact</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={44} color="#688E75" />
                <Text style={{ color: '#688E75', marginTop: spacing.sm, fontSize: 13 }}>
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
  container: {
    flex: 1,
  },
  marketAmbientGlow: {
    position: 'absolute',
    top: 120,
    right: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.07)',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  glassFormCard: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#A2C2AC',
    marginBottom: 20,
    lineHeight: 16,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputLabelStyle: {
    fontSize: 12,
    color: '#A2C2AC',
    marginBottom: 8,
    fontWeight: '700',
  },
  unitSelectorGlass: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    marginBottom: spacing.base,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  categorySelectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    backgroundColor: 'transparent',
  },
  categorySelectBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  searchBarGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.15)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#E8F5EC',
  },
  tabContainer: {
    marginVertical: spacing.sm,
  },
  tabScroll: {
    paddingHorizontal: 20,
  },
  tabGlass: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    backgroundColor: 'rgba(12, 22, 14, 0.5)',
  },
  tabActiveStyle: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  listingCardGlass: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    marginBottom: spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 110,
    height: 154,
  },
  cardDetails: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catBadgeGlass: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
  },
  catBadgeText: {
    color: '#81C784',
    fontSize: 8,
    fontWeight: '800',
  },
  quantityTag: {
    fontSize: 11,
    color: '#FCD34D',
    fontWeight: '700',
  },
  itemTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  itemMetaText: {
    fontSize: 11,
    color: '#A2C2AC',
    marginTop: 2,
  },
  itemFarmerText: {
    fontSize: 10,
    color: '#688E75',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  priceUnitText: {
    fontSize: 11,
    color: '#A2C2AC',
    fontWeight: '500',
  },
  contactBtnStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  contactBtnText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
});
