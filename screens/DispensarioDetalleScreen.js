// screens/DispensarioDetalleScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente para ofertas del día
const OfertaCard = ({ oferta }) => {
  return (
    <View style={styles.ofertaCard}>
      <Image
        source={{ uri: oferta.imagen }}
        style={styles.ofertaImagen}
        resizeMode="cover"
      />
      <View style={styles.ofertaInfo}>
        <Text style={styles.ofertaTitulo}>{oferta.titulo}</Text>
        <Text style={styles.ofertaDescripcion}>{oferta.descripcion}</Text>
        <View style={styles.ofertaPrecioContainer}>
          <Text style={styles.ofertaPrecioOriginal}>${parseFloat(oferta.precio_original).toFixed(2)}</Text>
          <Text style={styles.ofertaPrecioDescuento}>${parseFloat(oferta.precio_descuento).toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

// Componente para productos
const ProductoCard = ({ producto, onAddToCart }) => {
  return (
    <TouchableOpacity 
      style={styles.productoCard}
      onPress={() => onAddToCart(producto)}
    >
      <Image
        source={{ uri: producto.imagen }}
        style={styles.productoImagen}
        resizeMode="cover"
      />
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{producto.nombre}</Text>
        <Text style={styles.productoDescripcion}>{producto.descripcion.length > 50 
          ? producto.descripcion.substring(0, 50) + '...' 
          : producto.descripcion}
        </Text>
        <Text style={styles.productoPrecio}>${parseFloat(producto.precio).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Modal para agregar productos al carrito
const AddToCartModal = ({ visible, producto, onClose, onAdd }) => {
  const [cantidad, setCantidad] = useState('1');

  const handleAdd = () => {
    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum < 1) {
      Alert.alert('Error', 'Por favor ingresa una cantidad válida');
      return;
    }
    onAdd(producto, cantidadNum);
    setCantidad('1');
    onClose();
  };

  if (!producto) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar al carrito</Text>
          <Image
            source={{ uri: producto.imagen }}
            style={styles.modalImagen}
            resizeMode="contain"
          />
          <Text style={styles.modalProductoNombre}>{producto.nombre}</Text>
          <Text style={styles.modalProductoPrecio}>${parseFloat(producto.precio).toFixed(2)}</Text>
          
          <View style={styles.cantidadContainer}>
            <Text style={styles.cantidadLabel}>Cantidad:</Text>
            <View style={styles.cantidadControls}>
              <TouchableOpacity 
                style={styles.cantidadBtn}
                onPress={() => {
                  const current = parseInt(cantidad);
                  if (!isNaN(current) && current > 1) {
                    setCantidad((current - 1).toString());
                  }
                }}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.cantidadInput}
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="number-pad"
              />
              
              <TouchableOpacity 
                style={styles.cantidadBtn}
                onPress={() => {
                  const current = parseInt(cantidad);
                  if (!isNaN(current)) {
                    setCantidad((current + 1).toString());
                  } else {
                    setCantidad('1');
                  }
                }}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.addButton]} 
              onPress={handleAdd}
            >
              <Text style={styles.buttonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const DispensarioDetalleScreen = ({ route, navigation }) => {
  const dispensarioBasico = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dispensario, setDispensario] = useState(null);
  const [promociones, setPromociones] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  useEffect(() => {
    const fetchDispensarioDetalle = async () => {
      try {
        setLoading(true);
        // Reemplaza con la URL de tu servidor
        const response = await fetch(`https://c888-2806-103e-1d-560c-e9f5-8a75-2720-441.ngrok-free.app/api_dispensario_detalle.php?id=${dispensarioBasico.id}`);
        const data = await response.json();
        
        if (data.status === 'success') {
          setDispensario(data.dispensario);
          setPromociones(data.promociones);
          setProductos(data.productos);
          
          // Formatear categorías para la UI
          const categoriasData = data.categorias.map(cat => ({
            id: cat.id,
            nombre: cat.nombre
          }));
          
          setCategorias(categoriasData);
          
          // Seleccionar la primera categoría por defecto
          if (categoriasData.length > 0) {
            setSelectedCategoria(categoriasData[0].id);
          }
        } else {
          setError('Error al cargar detalles: ' + data.message);
        }
      } catch (err) {
        setError('Error de conexión: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDispensarioDetalle();
  }, [dispensarioBasico.id]);

  const handleAddToCart = (producto) => {
    setSelectedProducto(producto);
    setModalVisible(true);
  };

  const addToCart = (producto, cantidad) => {
    // Aquí enviaríamos los datos al estado global del carrito
    // Por ahora solo mostraremos un mensaje
    Alert.alert(
      'Producto agregado',
      `Se agregaron ${cantidad} unidades de ${producto.nombre} al carrito.`,
      [{ text: 'OK' }]
    );
  };

  const filteredProductos = selectedCategoria
    ? productos.filter(p => p.categoria_id == selectedCategoria)
    : productos;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
        <Text style={styles.loadingText}>Cargando información del dispensario...</Text>
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

  if (!dispensario) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se encontró información del dispensario</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera con imagen del dispensario */}
      <View style={styles.header}>
        <Image
          source={{ uri: dispensario.banner }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.dispensarioInfo}>
          <Text style={styles.dispensarioNombre}>{dispensario.nombre}</Text>
          <View style={styles.direccionContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.direccion}>{dispensario.direccion}</Text>
          </View>
          
          {dispensario.telefono && (
            <View style={styles.contactoItem}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.contactoText}>{dispensario.telefono}</Text>
            </View>
          )}
          
          {dispensario.email && (
            <View style={styles.contactoItem}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={styles.contactoText}>{dispensario.email}</Text>
            </View>
          )}
          
          {dispensario.sitio_web && (
            <View style={styles.contactoItem}>
              <Ionicons name="globe-outline" size={16} color="#666" />
              <Text style={styles.contactoText}>{dispensario.sitio_web}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Sección de ofertas del día solo si hay promociones */}
      {promociones.length > 0 && (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Ofertas y Promos del Día</Text>
          <FlatList
            data={promociones}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <OfertaCard oferta={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ofertasContainer}
          />
        </View>
      )}

      {/* Categorías de productos */}
      {productos.length > 0 ? (
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Productos</Text>
          
          {categorias.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriasContainer}
            >
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.categoriaBtn,
                    selectedCategoria === categoria.id && styles.categoriaBtnActive
                  ]}
                  onPress={() => setSelectedCategoria(categoria.id)}
                >
                  <Text 
                    style={[
                      styles.categoriaText,
                      selectedCategoria === categoria.id && styles.categoriaTextActive
                    ]}
                  >
                    {categoria.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          
          <View style={styles.productosContainer}>
            {filteredProductos.length > 0 ? (
              filteredProductos.map((producto) => (
                <ProductoCard 
                  key={producto.id} 
                  producto={producto}
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <Text style={styles.noProductosText}>
                No hay productos disponibles en esta categoría
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.seccion}>
          <Text style={styles.noProductosText}>
            Este dispensario aún no tiene productos disponibles
          </Text>
        </View>
      )}

      {/* Modal para agregar al carrito */}
      <AddToCartModal
        visible={modalVisible}
        producto={selectedProducto}
        onClose={() => setModalVisible(false)}
        onAdd={addToCart}
      />
    </ScrollView>
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
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noProductosText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  dispensarioInfo: {
    padding: 16,
  },
  dispensarioNombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  direccionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  direccion: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  contactoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  seccion: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ofertasContainer: {
    paddingRight: 16,
  },
  ofertaCard: {
    width: 220,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  ofertaImagen: {
    width: '100%',
    height: 120,
  },
  ofertaInfo: {
    padding: 12,
  },
  ofertaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ofertaDescripcion: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ofertaPrecioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ofertaPrecioOriginal: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  ofertaPrecioDescuento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  categoriasContainer: {
    paddingBottom: 16,
  },
  categoriaBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  categoriaBtnActive: {
    backgroundColor: 'green',
  },
  categoriaText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoriaTextActive: {
    color: 'white',
  },
  productosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productoCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  productoImagen: {
    width: '100%',
    height: 120,
  },
  productoInfo: {
    padding: 12,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productoDescripcion: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalImagen: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  modalProductoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalProductoPrecio: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cantidadContainer: {
    width: '100%',
    marginBottom: 20,
  },
  cantidadLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cantidadControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidadBtn: {
    backgroundColor: 'green',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cantidadInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addButton: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DispensarioDetalleScreen;