import Constants from 'expo-constants'

export const getEnvironment = () => {
  const envFromExtra = Constants.expoConfig?.extra?.environment
  if (envFromExtra) return envFromExtra

  const envFromProcess = (process.env as any).EXPO_PUBLIC_ENVIRONMENT
  if (envFromProcess) return envFromProcess

  const releaseChannel = Constants.expoConfig?.extra?.eas?.channel
  if (releaseChannel) return releaseChannel

  return Constants.executionEnvironment === 'standalone'
    ? 'production'
    : 'development'
}
