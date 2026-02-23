import { StyleSheet, Text, View } from 'react-native'
import { Location } from '~types/location'
import { COLORS } from '@utils/constansts/colors'

interface MapProps {
  origin: Location
  destination: Location
  meetingPoint?: Location
}

export default function MockMap({ origin, destination, meetingPoint }: MapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>The map will go here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: COLORS.white,
  },
})
