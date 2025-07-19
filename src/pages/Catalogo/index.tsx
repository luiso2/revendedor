import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonChip,
  IonButton,
  IonBadge,
  IonFab,
  IonFabButton,
  IonFabList,
  IonModal,
  IonItem,
  IonInput,
  IonTextarea,
  IonToast,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonImg,
  IonText
} from '@ionic/react';
import {
  heartOutline,
  heartSharp,
  shareOutline,
  cartOutline,
  filterOutline,
  cashOutline,
  starOutline,
  starSharp,
  closeOutline
} from 'ionicons/icons';
import { gestorService, categoriaService } from '../../services/mockData';
import { Producto } from '../../types';
import './Catalogo.css';

const Catalogo: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todos');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form fields for order
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteDireccion, setClienteDireccion] = useState('');
  const [clienteNotas, setClienteNotas] = useState('');
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [productos, searchText, selectedCategoria]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        gestorService.getProductos(),
        categoriaService.getCategorias()
      ]);
      setProductos(productosData);
      setCategorias(['todos', ...categoriasData]);
      // Load favoritos from localStorage
      const savedFavoritos = localStorage.getItem('favoritos');
      if (savedFavoritos) {
        setFavoritos(JSON.parse(savedFavoritos));
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = productos;
    
    if (searchText) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
        p.propietarioNombre.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (selectedCategoria !== 'todos') {
      filtered = filtered.filter(p => p.categoria === selectedCategoria);
    }
    
    setFilteredProductos(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const toggleFavorito = (productoId: string) => {
    const newFavoritos = favoritos.includes(productoId)
      ? favoritos.filter(id => id !== productoId)
      : [...favoritos, productoId];
    
    setFavoritos(newFavoritos);
    localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateComision = (producto: Producto) => {
    if (producto.tipoComision === 'porcentaje') {
      return (producto.precio * producto.comision / 100);
    }
    return producto.comision;
  };

  const handleShare = async (producto: Producto) => {
    const text = `¡Mira este producto increíble!\n\n${producto.nombre}\nPrecio: ${formatCurrency(producto.precio)}\n\n¿Te interesa? ¡Contáctame!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: producto.nombre,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(text);
      setToastMessage('Texto copiado al portapapeles');
      setShowToast(true);
    }
  };

  const openOrderModal = (producto: Producto) => {
    setSelectedProduct(producto);
    setShowOrderModal(true);
    // Reset form
    setClienteNombre('');
    setClienteTelefono('');
    setClienteDireccion('');
    setClienteNotas('');
    setCantidad(1);
  };

  const handleCreateOrder = async () => {
    if (!selectedProduct) return;
    
    try {
      const orderData = {
        productoId: selectedProduct.id,
        cantidad,
        cliente: {
          nombre: clienteNombre,
          telefono: clienteTelefono,
          direccion: clienteDireccion,
          notas: clienteNotas
        }
      };
      
      await gestorService.crearPedido(orderData);
      setToastMessage('¡Pedido creado exitosamente!');
      setShowToast(true);
      setShowOrderModal(false);
    } catch (error) {
      setToastMessage('Error al crear el pedido');
      setShowToast(true);
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'danger';
    if (stock < 5) return 'warning';
    return 'success';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Catálogo de Productos</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={filterOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar productos..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            scrollable 
            value={selectedCategoria} 
            onIonChange={e => setSelectedCategoria(e.detail.value as string)}
          >
            {categorias.map(categoria => (
              <IonSegmentButton key={categoria} value={categoria}>
                <IonLabel>{categoria}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        <IonGrid>
          <IonRow>
            {filteredProductos.map((producto) => (
              <IonCol size="12" sizeMd="6" sizeLg="4" key={producto.id}>
                <IonCard className="product-card">
                  <div className="product-image-container">
                    <IonImg 
                      src={producto.imagenes[0] || 'https://via.placeholder.com/300x200'} 
                      alt={producto.nombre}
                    />
                    <IonBadge 
                      color={getStockColor(producto.stock)} 
                      className="stock-badge"
                    >
                      {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin Stock'}
                    </IonBadge>
                    <IonButton
                      fill="clear"
                      className="favorite-button"
                      onClick={() => toggleFavorito(producto.id)}
                    >
                      <IonIcon 
                        slot="icon-only" 
                        icon={favoritos.includes(producto.id) ? heartSharp : heartOutline} 
                        color={favoritos.includes(producto.id) ? "danger" : "medium"}
                      />
                    </IonButton>
                  </div>
                  
                  <IonCardHeader>
                    <IonCardSubtitle>{producto.propietarioNombre}</IonCardSubtitle>
                    <IonCardTitle>{producto.nombre}</IonCardTitle>
                  </IonCardHeader>
                  
                  <IonCardContent>
                    <p className="product-description">{producto.descripcion}</p>
                    
                    <div className="price-section">
                      <div className="price">
                        <IonText color="primary">
                          <h2>{formatCurrency(producto.precio)}</h2>
                        </IonText>
                        <IonText color="medium">
                          <p>Precio al público</p>
                        </IonText>
                      </div>
                      <div className="commission">
                        <IonChip color="success">
                          <IonIcon icon={cashOutline} />
                          <IonLabel>
                            {formatCurrency(calculateComision(producto))}
                          </IonLabel>
                        </IonChip>
                        <IonText color="medium">
                          <p>Tu ganancia</p>
                        </IonText>
                      </div>
                    </div>
                    
                    <div className="action-buttons">
                      <IonButton 
                        expand="block" 
                        onClick={() => openOrderModal(producto)}
                        disabled={producto.stock === 0}
                      >
                        <IonIcon slot="start" icon={cartOutline} />
                        Generar Pedido
                      </IonButton>
                      <IonButton 
                        expand="block" 
                        fill="outline"
                        onClick={() => handleShare(producto)}
                      >
                        <IonIcon slot="start" icon={shareOutline} />
                        Compartir
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* Modal para crear pedido */}
        <IonModal isOpen={showOrderModal} onDidDismiss={() => setShowOrderModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Generar Orden de Pedido</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowOrderModal(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedProduct && (
              <>
                <IonCard>
                  <IonCardContent>
                    <IonText>
                      <h2>{selectedProduct.nombre}</h2>
                      <p>Precio unitario: {formatCurrency(selectedProduct.precio)}</p>
                      <p>Tu ganancia por unidad: {formatCurrency(calculateComision(selectedProduct))}</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>

                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Datos del Cliente</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonItem>
                      <IonLabel position="floating">Nombre del Cliente *</IonLabel>
                      <IonInput
                        value={clienteNombre}
                        onIonChange={e => setClienteNombre(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Teléfono *</IonLabel>
                      <IonInput
                        type="tel"
                        value={clienteTelefono}
                        onIonChange={e => setClienteTelefono(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Dirección de Entrega *</IonLabel>
                      <IonTextarea
                        value={clienteDireccion}
                        onIonChange={e => setClienteDireccion(e.detail.value!)}
                        rows={3}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Cantidad *</IonLabel>
                      <IonInput
                        type="number"
                        value={cantidad}
                        onIonChange={e => setCantidad(parseInt(e.detail.value!) || 1)}
                        min="1"
                        max={selectedProduct.stock}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Notas adicionales</IonLabel>
                      <IonTextarea
                        value={clienteNotas}
                        onIonChange={e => setClienteNotas(e.detail.value!)}
                        rows={3}
                      />
                    </IonItem>
                  </IonCardContent>
                </IonCard>

                <IonCard>
                  <IonCardContent>
                    <IonText className="ion-text-center">
                      <h3>Total del Pedido</h3>
                      <h2 color="primary">{formatCurrency(selectedProduct.precio * cantidad)}</h2>
                      <p>Tu ganancia total: <strong>{formatCurrency(calculateComision(selectedProduct) * cantidad)}</strong></p>
                    </IonText>
                  </IonCardContent>
                </IonCard>

                <div className="ion-padding">
                  <IonButton
                    expand="block"
                    onClick={handleCreateOrder}
                    disabled={!clienteNombre || !clienteTelefono || !clienteDireccion}
                  >
                    Crear Pedido
                  </IonButton>
                </div>
              </>
            )}
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default Catalogo;
