// screens/DispensariosScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente de tarjeta para cada dispensario
const DispensarioCard = ({ dispensario, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
    >
      <Image 
        source={{ uri: dispensario.logo }} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{dispensario.nombre}</Text>
        <Text style={styles.descripcion}>{dispensario.descripcion}</Text>
        <Text style={styles.direccion}>
          <Ionicons name="location-outline" size={16} color="#666" />
          {' '}{dispensario.direccion}
        </Text>
        <View style={styles.calificacionContainer}>
          <Rating rating={dispensario.calificacion} />
          <Text style={styles.calificacionTexto}>
            ({parseFloat(dispensario.calificacion).toFixed(1)})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Componente para mostrar la calificación con estrellas
const Rating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    } else if (i === fullStars && halfStar) {
      stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
    } else {
      stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>;
};

const DispensariosScreen = ({ navigation }) => {
  const [dispensarios, setDispensarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDispensarios = async () => {
      try {
        // Reemplaza con la URL de tu servidor
        const response = await fetch('https://c888-2806-103e-1d-560c-e9f5-8a75-2720-441.ngrok-free.app/api_dispensarios.php');
        const data = await response.json();
        
        if (data.status === 'success') {
          setDispensarios(data.dispensarios);
        } else {
          setError('Error al cargar dispensarios: ' + data.message);
        }
      } catch (err) {
        setError('Error de conexión: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDispensarios();
  }, []);

  const handleDispensarioPress = (dispensario) => {
    navigation.navigate('DispensarioDetalle', dispensario);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>Cargando dispensarios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={50} color="red" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dispensarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DispensarioCard 
            dispensario={item} 
            onPress={() => handleDispensarioPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
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
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  direccion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calificacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  calificacionTexto: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default DispensariosScreen;