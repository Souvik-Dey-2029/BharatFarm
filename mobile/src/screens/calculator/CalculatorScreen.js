/**
 * Financial Suite - Calculator Screen
 * Includes Bigha/Katha/Acre converters, seed & fertilizer cost breakdowns, profit margin simulations.
 * Upgraded to high-fidelity dark glassmorphic styling, glowing selectors, and premium cost simulators.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Dimensions, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useThemeStore } from '../../store/themeStore';
import { typography, spacing, borderRadius } from '../../theme';
import { convertLand, formatINR } from '../../utils/helpers';

const { width } = Dimensions.get('window');

export default function CalculatorScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);

  // Conversions State
  const [landValue, setLandValue] = useState('');
  const [unitFrom, setUnitFrom] = useState('acre'); // 'acre' | 'bigha' | 'katha'

  // Projections State
  const [cropCost, setCropCost] = useState('Rice');
  const [bighasInput, setBighasInput] = useState('');

  // Projections Output
  const [projection, setProjection] = useState(null);

  const handleConvert = () => {
    if (!landValue.trim()) return null;
    const val = parseFloat(landValue);

    // Calculate conversions
    const acreVal = convertLand(val, unitFrom, 'acre');
    const bighaVal = convertLand(val, unitFrom, 'bigha');
    const kathaVal = convertLand(val, unitFrom, 'katha');

    return {
      acre: acreVal.toFixed(2),
      bigha: bighaVal.toFixed(2),
      katha: kathaVal.toFixed(2)
    };
  };

  const handleCalculateProjections = () => {
    if (!bighasInput.trim()) return;
    const land = parseFloat(bighasInput);

    // Projections mock calculation (derived from crops database)
    const seedQty = Math.round(land * 15); // kg per bigha
    const seedCost = seedQty * 45; // Rs per kg

    const fertilizerQty = Math.round(land * 25); // kg per bigha
    const fertilizerCost = fertilizerQty * 32; // Rs per kg

    const totalExpense = seedCost + fertilizerCost;

    const yieldQty = Math.round(land * 450); // kg yield
    const rate = cropCost === 'Rice' ? 22 : cropCost === 'Potato' ? 14 : 35;
    const expectedRevenue = yieldQty * rate;

    const profit = expectedRevenue - totalExpense;

    setProjection({
      seedQty,
      seedCost,
      fertilizerQty,
      fertilizerCost,
      totalExpense,
      yieldQty,
      rate,
      expectedRevenue,
      profit
    });
  };

  const conversionResults = handleConvert();

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background ambient lighting */}
      <View style={styles.calcAmbientGlow} />

      <ScreenHeader
        title="Financial Suite"
        subtitle="Precision land & cost calculators"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Area Unit Converter Glass */}
        <View style={styles.cardGlass}>
          <Text style={styles.cardHeading}>
            📏 Area Unit Converter
          </Text>
          <Text style={styles.cardSubText}>
            Instantly swap standard regional measurements
          </Text>

          <AppInput
            label="Land Size"
            placeholder="e.g. 5"
            value={landValue}
            onChangeText={setLandValue}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabelText}>
            Convert From Unit:
          </Text>
          <View style={styles.unitRow}>
            {['acre', 'bigha', 'katha'].map(unit => (
              <Pressable
                key={unit}
                onPress={() => setUnitFrom(unit)}
                style={[
                  styles.unitBtnGlass,
                  unitFrom === unit && styles.unitBtnActive
                ]}
              >
                <Text style={{ color: unitFrom === unit ? '#000000' : '#E8F5EC', fontWeight: '700', fontSize: 13 }}>
                  {unit.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {conversionResults && (
            <View style={styles.resultsAreaGlass}>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Acres:</Text>
                <Text style={styles.resultItemVal}>{conversionResults.acre}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Bighas:</Text>
                <Text style={styles.resultItemVal}>{conversionResults.bigha}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLabel}>Kathas:</Text>
                <Text style={styles.resultItemVal}>{conversionResults.katha}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Projections Suite Glass */}
        <View style={[styles.cardGlass, { marginTop: spacing.lg }]}>
          <Text style={styles.cardHeading}>
            💰 Yield & Profit Simulator
          </Text>
          <Text style={styles.cardSubText}>
            Simulate seasonal costs, projected yield, and expected market revenue
          </Text>

          <AppInput
            label="Primary Crop"
            placeholder="e.g. Rice, Wheat, Potato"
            value={cropCost}
            onChangeText={setCropCost}
          />

          <AppInput
            label="Land Size (Bighas)"
            placeholder="e.g. 3"
            value={bighasInput}
            onChangeText={setBighasInput}
            keyboardType="numeric"
          />

          <AppButton
            title="Calculate Cost Breakdown"
            variant="primary"
            icon="calculator-outline"
            onPress={handleCalculateProjections}
            style={{ marginTop: spacing.sm }}
            fullWidth
          />

          {projection && (
            <View style={styles.projContainer}>
              <Text style={styles.projHeadingAccent}>
                Expense Analysis
              </Text>
              <View style={styles.projRow}>
                <Text style={styles.projRowLabel}>Required Seeds ({projection.seedQty} kg):</Text>
                <Text style={styles.projRowValue}>{formatINR(projection.seedCost)}</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={styles.projRowLabel}>Fertilizers ({projection.fertilizerQty} kg):</Text>
                <Text style={styles.projRowValue}>{formatINR(projection.fertilizerCost)}</Text>
              </View>
              <View style={[styles.projRow, { borderBottomWidth: 1, borderBottomColor: 'rgba(76, 175, 80, 0.15)', paddingBottom: 8 }]}>
                <Text style={styles.projRowLabelBold}>Total Input Expense:</Text>
                <Text style={styles.projRowValueBold}>{formatINR(projection.totalExpense)}</Text>
              </View>

              <Text style={styles.projHeadingPrimary}>
                Yield & Revenue Estimation
              </Text>
              <View style={styles.projRow}>
                <Text style={styles.projRowLabel}>Expected Crop Yield:</Text>
                <Text style={styles.projRowValue}>{projection.yieldQty} kg</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={styles.projRowLabel}>Assumed Market Price:</Text>
                <Text style={styles.projRowValue}>{formatINR(projection.rate)} / kg</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={styles.projRowLabelBold}>Expected Revenue:</Text>
                <Text style={styles.projRowValueBold}>{formatINR(projection.expectedRevenue)}</Text>
              </View>

              <View style={styles.profitCardGlass}>
                <Text style={styles.profitCardLabel}>
                  SIMULATED NET PROFIT:
                </Text>
                <Text style={styles.profitCardValue}>
                  {formatINR(projection.profit)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calcAmbientGlow: {
    position: 'absolute',
    top: 80,
    left: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  cardGlass: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    padding: 20,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardSubText: {
    fontSize: 12,
    color: '#A2C2AC',
    marginBottom: 20,
    lineHeight: 16,
  },
  inputLabelText: {
    fontSize: 12,
    color: '#A2C2AC',
    marginBottom: 8,
    fontWeight: '700',
  },
  unitRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  unitBtnGlass: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 14, 0.5)',
  },
  unitBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  resultsAreaGlass: {
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  resultItemLabel: {
    color: '#A2C2AC',
    fontSize: 13,
  },
  resultItemVal: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  projContainer: {
    marginTop: spacing.sm,
  },
  projHeadingAccent: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FCD34D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  projHeadingPrimary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4CAF50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  projRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  projRowLabel: {
    color: '#A2C2AC',
    fontSize: 13,
  },
  projRowValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  projRowLabelBold: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  projRowValueBold: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  profitCardGlass: {
    padding: 16,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.35)',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  profitCardLabel: {
    color: '#4CAF50',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  profitCardValue: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
});
