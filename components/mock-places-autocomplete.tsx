import { useMemo, useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Location } from '~types/location'
import { COLORS } from '@utils/constansts/colors'
import { mockLocations } from '@utils/mocks/locations'

interface Props {
  placeholder: string
  queryType?: string
  onPress: (location: Location) => void
  onFail?: (error: unknown) => void
}

const matchesQuery = (location: Location, query: string): boolean => {
  const lower = query.toLowerCase()
  const primary = location.name.primary.toLowerCase()
  const secondary = location.name.secondary.toLowerCase()
  return primary.includes(lower) || secondary.includes(lower)
}

function MockPlaceRow({
  location,
  onPress,
}: {
  location: Location
  onPress: (location: Location) => void
}) {
  return (
    <Pressable
      onPress={() => onPress(location)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Text style={styles.primaryText}>{location.name.primary}</Text>
      <Text style={styles.secondaryText}>{location.name.secondary}</Text>
    </Pressable>
  )
}

export default function MockPlacesAutocomplete({
  placeholder,
  onPress,
}: Props) {
  const [query, setQuery] = useState('')

  const filteredLocations = useMemo(() => {
    const trimmed = query.trim()
    if (trimmed.length === 0) return mockLocations
    return mockLocations.filter((loc) => matchesQuery(loc, trimmed))
  }, [query])

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.secondary_gray_dark}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        style={styles.listView}
        renderItem={({ item }) => (
          <MockPlaceRow location={item} onPress={onPress} />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  textInput: {
    backgroundColor: COLORS.inactive_gray,
    color: COLORS.white,
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  listView: {
    backgroundColor: COLORS.dark_gray,
  },
  row: {
    flexDirection: 'column',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border_gray,
    paddingHorizontal: 12,
  },
  rowPressed: {
    backgroundColor: COLORS.inactive_gray,
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 22,
  },
  secondaryText: {
    color: COLORS.secondary_gray,
    fontSize: 12,
  },
})
