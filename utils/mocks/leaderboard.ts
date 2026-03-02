import { LeaderboardData, LeaderboardEntry } from '~types/leaderboard'
import { User } from '~types/user'

// Mock user names for realistic data
const mockNames = [
  'María González',
  'Carlos Rodríguez',
  'Ana Martínez',
  'Luis Fernández',
  'Carmen López',
  'José García',
  'Isabel Sánchez',
  'Miguel Pérez',
  'Laura Ramírez',
  'David Torres',
  'Patricia Flores',
  'Francisco Díaz',
  'Elena Ruiz',
  'Antonio Morales',
  'Rosa Jiménez',
  'Manuel Álvarez',
  'Lucía Castro',
  'Pedro Romero',
  'Marta Navarro',
  'Javier Ortiz',
  'Cristina Vargas',
  'Alejandro Ramos',
  'Sofía Medina',
  'Roberto Guerrero',
  'Andrea Molina',
  'Fernando Cortés',
  'Paula Herrera',
  'Diego Silva',
  'Beatriz Aguilar',
  'Alberto Reyes',
  'Natalia Vega',
  'Raúl Mendoza',
  'Claudia Campos',
  'Sergio Núñez',
  'Victoria Cruz',
  'Andrés Paredes',
  'Daniela Fuentes',
  'Pablo Carrillo',
  'Valeria Peña',
  'Óscar Guzmán',
  'Gabriela Rojas',
  'Hugo León',
  'Adriana Salazar',
  'Ricardo Mora',
  'Juliana Blanco',
  'Marcos Rivera',
  'Lorena Muñoz',
  'Sebastián Salas',
  'Carolina Escobar',
  'Tomás Suárez',
]

// Generate profile picture URL
const getProfilePicture = (seed: number): string => {
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
    'https://i.pravatar.cc/150?img=7',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9',
    'https://i.pravatar.cc/150?img=10',
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=13',
    'https://i.pravatar.cc/150?img=14',
    'https://i.pravatar.cc/150?img=15',
    'https://i.pravatar.cc/150?img=16',
    'https://i.pravatar.cc/150?img=17',
    'https://i.pravatar.cc/150?img=18',
    'https://i.pravatar.cc/150?img=19',
    'https://i.pravatar.cc/150?img=20',
  ]
  return avatars[seed % avatars.length]
}

// Generate points with exponential decay (top users have significantly more points)
const generatePoints = (rank: number): number => {
  // First place: ~5000 points
  // 10th place: ~2000 points
  // 50th place: ~500 points
  const basePoints = 5000
  const decayFactor = 0.92
  const points = Math.floor(basePoints * Math.pow(decayFactor, rank - 1))

  // Add some randomness (±5%)
  const variance = Math.floor(points * 0.05)
  const randomOffset = Math.floor(Math.random() * variance * 2) - variance

  return Math.max(100, points + randomOffset)
}

export const generateMockLeaderboard = (currentUserId: string): LeaderboardData => {
  const totalUsers = 50
  const entries: LeaderboardEntry[] = []

  // Determine current user's rank (random between 1-50)
  const currentUserRank = Math.floor(Math.random() * 50) + 1

  // Generate mock entries
  for (let i = 0; i < totalUsers; i++) {
    const rank = i + 1
    const isCurrentUser = rank === currentUserRank

    const user: User = {
      id: isCurrentUser ? currentUserId : `mock_user_${rank}`,
      name: isCurrentUser ? 'Tú' : mockNames[i % mockNames.length],
      profilePicture: getProfilePicture(i),
      averageRating: parseFloat((4.0 + Math.random()).toFixed(1)),
    }

    entries.push({
      rank,
      user,
      points: generatePoints(rank),
    })
  }

  // Sort by points descending to ensure correct order
  entries.sort((a, b) => b.points - a.points)

  // Reassign ranks after sorting
  entries.forEach((entry, index) => {
    entry.rank = index + 1
  })

  // Find current user entry
  const currentUserEntry = entries.find(entry => entry.user.id === currentUserId) || null

  return {
    entries,
    currentUser: currentUserEntry,
    totalParticipants: totalUsers,
    lastUpdated: new Date(),
  }
}
