import { StyleSheet, Text, View } from 'react-native'
import { Location } from '~types/location'
import { COLORS } from '@utils/constansts/colors'

interface MapImageProps {
  origin: Location
  destination: Location
  width?: number
  height?: number
}

export default function MockMapImage({
  height = 240,
}: MapImageProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.message}>The map will go here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray_600,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  message: {
    color: COLORS.white,
  },
})
