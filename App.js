// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar las pantallas
import DispensariosScreen from './screens/DispensariosScreen';
import MapaScreen from './screens/MapaScreen';
import CarritoScreen from './screens/CarritoScreen';
import AcercaDeScreen from './screens/AcercaDeScreen';
import DispensarioDetalleScreen from './screens/DispensarioDetalleScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Navegador de Stack para los dispensarios
const DispensariosStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dispensarios" 
        component={DispensariosScreen} 
        options={{ headerShown: true }}
      />
      <Stack.Screen 
        name="DispensarioDetalle" 
        component={DispensarioDetalleScreen} 
        options={({ route }) => ({ 
          title: route.params?.nombre || 'Dispensario',
          headerShown: true 
        })}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'DispensariosTab') {
              iconName = focused ? 'leaf' : 'leaf-outline';
            } else if (route.name === 'Mapa') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'AcercaDe') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="DispensariosTab" 
          component={DispensariosStack} 
          options={{ 
            headerShown: false,
            title: 'Dispensarios'
          }}
        />
        <Tab.Screen name="Mapa" component={MapaScreen} />
        <Tab.Screen name="Carrito" component={CarritoScreen} />
        <Tab.Screen 
          name="AcercaDe" 
          component={AcercaDeScreen}
          options={{ title: 'Acerca de' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}