import { User } from './user'

export interface LeaderboardEntry {
  rank: number
  user: User
  points: number
}

export interface LeaderboardData {
  entries: LeaderboardEntry[]
  currentUser: LeaderboardEntry | null
  totalParticipants: number
  lastUpdated: Date
}
