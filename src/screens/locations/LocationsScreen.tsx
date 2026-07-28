import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {spotImages} from '../../assets/images';
import {appAssets} from '../../assets/images';
import {
  Button,
  Card,
  Chip,
  FadeIn,
  Field,
  Header,
  Screen,
} from '../../components/UI';
import {colors} from '../../constants/theme';
import {useApp} from '../../store/AppContext';
export function LocationsScreen() {
  const {spots, navigate, toggleSaved} = useApp();
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState('');
  const [comparing, setComparing] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const list = useMemo(
    () =>
      spots.filter(
        x =>
          (!saved || x.saved) &&
          `${x.name} ${x.region} ${x.species}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [spots, saved, query],
  );
  const compared = compareIds
    .map(id => spots.find(spot => spot.id === id))
    .filter((spot): spot is (typeof spots)[number] => Boolean(spot));
  const toggleComparison = (id: string) => {
    setCompareIds(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : current.length < 2
        ? [...current, id]
        : [current[1], id],
    );
  };
  const closeComparison = () => {
    setComparing(false);
    setCompareIds([]);
  };
  return (
    <Screen>
      <Header
        eyebrow="Find your spot"
        title="Locations"
        brandMark={appAssets.veloraWatersMark}
        right={
          <Pressable
            onPress={() => navigate('Settings')}
            style={styles.settings}>
            <Text>⚙</Text>
          </Pressable>
        }
      />
      <View style={styles.search}>
        <Field
          placeholder="Search locations, regions, fish…"
          value={query}
          onChangeText={setQuery}
          style={styles.flex}
        />
        <Pressable style={styles.add} onPress={() => navigate('WaterEditor')}>
          <Text style={styles.addText}>＋</Text>
        </Pressable>
      </View>
      <View style={styles.chips}>
        <Chip
          label="Scenic Spots"
          active={!saved}
          onPress={() => setSaved(false)}
        />
        <Chip
          label={`Saved (${spots.filter(x => x.saved).length})`}
          active={saved}
          onPress={() => setSaved(true)}
        />
        <Chip
          label={comparing ? 'Cancel compare' : 'Compare waters'}
          active={comparing}
          onPress={() => (comparing ? closeComparison() : setComparing(true))}
        />
      </View>
      {comparing && compared.length < 2 && (
        <Text style={styles.compareHint}>
          Select {2 - compared.length}{' '}
          {compared.length ? 'more water' : 'waters'} to compare
        </Text>
      )}
      {compared.length === 2 && (
        <Card style={styles.comparison}>
          <View style={styles.compareHeader}>
            <Text style={styles.compareTitle}>SIDE-BY-SIDE</Text>
            <Pressable onPress={() => setCompareIds([])}>
              <Text style={styles.reset}>Reset</Text>
            </Pressable>
          </View>
          <View style={styles.compareColumns}>
            {compared.map(spot => (
              <View key={spot.id} style={styles.compareColumn}>
                <Text style={styles.compareName}>{spot.name}</Text>
                <Text style={styles.compareLabel}>BEST WINDOW</Text>
                <Text style={styles.compareValue}>{spot.bestTime}</Text>
                <Text style={styles.compareLabel}>TARGETS</Text>
                <Text style={styles.compareValue}>
                  {spot.species.slice(0, 3).join(', ')}
                </Text>
                <Text style={styles.compareLabel}>AMENITIES</Text>
                <Text style={styles.compareValue}>
                  {spot.facilities.length || 'None listed'}
                </Text>
              </View>
            ))}
          </View>
          <Button
            title={`Open ${compared[0].name}`}
            variant="secondary"
            onPress={() => navigate('WaterDetails', {id: compared[0].id})}
          />
        </Card>
      )}
      {list.map((spot, i) => (
        <FadeIn key={spot.id} delay={i * 70}>
          <Pressable
            onPress={() =>
              comparing
                ? toggleComparison(spot.id)
                : navigate('WaterDetails', {id: spot.id})
            }
            style={[
              styles.spot,
              compareIds.includes(spot.id) && styles.spotSelected,
            ]}>
            {spot.photoUri || spotImages[spot.id] ? (
              <Image
                source={
                  spot.photoUri ? {uri: spot.photoUri} : spotImages[spot.id]
                }
                style={styles.photo}
              />
            ) : (
              <View style={[styles.photo, styles.emptyPhoto]}>
                <Text style={styles.emptyPhotoText}>No photo</Text>
              </View>
            )}
            <Pressable
              style={styles.bookmark}
              onPress={() => toggleSaved(spot.id)}>
              <Text>{spot.saved ? '★' : '☆'}</Text>
            </Pressable>
            {comparing && (
              <View
                style={[
                  styles.selectBadge,
                  compareIds.includes(spot.id) && styles.selectBadgeActive,
                ]}>
                <Text style={styles.selectText}>
                  {compareIds.includes(spot.id) ? '✓ Selected' : '＋ Compare'}
                </Text>
              </View>
            )}
            <View style={styles.body}>
              <Text style={styles.region}>⌖ {spot.region}</Text>
              <Text style={styles.name}>{spot.name}</Text>
              <Text style={styles.about} numberOfLines={2}>
                {spot.about}
              </Text>
              <View style={styles.chips}>
                {spot.species.slice(0, 3).map(x => (
                  <Chip key={x} label={x} />
                ))}
              </View>
            </View>
          </Pressable>
        </FadeIn>
      ))}
      {list.length === 0 && (
        <Card>
          <Text style={styles.empty}>No spots match your search.</Text>
          <Button
            title="Clear search"
            variant="secondary"
            onPress={() => setQuery('')}
          />
        </Card>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  flex: {flex: 1},
  settings: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {flexDirection: 'row', gap: 10},
  add: {
    width: 52,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {fontSize: 28, color: '#071724'},
  chips: {flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 14},
  compareHint: {
    color: colors.orange,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
  comparison: {marginTop: 16, borderColor: colors.orange},
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  compareTitle: {color: colors.orange, fontWeight: '900', fontSize: 11},
  reset: {color: colors.blue, fontWeight: '700'},
  compareColumns: {flexDirection: 'row', gap: 16, marginBottom: 16},
  compareColumn: {flex: 1},
  compareName: {color: colors.text, fontSize: 16, fontWeight: '900'},
  compareLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '900',
    marginTop: 12,
  },
  compareValue: {color: colors.text, fontSize: 12, marginTop: 3},
  spot: {
    marginTop: 18,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spotSelected: {borderColor: colors.orange, borderWidth: 2},
  photo: {width: '100%', height: 170},
  emptyPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },
  emptyPhotoText: {color: colors.muted, fontWeight: '700'},
  body: {padding: 16},
  bookmark: {
    position: 'absolute',
    right: 13,
    top: 13,
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBadge: {
    position: 'absolute',
    left: 13,
    top: 13,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  selectBadgeActive: {backgroundColor: colors.orange},
  selectText: {color: colors.text, fontWeight: '800', fontSize: 11},
  region: {color: colors.blue, fontSize: 12, fontWeight: '700'},
  name: {color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 5},
  about: {color: colors.muted, lineHeight: 20, marginTop: 6},
  empty: {color: colors.text, textAlign: 'center', marginBottom: 15},
});
