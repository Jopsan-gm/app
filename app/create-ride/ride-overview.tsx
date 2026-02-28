import { useContext, useEffect, useState } from 'react'
import { COLORS } from '@utils/constansts/colors'
import { createRide } from 'services/api/rides'
import { CreateRideRequest } from '~types/requests/ride'
import { isAfter } from '@formkit/tempo'
import { router } from 'expo-router'
import { SelectLocationContext } from '@context/select-location'
import { View, StyleSheet, Text, Alert, Pressable } from 'react-native'
import ActionButton from '@components/design-system/buttons/action-button'
import InteractiveModal from '@components/modal/interactive-modal'
import LocationCard from 'app/ride-navigation/components/location-card'
import MockMap from '@components/design-system/maps/mock-map'
import PassengersPill from '@components/create-ride-modal/passengers'
import PricePill from '@components/create-ride-modal/price'
import SchedulePill from '@components/create-ride-modal/schedule'

const MAX_PASSENGERS = 15
const TEN_MINUTES_MS = 10 * 60000

const getMinDate = () => new Date(Date.now() + TEN_MINUTES_MS)

export default function RideOverview() {
  const { origin, destination, meetingPoint, reset } = useContext(
    SelectLocationContext,
  )
  const [passengers, setPassengers] = useState<number>(3)
  const [date, setDate] = useState<Date>(getMinDate)
  const [price, setPrice] = useState('')
  const [minDate, setMinDate] = useState<Date>(getMinDate)
  const [isExpanded, setIsExpanded] = useState(false)
  const [forceOpen, setForceOpen] = useState(false)

  const handleMinusPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1)
    }
  }

  const handlePlusPassengers = () => {
    if (passengers < MAX_PASSENGERS) {
      setPassengers(passengers + 1)
    }
  }

  const onCreateRide = async () => {
    if (!origin || !destination || !meetingPoint) {
      return
    }

    const rideRequest: CreateRideRequest = {
      origin,
      destination,
      meetingPoint,
      availableSeats: passengers,
      price: parseInt(price),
      departureDate: date,
    }

    const ride = await createRide(rideRequest)
    if (!ride) {
      return
    }

    Alert.alert('¡Viaje creado!', 'Tu viaje ha sido publicado exitosamente', [
      {
        text: 'Continuar',
        onPress: () => {
          reset()
          router.replace('/(tabs)')
        },
      },
    ])
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDate(getMinDate())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const isValid = passengers > 0 && price !== '' && isAfter(date, minDate)

  if (!origin || !destination || !meetingPoint) {
    return <Text>Selecciona tu origen y destino</Text>
  }

  return (
    <View style={styles.container}>
      <MockMap
        origin={origin}
        destination={destination}
        meetingPoint={meetingPoint}
      />
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
            <PassengersPill
              passengers={passengers}
              handleMinus={handleMinusPassengers}
              handlePlus={handlePlusPassengers}
            />
            <SchedulePill
              date={date}
              minDate={minDate}
              isValid={isAfter(date, minDate)}
              setDate={setDate}
            />
            <PricePill
              price={price}
              handleChangePrice={setPrice}
              isValid={price !== ''}
            />
            <ActionButton
              onPress={onCreateRide}
              text="Crear viaje"
              type="primary"
              disabled={!isValid}
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
