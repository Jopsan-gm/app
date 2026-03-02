import { View, Text, StyleSheet, Pressable } from 'react-native'
import { COLORS } from '@utils/constansts/colors'

interface ErrorLeaderboardProps {
  onRetry: () => void
}

export default function ErrorLeaderboard({ onRetry }: ErrorLeaderboardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>Error al cargar el ranking</Text>
      <Text style={styles.subtitle}>
        No se pudo cargar la información del ranking. Por favor, verifica tu conexión e intenta nuevamente.
      </Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Reintentar</Text>
      </Pressable>
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
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
})
