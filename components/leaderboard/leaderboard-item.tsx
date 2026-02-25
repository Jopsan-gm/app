import { View, Text, StyleSheet, Pressable } from 'react-native'
import { LeaderboardEntry } from '~types/leaderboard'
import Avatar from '@components/avatar'
import { COLORS } from '@utils/constansts/colors'
import { useRouter } from 'expo-router'

interface LeaderboardItemProps {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}

const getMedalEmoji = (rank: number): string => {
  switch (rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return ''
  }
}

export default function LeaderboardItem({
  entry,
  isCurrentUser,
}: LeaderboardItemProps) {
  const { rank, user, points } = entry
  const router = useRouter()
  const medal = getMedalEmoji(rank)

  const handlePress = () => {
    router.push(`/users/${user.id}`)
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        isCurrentUser && styles.currentUserContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.rankContainer}>
        {medal ? (
          <Text style={styles.medal}>{medal}</Text>
        ) : (
          <Text style={styles.rankText}>#{rank}</Text>
        )}
      </View>

      <Avatar user={user} size={48} goToUserDetails={false} />

      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
        {user.averageRating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐️ {user.averageRating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
        <Text style={styles.pointsLabel}>pts</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inactive_gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentUserContainer: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.raisin_black,
  },
  pressed: {
    opacity: 0.7,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray_400,
  },
  medal: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.gray_400,
  },
  pointsContainer: {
    alignItems: 'flex-end',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  pointsLabel: {
    fontSize: 12,
    color: COLORS.gray_400,
    marginTop: 2,
  },
})
