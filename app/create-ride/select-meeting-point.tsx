import { useRouter } from 'expo-router'
import { View } from 'react-native'
import 'react-native-get-random-values'
import { useContext } from 'react'
import { SelectLocationContext } from '@context/select-location'
import SafeScreen from '@components/safe-screen'
import MockPlacesAutocomplete from '@components/mock-places-autocomplete'
import { COLORS } from '@utils/constansts/colors'

export default function SelectMeetingPoint() {
  const router = useRouter()
  const { setMeetingPoint } = useContext(SelectLocationContext)

  return (
    <SafeScreen
      backgroundColor={COLORS.dark_gray}
      applyTopInset={false}
    >
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <MockPlacesAutocomplete
          placeholder={'¿Dónde recogerás a tus pasajeros?'}
          queryType={'establishment'}
          onPress={(location) => {
            setMeetingPoint(location)
            router.push('/create-ride/ride-overview')
          }}
        />
      </View>
    </SafeScreen>
  )
}
