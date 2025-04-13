// screens/AcercaDeScreen.js
import React from 'react';
import mercadoWeedImg from '../assets/mercadoWeed.png';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const AcercaDeScreen = () => {
  const appVersion = Constants.manifest?.version || '1.0.0';
  
  const handleContactPress = () => {
    Alert.alert(
      'Contacto',
      '¿Cómo deseas contactarnos?',
      [
        {
          text: 'Correo',
          onPress: () => Linking.openURL('mailto:contacto@dispensariosmedicos.com')
        },
        {
          text: 'Teléfono',
          onPress: () => Linking.openURL('tel:+1234567890')
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const handleTermsPress = () => {
    // Aquí podríamos navegar a una página de términos y condiciones
    Alert.alert('Términos y Condiciones', 'Aquí irían los términos y condiciones de la aplicación.');
  };

  const handlePrivacyPress = () => {
    // Aquí podríamos navegar a una página de política de privacidad
    Alert.alert('Política de Privacidad', 'Aquí iría la política de privacidad de la aplicación.');
  };

  const handleFAQPress = () => {
    // Aquí podríamos navegar a una página de preguntas frecuentes
    Alert.alert('Preguntas Frecuentes', 'Aquí irían las preguntas frecuentes de la aplicación.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={mercadoWeedImg}
          style={styles.logo}
        />
        <Text style={styles.appName}>Dispensarios Médicos</Text>
        <Text style={styles.appVersion}>Versión {appVersion}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de la aplicación</Text>
        <Text style={styles.sectionText}>
          Dispensarios Médicos es una aplicación que te permite encontrar y comprar productos medicinales de 
          diferentes dispensarios cercanos a tu ubicación. Nuestra misión es facilitar el acceso a 
          tratamientos medicinales de calidad y proporcionar una experiencia de compra segura y confiable.
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funcionalidades principales</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="leaf-outline" size={24} color="green" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Catálogo de dispensarios</Text>
            <Text style={styles.featureText}>
              Explora los diferentes dispensarios disponibles y encuentra el que mejor se adapte a tus necesidades.
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="map-outline" size={24} color="green" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Mapa interactivo</Text>
            <Text style={styles.featureText}>
              Visualiza los dispensarios cercanos a tu ubicación y encuentra la ruta más rápida para llegar a ellos.
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="cart-outline" size={24} color="green" style={styles.featureIcon} />
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Carrito de compras</Text>
            <Text style={styles.featureText}>
              Agrega productos de diferentes dispensarios a tu carrito y realiza tu compra de forma sencilla y segura.
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={handleContactPress}>
          <Ionicons name="mail-outline" size={24} color="green" />
          <Text style={styles.actionText}>Contacto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleTermsPress}>
          <Ionicons name="document-text-outline" size={24} color="green" />
          <Text style={styles.actionText}>Términos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handlePrivacyPress}>
          <Ionicons name="shield-checkmark-outline" size={24} color="green" />
          <Text style={styles.actionText}>Privacidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleFAQPress}>
          <Ionicons name="help-circle-outline" size={24} color="green" />
          <Text style={styles.actionText}>FAQ</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Dispensarios Médicos. Todos los derechos reservados.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AcercaDeScreen;