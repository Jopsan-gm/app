import { useState, useEffect, useCallback, useMemo } from 'react'
import { FlatList, RefreshControl, ActivityIndicator, View, StyleSheet } from 'react-native'
import SafeScreen from '@components/safe-screen'
import LeaderboardItem from '@components/leaderboard/leaderboard-item'
import CurrentUserCard from '@components/leaderboard/current-user-card'
import EmptyLeaderboard from '@components/leaderboard/empty-leaderboard'
import ErrorLeaderboard from '@components/leaderboard/error-leaderboard'
import { getLeaderboard } from 'services/api/leaderboard'
import { useAuthStore } from 'store/useAuthStore'
import { LeaderboardData } from '~types/leaderboard'
import { COLORS } from '@utils/constansts/colors'
import { logger } from '@utils/logs'

export default function Leaderboard() {
  // Component-level state (no Zustand store needed)
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only use auth store to get current user ID
  const currentUserId = useAuthStore(state => state.user?.id)

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const leaderboard = await getLeaderboard()

      if (!leaderboard) {
        setError('No se pudo cargar el ranking. Por favor, intenta nuevamente.')
        logger.error('Leaderboard data is null', {
          action: 'fetch_leaderboard_null',
        })
        setData(null)
        return
      }

      setData(leaderboard)
      logger.info('Leaderboard loaded successfully', {
        action: 'fetch_leaderboard_success',
        metadata: { entries: leaderboard.entries.length },
      })
    } catch (err) {
      const errorMessage = 'Error al cargar el ranking. Verifica tu conexión.'
      setError(errorMessage)
      logger.error('Failed to load leaderboard', {
        action: 'fetch_leaderboard_failed',
        metadata: { error: String(err) },
      })
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchLeaderboard()
    setRefreshing(false)
  }, [])

  // Prepare display data: only top 10
  // MUST be called before any conditional returns (Rules of Hooks)
  const displayEntries = useMemo(() => {
    if (!data) return []
    return data.entries.slice(0, 10)
  }, [data])

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <SafeScreen applyTopInset={false} backgroundColor={COLORS.dark_gray}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      </SafeScreen>
    )
  }

  if (error) {
    return (
      <SafeScreen applyTopInset={false} backgroundColor={COLORS.dark_gray}>
        <ErrorLeaderboard onRetry={fetchLeaderboard} />
      </SafeScreen>
    )
  }

  if (!data || data.entries.length === 0) {
    return (
      <SafeScreen applyTopInset={false} backgroundColor={COLORS.dark_gray}>
        <EmptyLeaderboard />
      </SafeScreen>
    )
  }

  return (
    <SafeScreen applyTopInset={false} backgroundColor={COLORS.dark_gray}>
      <FlatList
        data={displayEntries}
        renderItem={({ item }) => (
          <LeaderboardItem
            entry={item}
            isCurrentUser={item.user.id === currentUserId}
          />
        )}
        keyExtractor={item => item.user.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.secondary}
            colors={[COLORS.secondary]}
          />
        }
        ListHeaderComponent={
          data.currentUser && data.currentUser.rank > 10 ? (
            <CurrentUserCard entry={data.currentUser} />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
})
