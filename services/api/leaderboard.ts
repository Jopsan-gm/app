import { API_URL } from '@utils/constansts/api'
import { useAuthStore } from 'store/useAuthStore'
import { LeaderboardResponse } from '~types/responses/leaderboard'
import { logger } from '@utils/logs'
import { generateMockLeaderboard } from '@utils/mocks/leaderboard'

export const getLeaderboard = async () => {
  const token = useAuthStore.getState().token
  const userId = useAuthStore.getState().user?.id

  // TODO: Replace with real API when backend is ready
  // const response = await fetch(`${API_URL}/leaderboard`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   },
  // })
  //
  // if (!response.ok) {
  //   logger.error('Failed to fetch leaderboard', {
  //     action: 'get_leaderboard_failed',
  //     metadata: {
  //       status: response.status,
  //     },
  //   })
  //   return null
  // }
  //
  // const data = (await response.json()) as LeaderboardResponse
  // const { leaderboard } = data
  //
  // logger.info('Leaderboard fetched successfully', {
  //   action: 'get_leaderboard_success',
  //   metadata: {
  //     entries: leaderboard.entries.length,
  //   },
  // })
  //
  // return leaderboard

  // TEMPORARY: Return mock data
  await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay

  logger.info('Leaderboard fetched (mock data)', {
    action: 'get_leaderboard_mock',
    metadata: {
      userId,
    },
  })

  return generateMockLeaderboard(userId || '')
}
