import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native'
import { useState, useRef } from 'react'
import { AppleIcon, GoogleIcon } from '@components/icons'
import { COLORS } from '@utils/constansts/colors'
import { Link } from 'expo-router'
import SafeScreen from '@components/safe-screen'
import SocialButton from '@components/buttons/social'
import { handleGoogleLogin } from 'services/auth/google'
import { handleAppleLogin } from 'services/auth/apple'
import Constants from 'expo-constants'
import { API_URL } from '@utils/constansts/api'
import { getEnvironment } from '@utils/environment'

const logo = require('../../assets/logo.png')

const environment = getEnvironment()
const appVersion = Constants.expoConfig?.version ?? 'unknown'

export default function Login() {
  const [tapCount, setTapCount] = useState(0)
  const tapTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleTermsAndConditions = () => {
    Linking.openURL('https://www.carpil.app/terms')
  }
  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.carpil.app/privacy')
  }

  const handleDebugInfoLongPress = () => {
    Alert.alert(
      'Información de Debug',
      `Ambiente: ${environment}\nAPI: ${API_URL}`,
      [{ text: 'OK' }],
    )
  }

  const handleDebugInfoPress = () => {
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current)
    }

    const newTapCount = tapCount + 1
    setTapCount(newTapCount)

    if (newTapCount === 2) {
      setTapCount(0)
      Alert.alert(
        'Información de Debug',
        `Versión: ${appVersion}\nAmbiente: ${environment}\nAPI: ${API_URL}`,
        [{ text: 'OK' }],
      )
    } else {
      tapTimeout.current = setTimeout(() => {
        setTapCount(0)
      }, 500)
    }
  }

  return (
    <SafeScreen backgroundColor={COLORS.dark_gray}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>¡Comienza la aventura!</Text>
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Al registrarte aceptas los{' '}
              <Text style={styles.termsLink} onPress={handleTermsAndConditions}>
                términos y condiciones
              </Text>{' '}
              y{' '}
              <Text style={styles.termsLink} onPress={handlePrivacyPolicy}>
                políticas de privacidad
              </Text>
            </Text>
          </View>
          <View style={styles.buttons}>
            <Link href={`/login/login-email`} asChild>
              <Pressable style={styles.button}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    padding: 5,
                    textAlign: 'center',
                  }}
                >
                  Continuar con correo electrónico
                </Text>
              </Pressable>
            </Link>
            <SocialButton
              text="Continuar con Google"
              icon={<GoogleIcon color={COLORS.white} />}
              onPress={async () => {
                await handleGoogleLogin()
              }}
            />
            {Platform.OS === 'ios' && (
              <SocialButton
                text="Continuar con Apple"
                icon={<AppleIcon color={COLORS.white} />}
                onPress={async () => {
                  await handleAppleLogin()
                }}
              />
            )}
          </View>
          <Link href="/signup" asChild>
            <Pressable>
              <Text style={styles.subtitle}>
                ¿No tienes una cuenta?{' '}
                <Text style={styles.link}>Regístrate</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
        <Pressable
          style={styles.debugContainer}
          onPress={handleDebugInfoPress}
          onLongPress={handleDebugInfoLongPress}
        >
          <Text style={styles.debugInfoText}>Versión {appVersion}</Text>
        </Pressable>
      </View>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: COLORS.primary,
  },
  buttons: {
    width: '100%',
    marginTop: 30,
    gap: 10,
  },
  button: {
    backgroundColor: COLORS.black,
    padding: 15,
    borderRadius: 5,
    width: '100%',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  debugInfoText: {
    color: COLORS.gray_400,
    fontSize: 12,
    textAlign: 'center',
  },
})
