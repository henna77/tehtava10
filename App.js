import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Alert, Text, TextInput, Button } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function App() {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleFetch = () => {
    if (!address.trim()) {
      Alert.alert("Enter address");
      return;
    }

    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== 'OK' || !data.results?.length) {
          Alert.alert("Address not found");
          return;
        }

        const loc = data.results[0].geometry.location;

        setRegion({
          latitude: loc.lat,
          longitude: loc.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      })
      .catch(() => Alert.alert("Error fetching location"));
  };
    if (!region) {
    return <Text></Text>;
  }


  return (
    <View style={styles.container}>
      <MapView style={{
        width: '100%',
        height: '85%'
      }}
        region={region}>
        <Marker
          coordinate={region}
        />
      </MapView>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Show" onPress={handleFetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  }
});