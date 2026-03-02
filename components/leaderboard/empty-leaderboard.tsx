import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

export default function EmptyLeaderboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>No hay ranking disponible</Text>
      <Text style={styles.subtitle}>
        El ranking se actualizará pronto con las clasificaciones de los usuarios
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray_400,
    textAlign: 'center',
    lineHeight: 22,
  },
})
