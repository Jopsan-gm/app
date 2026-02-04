import {
  getAuth,
  signInWithCredential,
  AppleAuthProvider,
  signOut,
} from '@react-native-firebase/auth'
import { Alert } from 'react-native'
import { socialLogin, UserNotFoundError } from 'services/api/auth'
import { User } from '~types/user'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useAuthStore } from 'store/useAuthStore'
import { router } from 'expo-router'

export const handleAppleLogin = async () => {
  const loginStore = useAuthStore.getState().login
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
    const { identityToken } = credential

    const appleCredential = AppleAuthProvider.credential(identityToken)
    try {
      const userCredential = await signInWithCredential(
        getAuth(),
        appleCredential,
      )

      console.log('userCredential', userCredential)
      const firebaseIdToken = await userCredential.user?.getIdToken()

      if (!firebaseIdToken) {
        throw new Error('No id token found')
      }

      const user: User = {
        id: userCredential.user?.uid || '',
        name: userCredential.user?.displayName || '',
        profilePicture: userCredential.user?.photoURL || '',
        email: userCredential.user?.email || '',
      }

      const setToken = useAuthStore.getState().setToken
      setToken(firebaseIdToken)

      try {
        const userResponse = await socialLogin({ user, token: firebaseIdToken })

        if (userResponse != null) {
          loginStore(userResponse, firebaseIdToken)
          Alert.alert('¡Bienvenido de vuelta!', 'Sesión iniciada exitosamente')
          router.replace('/')
        }
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          const auth = getAuth()
          await signOut(auth)
          const { logout } = useAuthStore.getState()
          logout()
          Alert.alert(
            'Cuenta no registrada',
            'Tu cuenta no está registrada en esta base de datos. Por favor, contacta a soporte técnico.',
          )
          return
        }
        throw error
      }
    } catch (error) {
      console.log('error', error)
    }
    // signed in
  } catch (e: any) {
    if (e.code === 'ERR_REQUEST_CANCELED') {
      // handle that the user canceled the sign-in flow
    } else {
      // handle other errors
    }
  }
}
