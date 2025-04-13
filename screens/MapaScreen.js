// screens/MapaScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import MarkerIcon from '../assets/smokemarker.png';  

const { width, height } = Dimensions.get('window');

const MapaScreen = ({ navigation }) => {
  // Ajustar las coordenadas iniciales según tu ubicación objetivo (estas son para Morelia, México)
  const [region, setRegion] = useState({
    latitude: 19.7028,
    longitude: -101.1924,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [dispensarios, setDispensarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [selectedDispensario, setSelectedDispensario] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');

        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.log('Error al obtener ubicación:', error);
        // Si hay error, mantenemos la ubicación por defecto
      }
    };

    const fetchDispensarios = async () => {
      try {
        // Llamada a la API para obtener los dispensarios
        const response = await fetch('https://c888-2806-103e-1d-560c-e9f5-8a75-2720-441.ngrok-free.app/api_dispensarios_mapa.php');
        const data = await response.json();
        
        if (data.status === 'success') {
          setDispensarios(data.dispensarios);
          
          // Si no hay ubicación del usuario, centrar el mapa en el primer dispensario
          if (!locationPermission && data.dispensarios.length > 0) {
            const firstDispensario = data.dispensarios[0];
            setRegion({
              latitude: firstDispensario.latitude,
              longitude: firstDispensario.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        } else {
          setError(data.message || 'Error al cargar dispensarios');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar ambas funciones
    fetchLocation();
    fetchDispensarios();
  }, []);

  const goToUserLocation = async () => {
    if (locationPermission) {
      setLoading(true);
      try {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener tu ubicación actual');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert(
        'Permiso denegado',
        'Para usar esta función, necesitas conceder permisos de ubicación en la configuración de tu dispositivo.'
      );
    }
  };

  const handleMarkerPress = (dispensario) => {
    setSelectedDispensario(dispensario);
  };

  const handleCalloutPress = (dispensario) => {
    navigation.navigate('DispensariosTab', {
      screen: 'DispensarioDetalle',
      params: dispensario
    });
  };



  const CustomMarker = ({ dispensario, onPress }) => {
    return (
      <View style={styles.customMarker}>
        <View style={styles.markerIconContainer}>
          <Ionicons name="medkit-outline" size={22} color="white" />
        </View>
        <View style={styles.markerLogoContainer}>
          <Image
            source={{ uri: dispensario.logo }}
            style={styles.markerLogo}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Intentar cargar datos nuevamente
            fetch('https://c888-2806-103e-1d-560c-e9f5-8a75-2720-441.ngrok-free.app/api_dispensarios_mapa.php')
              .then(response => response.json())
              .then(data => {
                if (data.status === 'success') {
                  setDispensarios(data.dispensarios);
                } else {
                  setError(data.message || 'Error al cargar dispensarios');
                }
              })
              .catch(err => {
                setError('Error de conexión al servidor');
                console.error(err);
              })
              .finally(() => setLoading(false));
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Aquí los marcadores */}
        {dispensarios.map((dispensario) => (
          <Marker
            key={dispensario.id}
            coordinate={{
              latitude: dispensario.latitude,
              longitude: dispensario.longitude,
            }}
            title={dispensario.nombre}
            description={dispensario.direccion}
            onPress={() => handleMarkerPress(dispensario)}
            anchor={{x: 0.5, y: 0.5}} // Centrar el marcador en la coordenada
          >
            <View style={{
              // Eliminar cualquier restricción innecesaria
              width: selectedDispensario && selectedDispensario.id === dispensario.id ? 70 : 45,
              height: selectedDispensario && selectedDispensario.id === dispensario.id ? 70 : 45,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible' // Asegura que el contenido no sea recortado
            }}>
              <Image 
                source={MarkerIcon} 
                style={{
                  width: selectedDispensario && selectedDispensario.id === dispensario.id ? 60 : 40,
                  height: selectedDispensario && selectedDispensario.id === dispensario.id ? 60 : 40,
                  resizeMode: 'contain' // Importante para mantener proporciones sin cortar
                }}
              />
            </View>
            <Callout
              tooltip
              onPress={() => handleCalloutPress(dispensario)}
            >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{dispensario.nombre}</Text>
                <Text style={styles.calloutDescription} numberOfLines={2}>
                  {dispensario.descripcion}
                </Text>
                <Text style={styles.calloutAddress}>
                  <Ionicons name="location-outline" size={12} color="#666" />
                  {' '}{dispensario.direccion}
                </Text>
                <Text style={styles.calloutAction}>Tocar para ver detalles</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Botón para centrar en la ubicación del usuario */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={goToUserLocation}
        disabled={!locationPermission}
      >
        <Ionicons
          name="locate"
          size={24}
          color={locationPermission ? 'green' : '#ccc'}
        />
      </TouchableOpacity>

      {/* Panel informativo del dispensario seleccionado */}
      {selectedDispensario && (
        <TouchableOpacity
          style={styles.infoPanel}
          onPress={() => navigation.navigate('DispensariosTab', {
            screen: 'DispensarioDetalle',
            params: selectedDispensario
          })}
        >

          <Image
            source={{ uri: selectedDispensario.logo }}
            style={styles.infoPanelImage}
          />
          <View style={styles.infoPanelContent}>
            <Text style={styles.infoPanelTitle}>{selectedDispensario.nombre}</Text>
            <Text style={styles.infoPanelAddress}>
              <Ionicons name="location-outline" size={14} color="#666" />
              {' '}{selectedDispensario.direccion}
            </Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={
                    star <= Math.floor(selectedDispensario.calificacion)
                      ? 'star'
                      : star === Math.ceil(selectedDispensario.calificacion) &&
                        selectedDispensario.calificacion % 1 >= 0.5
                      ? 'star-half'
                      : 'star-outline'
                  }
                  size={16}
                  color="#FFD700"
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text style={styles.ratingText}>
                ({selectedDispensario.calificacion.toFixed(1)})
              </Text>
            </View>
          </View>
          <View style={styles.infoPanelAction}>
            <Text style={styles.infoPanelActionText}>Ver detalle</Text>
            <Ionicons name="chevron-forward" size={20} color="green" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    padding: 0,
  },
  selectedMarkerContainer: {
    borderColor: 'green',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerBackground: {
    backgroundColor: 'green',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'white',
  },
  markerWrapper: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 0,
    borderWidth: 0,
    borderColor: 'green',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedMarkerWrapper: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'green',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 0,
  },
  markerImage: {
    width: 25,
    height: 25,
  },
  selectedMarkerImage: {
    width: 35,
    height: 35,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerIconContainer: {
    backgroundColor: 'green',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerLogoContainer: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'green',
    padding: 0,
  },
  markerLogo: {
    width: 20,
    height: 20,
    borderRadius: 0,
  },
  calloutContainer: {
    width: 200,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  calloutAction: {
    fontSize: 12,
    color: 'green',
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  locationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoPanelImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoPanelContent: {
    flex: 1,
  },
  infoPanelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  infoPanelAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  infoPanelAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoPanelActionText: {
    fontSize: 14,
    color: 'green',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default MapaScreen;