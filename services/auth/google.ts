import { Platform, Alert } from 'react-native'
import {
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import {
  isNoSavedCredentialFoundResponse,
  isSuccessResponse,
  OneTapResponse,
} from '@react-native-google-signin/google-signin'
import { GoogleOneTapSignIn } from '@react-native-google-signin/google-signin'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from '@react-native-firebase/auth'
import { User } from '~types/user'
import { useAuthStore } from 'store/useAuthStore'
import { socialLogin, UserNotFoundError } from 'services/api/auth'
import { router } from 'expo-router'

const handleSignInSuccess = async (idToken: string) => {
  const auth = getAuth()
  const googleCredential = GoogleAuthProvider.credential(idToken)
  await signInWithCredential(auth, googleCredential)

  const firebaseUser = auth.currentUser
  const firebaseIdToken = await firebaseUser?.getIdToken()

  if (!firebaseIdToken) {
    throw new Error('No id token found')
  }

  const user: User = {
    id: firebaseUser?.uid || '',
    name: firebaseUser?.displayName || '',
    profilePicture: firebaseUser?.photoURL || '',
    email: firebaseUser?.email || '',
  }

  const setToken = useAuthStore.getState().setToken
  setToken(firebaseIdToken)

  try {
    const loginStore = useAuthStore.getState().login
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
}

export const handleGoogleLogin = async () => {
  try {
    await GoogleOneTapSignIn.checkPlayServices()
    let response: OneTapResponse

    if (Platform.OS === 'ios') {
      response = await GoogleOneTapSignIn.presentExplicitSignIn()
    } else {
      response = await GoogleOneTapSignIn.signIn()

      if (isNoSavedCredentialFoundResponse(response)) {
        response = await GoogleOneTapSignIn.presentExplicitSignIn()
      }
    }

    if (isSuccessResponse(response)) {
      await handleSignInSuccess(response.data.idToken)
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.ONE_TAP_START_FAILED:
          try {
            const response = await GoogleOneTapSignIn.presentExplicitSignIn()
            if (isSuccessResponse(response)) {
              await handleSignInSuccess(response.data.idToken)
            }
          } catch (fallbackError) {
            console.error('Google Sign-In Fallback Error:', fallbackError)
          }
          break
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          break
        default:
      }
    } else {
      console.error('Google Sign-In Error:', error)
    }
  }
}
