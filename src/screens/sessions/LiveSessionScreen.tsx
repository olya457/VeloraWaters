import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Button, Card, Field, Header, Label, Screen} from '../../components/UI';
import {colors} from '../../constants/theme';
import {useApp} from '../../store/AppContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {CatchRecord} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveSession'>;

export function LiveSessionScreen({route}: Props) {
  const {back, navigate, addSession} = useApp();
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [catchRecords, setCatchRecords] = useState<CatchRecord[]>([]);
  const [loggingCatch, setLoggingCatch] = useState(false);
  const [species, setSpecies] = useState('');
  const [weight, setWeight] = useState('');
  const [catchNote, setCatchNote] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  useEffect(() => {
    if (paused) {
      return;
    }
    const id = setInterval(() => setSeconds(value => value + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);
  const time = new Date(seconds * 1000).toISOString().slice(11, 19);
  const totalWeight = catchRecords.reduce(
    (sum, record) => sum + (record.weightKg ?? 0),
    0,
  );
  const logCatch = () => {
    if (!species.trim()) {
      return;
    }
    const parsedWeight = Number.parseFloat(weight.replace(',', '.'));
    setCatchRecords(current => [
      {
        id: `${Date.now()}-${current.length}`,
        species: species.trim(),
        weightKg:
          Number.isFinite(parsedWeight) && parsedWeight > 0
            ? parsedWeight
            : undefined,
        note: catchNote.trim() || undefined,
      },
      ...current,
    ]);
    setSpecies('');
    setWeight('');
    setCatchNote('');
    setLoggingCatch(false);
  };
  const finish = () => {
    addSession({
      id: String(Date.now()),
      name: route.params.name || 'Fishing Session',
      location: route.params.location || 'Unknown',
      duration: time,
      catches: catchRecords.length,
      weight: `${totalWeight.toFixed(1)} kg`,
      notes: sessionNotes.trim() || undefined,
      catchRecords,
    });
    navigate('Main', {screen: 'Journal'});
  };
  return (
    <Screen>
      <Header
        eyebrow={route.params.location}
        title={route.params.name || 'Live Session'}
        onBack={back}
      />
      <View style={styles.live}>
        <Text style={styles.badge}>LIVE</Text>
        <Text style={styles.timer}>{time}</Text>
        <Text style={styles.meta}>
          {catchRecords.length} catches · {totalWeight.toFixed(1)} kg ·{' '}
          {route.params.weather}
        </Text>
      </View>
      <Button
        title={loggingCatch ? 'Close catch form' : '🎣 Log a Catch'}
        variant={loggingCatch ? 'secondary' : 'primary'}
        onPress={() => setLoggingCatch(value => !value)}
      />
      {loggingCatch && (
        <Card style={styles.catchForm}>
          <Text style={styles.formTitle}>NEW CATCH</Text>
          <Label>Species *</Label>
          <Field
            value={species}
            onChangeText={setSpecies}
            placeholder="Rainbow trout"
          />
          <Label>Weight (kg)</Label>
          <Field
            value={weight}
            onChangeText={setWeight}
            placeholder="1.4"
            keyboardType="decimal-pad"
          />
          <Label>Catch note</Label>
          <Field
            value={catchNote}
            onChangeText={setCatchNote}
            placeholder="Lure, depth or conditions…"
          />
          <View style={styles.formAction}>
            <Button
              title="Save catch"
              disabled={!species.trim()}
              onPress={logCatch}
            />
          </View>
        </Card>
      )}
      <Label>Session notes</Label>
      <Field
        value={sessionNotes}
        onChangeText={setSessionNotes}
        placeholder="Conditions, technique and observations…"
        multiline
      />
      <Label>Catches ({catchRecords.length})</Label>
      {catchRecords.length === 0 && (
        <Text style={styles.emptyCatches}>
          Your catch timeline will appear here.
        </Text>
      )}
      {catchRecords.map((record, index) => (
        <Card key={record.id} style={styles.catchCard}>
          <View style={styles.catchHeader}>
            <Text style={styles.catch}>🐟 {record.species}</Text>
            <Pressable
              onPress={() =>
                setCatchRecords(current =>
                  current.filter(item => item.id !== record.id),
                )
              }>
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          </View>
          <Text style={styles.catchMeta}>
            Catch #{catchRecords.length - index}
            {record.weightKg ? ` · ${record.weightKg.toFixed(1)} kg` : ''}
          </Text>
          {record.note && <Text style={styles.catchNote}>{record.note}</Text>}
        </Card>
      ))}
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button
            title={paused ? '▶ Resume' : 'Ⅱ Pause'}
            variant="secondary"
            onPress={() => setPaused(value => !value)}
          />
        </View>
        <View style={styles.flex}>
          <Button title="Finish ✓" variant="green" onPress={finish} />
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  live: {alignItems: 'center', marginVertical: 15},
  badge: {color: colors.green, fontWeight: '900', fontSize: 11},
  timer: {
    fontSize: 45,
    color: colors.text,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    marginVertical: 5,
  },
  meta: {color: colors.muted},
  row: {flexDirection: 'row', gap: 10, marginTop: 14},
  flex: {flex: 1},
  catchCard: {marginBottom: 8},
  catchForm: {marginTop: 12, borderColor: colors.orange},
  formTitle: {color: colors.orange, fontSize: 11, fontWeight: '900'},
  formAction: {marginTop: 14},
  catchHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  catch: {color: colors.text, fontWeight: '800'},
  catchMeta: {color: colors.muted, marginTop: 5, fontSize: 12},
  catchNote: {color: colors.text, marginTop: 8, lineHeight: 19},
  remove: {color: colors.red, fontSize: 11, fontWeight: '700'},
  emptyCatches: {
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 18,
  },
});
