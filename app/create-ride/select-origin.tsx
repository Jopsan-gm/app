import { useRouter } from 'expo-router'
import { View } from 'react-native'
import 'react-native-get-random-values'
import { useContext } from 'react'
import { SelectLocationContext } from '@context/select-location'
import SafeScreen from '@components/safe-screen'
import MockPlacesAutocomplete from '@components/mock-places-autocomplete'
import { COLORS } from '@utils/constansts/colors'
import ActionButton from '@components/design-system/buttons/action-button'

export default function SelectOrigin() {
  const router = useRouter()
  const { setOrigin, setDestination, setMeetingPoint } = useContext(
    SelectLocationContext,
  )

  const handleDebug = () => {
    const dummyLocation = {
      id: '1',
      name: { primary: 'San José', secondary: 'Costa Rica' },
      location: { lat: 9.9333, lng: -84.0833 },
    }
    setOrigin(dummyLocation)
    setDestination(dummyLocation)
    setMeetingPoint(dummyLocation)
    router.push('/create-ride/ride-overview')
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray} applyTopInset={false}>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <MockPlacesAutocomplete
          placeholder={'¿Desde dónde sales?'}
          onPress={(location) => {
            setOrigin(location)
            router.push('/create-ride/select-destination')
          }}
        />
        <ActionButton
          text="DEBUG: VER MAPA Y BOTÓN"
          onPress={handleDebug}
          type="secondary"
          style={{ marginTop: 20, marginHorizontal: 20 }}
        />
      </View>
    </SafeScreen>
  )
}
