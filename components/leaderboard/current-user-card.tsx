import { View, Text, StyleSheet } from 'react-native'
import { LeaderboardEntry } from '~types/leaderboard'
import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'

interface CurrentUserCardProps {
  entry: LeaderboardEntry
}

export default function CurrentUserCard({ entry }: CurrentUserCardProps) {
  const { rank, user, points } = entry

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tu Posición</Text>
        <Text style={styles.rankBadge}>#{rank}</Text>
      </View>

      <View style={styles.content}>
        <Avatar user={user} size={56} goToUserDetails={false} />

        <View style={styles.info}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.pointsRow}>
            <Text style={styles.pointsText}>{points.toLocaleString()} pts</Text>
            {user.averageRating !== undefined && (
              <Text style={styles.ratingText}>⭐️ {user.averageRating.toFixed(1)}</Text>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.subtitle}>
        {rank <= 10
          ? '¡Excelente! Estás en el top 10'
          : `${10 - rank > 0 ? 'Solo ' + Math.abs(10 - rank) : Math.abs(10 - rank)} posiciones para el top 10`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.secondary_dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  rankBadge: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    backgroundColor: COLORS.secondary_dark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.9,
  },
})
