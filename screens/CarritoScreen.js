// screens/CarritoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente para el item del carrito
const CarritoItem = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.imagen }} 
        style={styles.itemImagen}
        resizeMode="cover"
      />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemNombre}>{item.nombre}</Text>
        <Text style={styles.itemPrecio}>${item.precio.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => onUpdateQuantity(item.id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            <Ionicons 
              name="remove" 
              size={16} 
              color={item.cantidad <= 1 ? '#ccc' : 'white'} 
            />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.cantidad}</Text>
          
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => onUpdateQuantity(item.id, item.cantidad + 1)}
          >
            <Ionicons name="add" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>${(item.precio * item.cantidad).toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.removeBtn}
          onPress={() => onRemove(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CarritoScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En un caso real, cargaríamos los items del carrito desde el estado global
    // Por ahora usaremos datos de ejemplo
    const fetchCartItems = () => {
      setTimeout(() => {
        // Datos de ejemplo
        const items = [
          {
            id: '1',
            nombre: 'Aceite CBD Premium',
            precio: 45.99,
            cantidad: 2,
            imagen: 'https://via.placeholder.com/150x150?text=CBD+Oil',
          },
          {
            id: '2',
            nombre: 'Bálsamo relajante',
            precio: 29.99,
            cantidad: 1,
            imagen: 'https://via.placeholder.com/150x150?text=Balm',
          },
          {
            id: '3',
            nombre: 'Gomitas relajantes',
            precio: 24.99,
            cantidad: 3,
            imagen: 'https://via.placeholder.com/150x150?text=Gummies',
          },
        ];
        
        setCartItems(items);
        setLoading(false);
      }, 500);
    };
    
    fetchCartItems();
  }, []);

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Eliminar producto',
      '¿Estás seguro de que deseas eliminar este producto del carrito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          onPress: () => {
            setCartItems(cartItems.filter(item => item.id !== itemId));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === itemId 
        ? { ...item, cantidad: newQuantity } 
        : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  const handleCheckout = () => {
    Alert.alert(
      'Procesar compra',
      '¿Deseas proceder con la compra?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => {
            // Aquí iría la lógica para procesar la compra
            Alert.alert('Compra exitosa', 'Tu pedido ha sido procesado correctamente.');
            setCartItems([]);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cart-outline" size={50} color="#ccc" />
        <Text style={styles.loadingText}>Cargando carrito...</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="cart-outline" size={80} color="#ccc" />
        <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
        <Text style={styles.emptyCartSubText}>Agrega productos de los dispensarios para comenzar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartTitle}>Mi Carrito</Text>
        <Text style={styles.itemCount}>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</Text>
      </View>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarritoItem 
            item={item} 
            onRemove={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío:</Text>
          <Text style={styles.summaryValue}>$5.00</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${(calculateTotal() + 5).toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Procesar Compra</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyCartText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyCartSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImagen: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrecio: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    backgroundColor: 'green',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  itemTotalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  removeBtn: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  checkoutButton: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CarritoScreen;