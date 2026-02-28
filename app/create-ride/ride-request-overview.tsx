import { useContext, useEffect, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Text, Alert, Pressable } from 'react-native'
import { isAfter } from '@formkit/tempo'
import { createRideRequest } from 'services/api/ride-request'
import { CreateRideRequestInput } from '~types/ride-request'
import { router } from 'expo-router'
import ActionButton from '@components/design-system/buttons/action-button'
import InteractiveModal from '@components/modal/interactive-modal'
import LocationCard from 'app/ride-navigation/components/location-card'
import MockMap from '@components/design-system/maps/mock-map'
import SchedulePill from '@components/create-ride-modal/schedule'

const TEN_MINUTES_MS = 10 * 60000

const getMinDate = () => new Date(Date.now() + TEN_MINUTES_MS)

export default function RideRequestOverview() {
  const { origin, destination, reset } = useContext(SelectLocationContext)
  const [date, setDate] = useState<Date>(getMinDate)
  const [minDate, setMinDate] = useState<Date>(getMinDate)
  const [isExpanded, setIsExpanded] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)

  const handleSearchRide = async () => {
    if (!origin || !destination) {
      return
    }

    const createRideRequestInput: CreateRideRequestInput = {
      origin,
      destination,
      departureDate: date,
    }

    const response = await createRideRequest(createRideRequestInput)
    if (!response) {
      return
    }

    Alert.alert(
      '¡Nueva búsqueda creada!',
      'Tu solicitud ha sido creada exitosamente',
      [
        {
          text: 'Continuar',
          onPress: () => {
            reset()
            router.push('/(tabs)')
          },
        },
      ],
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(getMinDate())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!origin || !destination) {
    return null
  }

  return (
    <View style={styles.container}>
      <MockMap origin={origin} destination={destination} />
      <InteractiveModal
        forceOpen={forceOpen}
        onStatusChange={(expanded) => {
          setIsExpanded(expanded)
          if (expanded) {
            setForceOpen(false)
          }
        }}
        AlwaysVisible={
          <LocationCard origin={origin} destination={destination} />
        }
        Content={
          <View style={styles.contentBody}>
            <SchedulePill
              date={date}
              minDate={minDate}
              isValid={isAfter(date, minDate)}
              setDate={setDate}
            />
            <Text style={styles.subtitle}>
              Selecciona fecha y hora de tu viaje
            </Text>
            <ActionButton
              text="Buscar viaje"
              type="primary"
              onPress={handleSearchRide}
            />
          </View>
        }
      />
      {!isExpanded && (
        <Pressable
          onPress={() => setForceOpen(true)}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.continueText}>Continuar</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentBody: {
    gap: 16,
  },
  subtitle: {
    color: COLORS.gray_400,
    fontSize: 14,
    textAlign: 'center',
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
