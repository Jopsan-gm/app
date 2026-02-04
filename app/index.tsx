import {
  FirebaseAuthTypes,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  signOut,
} from '@react-native-firebase/auth'
import { Redirect, router } from 'expo-router'
import { useEffect, useState, useRef } from 'react'
import { getUser } from 'services/api/user'
import { useBootstrap } from 'hooks/useBootstrap'
import { useAuthStore } from 'store/useAuthStore'
import { User } from '~types/user'
import { UserNotFoundError } from 'services/api/auth'
import { logger } from '@utils/logs'

export default function Index() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null)
  const { login } = useAuthStore()
  const { isLoading } = useBootstrap()
  const isLoggingOutRef = useRef(false)

  useEffect(() => {
    const auth = getAuth()
    const subscriber = onAuthStateChanged(auth, async (user) => {
      if (isLoggingOutRef.current) {
        return
      }
      setUser(user)
      setInitializing(false)
      if (!user) {
        return
      }
      const currentUser: User = {
        id: user?.uid ?? '',
        name: user?.displayName ?? '',
        profilePicture: user?.photoURL ?? '',
        email: user?.email ?? '',
      }
      const token = await getIdToken(user)
      if (!token) {
        return
      }

      try {
        const userResponse = await getUser(currentUser.id, token)
        if (!userResponse) {
          return
        }

        login(userResponse.user, token)
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          if (isLoggingOutRef.current) {
            return
          }
          isLoggingOutRef.current = true
          logger.info('User not found in database, signing out', {
            action: 'auto_logout_user_not_found',
            metadata: { userId: currentUser.id },
          })
          const auth = getAuth()
          await signOut(auth)
          const { logout } = useAuthStore.getState()
          logout()
          setUser(null)
          router.replace('/login')
        }
      }
    })

    return () => subscriber()
  }, [login])

  if (initializing || isLoading) {
    return null
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/(tabs)" />
}
