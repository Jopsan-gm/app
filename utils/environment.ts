import Constants from 'expo-constants'

export const getEnvironment = () => {
  const envFromProcess = (process.env as any).EXPO_PUBLIC_ENVIRONMENT
  if (envFromProcess) return envFromProcess

  const envFromConstants = Constants.expoConfig?.extra?.environment
  if (envFromConstants) return envFromConstants

  const releaseChannel = Constants.expoConfig?.extra?.eas?.channel
  if (releaseChannel) return releaseChannel

  return Constants.executionEnvironment === 'standalone'
    ? 'production'
    : 'development'
}
