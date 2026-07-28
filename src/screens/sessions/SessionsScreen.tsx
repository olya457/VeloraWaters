import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Card, Empty, FadeIn, Header, Screen} from '../../components/UI';
import {fishingTips} from '../../data/content';
import {colors} from '../../constants/theme';
import {useApp} from '../../store/AppContext';
import {appAssets} from '../../assets/images';
export function SessionsScreen() {
  const {sessions, navigate} = useApp();
  const totalCatches = sessions.reduce(
    (sum, session) => sum + session.catches,
    0,
  );
  const measuredWeight = sessions.reduce(
    (sum, session) =>
      sum +
      (session.catchRecords?.reduce(
        (catchSum, record) => catchSum + (record.weightKg ?? 0),
        0,
      ) ?? 0),
    0,
  );
  return (
    <Screen>
      <Header
        eyebrow="Your logbook"
        title="Sessions"
        brandMark={appAssets.veloraWatersMark}
      />
      <FadeIn>
        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 TIP OF THE DAY</Text>
          <Text style={styles.tipText}>
            {fishingTips[new Date().getDate() % fishingTips.length]}
          </Text>
        </View>
        <Button
          title="▶  Start New Session"
          onPress={() => navigate('SessionBuilder')}
        />
      </FadeIn>
      {sessions.length > 0 && (
        <View style={styles.overview}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{sessions.length}</Text>
            <Text style={styles.metricLabel}>sessions</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{totalCatches}</Text>
            <Text style={styles.metricLabel}>catches</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{measuredWeight.toFixed(1)}</Text>
            <Text style={styles.metricLabel}>kg logged</Text>
          </View>
        </View>
      )}
      {sessions.length === 0 ? (
        <Empty
          icon="🎣"
          image={appAssets.veloraWatersMark}
          title="No sessions yet"
          text="Start your first fishing session to begin tracking catches, notes and your time on the water."
        />
      ) : (
        <>
          <Text style={styles.heading}>Recent Sessions</Text>
          {sessions.map(s => (
            <Card key={s.id} style={styles.sessionCard}>
              <View style={styles.row}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={styles.duration}>{s.duration}</Text>
              </View>
              <Text style={styles.location}>⌖ {s.location}</Text>
              <View style={styles.stats}>
                <Text style={styles.stat}>{s.catches} catches</Text>
                <Text style={styles.weight}>{s.weight}</Text>
              </View>
              {s.catchRecords?.length ? (
                <Text style={styles.species} numberOfLines={1}>
                  {Array.from(
                    new Set(s.catchRecords.map(record => record.species)),
                  ).join(' · ')}
                </Text>
              ) : null}
              {s.notes ? (
                <Text style={styles.notes} numberOfLines={2}>
                  “{s.notes}”
                </Text>
              ) : null}
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  tip: {
    backgroundColor: '#3A280E',
    borderWidth: 1,
    borderColor: '#68450D',
    padding: 15,
    borderRadius: 15,
    marginBottom: 14,
  },
  tipTitle: {fontSize: 10, color: colors.orange, fontWeight: '900'},
  tipText: {color: '#E3D2AE', fontSize: 12, lineHeight: 18, marginTop: 6},
  heading: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginVertical: 17,
  },
  overview: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.surface2,
    paddingVertical: 13,
  },
  metricValue: {color: colors.text, fontSize: 20, fontWeight: '900'},
  metricLabel: {color: colors.muted, fontSize: 10, marginTop: 3},
  sessionCard: {marginBottom: 12},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  name: {color: colors.text, fontWeight: '800', fontSize: 16},
  duration: {color: colors.blue, fontSize: 11, fontWeight: '700'},
  location: {color: colors.muted, marginTop: 6},
  stats: {flexDirection: 'row', gap: 18, marginTop: 14},
  stat: {color: colors.orange, fontWeight: '700'},
  weight: {color: colors.green, fontWeight: '800'},
  species: {color: colors.blue, marginTop: 11, fontSize: 12},
  notes: {
    color: colors.muted,
    marginTop: 9,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
