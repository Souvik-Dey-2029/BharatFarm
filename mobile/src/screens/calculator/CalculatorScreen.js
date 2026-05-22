/**
 * Financial Suite - Calculator Screen
 * Includes Bigha/Katha/Acre converters, seed & fertilizer cost breakdowns, profit margin simulations.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import GradientCard from '../../components/GradientCard';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useThemeStore } from '../../store/themeStore';
import { typography, spacing, borderRadius } from '../../theme';
import { convertLand, formatINR } from '../../utils/helpers';

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
    if (!landValue.trim()) return;
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Financial Suite"
        subtitle="Precision land & cost calculators"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Land converter */}
        <GradientCard style={styles.card}>
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
            📏 Area Unit Converter
          </Text>

          <AppInput
            label="Land Size"
            placeholder="e.g. 5"
            value={landValue}
            onChangeText={setLandValue}
            keyboardType="numeric"
          />

          <Text style={[typography.bodySmall, { color: theme.textSecondary, marginBottom: 8, fontWeight: '600' }]}>
            Convert From Unit:
          </Text>
          <View style={styles.unitRow}>
            {['acre', 'bigha', 'katha'].map(unit => (
              <Pressable
                key={unit}
                onPress={() => setUnitFrom(unit)}
                style={[
                  styles.unitBtn,
                  { borderColor: theme.border },
                  unitFrom === unit && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
              >
                <Text style={{ color: unitFrom === unit ? '#FFF' : theme.text, fontWeight: '600' }}>
                  {unit.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {conversionResults && (
            <View style={[styles.resultsArea, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <View style={styles.resultItem}>
                <Text style={{ color: theme.textSecondary }}>Acres:</Text>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{conversionResults.acre}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={{ color: theme.textSecondary }}>Bighas:</Text>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{conversionResults.bigha}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={{ color: theme.textSecondary }}>Kathas:</Text>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{conversionResults.katha}</Text>
              </View>
            </View>
          )}
        </GradientCard>

        {/* Projections Suite */}
        <GradientCard style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
            💰 Yield & Profit Simulator
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
              <Text style={[typography.label, { color: theme.accent, marginTop: spacing.md }]}>
                Pro-Forma Expense Breakdown
              </Text>
              <View style={styles.projRow}>
                <Text style={{ color: theme.textSecondary }}>Required Seeds ({projection.seedQty} kg):</Text>
                <Text style={{ color: theme.text }}>{formatINR(projection.seedCost)}</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={{ color: theme.textSecondary }}>Fertilizers ({projection.fertilizerQty} kg):</Text>
                <Text style={{ color: theme.text }}>{formatINR(projection.fertilizerCost)}</Text>
              </View>
              <View style={[styles.projRow, { borderBottomWidth: 1, borderBottomColor: theme.divider, paddingBottom: 8 }]}>
                <Text style={{ color: theme.text, fontWeight: '600' }}>Total Input Expense:</Text>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{formatINR(projection.totalExpense)}</Text>
              </View>

              <Text style={[typography.label, { color: theme.primary, marginTop: spacing.md }]}>
                Yield & Revenue Estimation
              </Text>
              <View style={styles.projRow}>
                <Text style={{ color: theme.textSecondary }}>Expected Crop Yield:</Text>
                <Text style={{ color: theme.text }}>{projection.yieldQty} kg</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={{ color: theme.textSecondary }}>Assumed Market Price:</Text>
                <Text style={{ color: theme.text }}>{formatINR(projection.rate)} / kg</Text>
              </View>
              <View style={styles.projRow}>
                <Text style={{ color: theme.text, fontWeight: '600' }}>Expected Revenue:</Text>
                <Text style={{ color: theme.text, fontWeight: '700' }}>{formatINR(projection.expectedRevenue)}</Text>
              </View>

              <View style={[styles.profitCard, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}>
                <Text style={{ color: theme.primary, fontWeight: '700', fontSize: 13 }}>
                  SIMULATED NET PROFIT:
                </Text>
                <Text style={{ color: theme.primary, fontSize: 22, fontWeight: '800' }}>
                  {formatINR(projection.profit)}
                </Text>
              </View>
            </View>
          )}
        </GradientCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.base, paddingBottom: 60 },
  card: { padding: spacing.base },
  unitRow: { flexDirection: 'row', marginBottom: spacing.md },
  unitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  resultsArea: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  resultItem: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  projContainer: { marginTop: spacing.sm },
  projRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  profitCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.md,
  },
});
