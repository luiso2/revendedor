import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonBadge,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonImg,
  IonText,
  IonList,
  IonAvatar,
  IonActionSheet,
  IonAlert,
  IonToggle
} from '@ionic/react';
import {
  addOutline,
  createOutline,
  trashOutline,
  ellipsisVerticalOutline,
  cubeOutline,
  cameraOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  alertCircleOutline,
  trendingUpOutline,
  trendingDownOutline,
  cashOutline
} from 'ionicons/icons';
import { propietarioService, categoriaService } from '../../services/mockData';
import { Producto } from '../../types';
import { formatCurrency } from '../../utils/currency';
import './Inventario.css';

const Inventario: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<'todos' | 'activo' | 'inactivo' | 'proximamente'>('todos');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form fields
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [comision, setComision] = useState('');
  const [tipoComision, setTipoComision] = useState<'porcentaje' | 'fijo'>('porcentaje');
  const [peso, setPeso] = useState('');
  const [dimensiones, setDimensiones] = useState('');
  const [estado, setEstado] = useState<'activo' | 'inactivo' | 'proximamente'>('activo');
  const [imagenes, setImagenes] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [productos, searchText, selectedEstado]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        propietarioService.getMisProductos(),
        categoriaService.getCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToastMessage('Error al cargar los productos');
      setShowToast(true);
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
        p.categoria.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(p => p.estado === selectedEstado);
    }

    setFilteredProductos(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const getEstadoColor = (estado: Producto['estado']) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      case 'proximamente':
        return 'warning';
      default:
        return 'medium';
    }
  };

  const getEstadoIcon = (estado: Producto['estado']) => {
    switch (estado) {
      case 'activo':
        return checkmarkCircleOutline;
      case 'inactivo':
        return closeCircleOutline;
      case 'proximamente':
        return alertCircleOutline;
      default:
        return cubeOutline;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'danger', text: 'Sin stock', icon: trendingDownOutline };
    if (stock < 5) return { color: 'warning', text: 'Stock bajo', icon: alertCircleOutline };
    return { color: 'success', text: 'En stock', icon: trendingUpOutline };
  };

  const openProductModal = (product?: Producto) => {
    if (product) {
      setEditingProduct(product);
      setNombre(product.nombre);
      setDescripcion(product.descripcion);
      setPrecio(product.precio.toString());
      setStock(product.stock.toString());
      setCategoria(product.categoria);
      setComision(product.comision.toString());
      setTipoComision(product.tipoComision);
      setPeso(product.peso?.toString() || '');
      setDimensiones(product.dimensiones || '');
      setEstado(product.estado);
      setImagenes(product.imagenes || []);
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setShowProductModal(true);
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setCategoria('');
    setComision('');
    setTipoComision('porcentaje');
    setPeso('');
    setDimensiones('');
    setEstado('activo');
    setImagenes([]);
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria,
        comision: parseFloat(comision),
        tipoComision,
        peso: peso ? parseFloat(peso) : undefined,
        dimensiones: dimensiones || undefined,
        estado,
        imagenes: imagenes.length > 0 ? imagenes : ['/images/default-product.jpg']
      };

      if (editingProduct) {
        await propietarioService.actualizarProducto(editingProduct.id, productData);
        setToastMessage('Producto actualizado exitosamente');
      } else {
        await propietarioService.crearProducto(productData);
        setToastMessage('Producto creado exitosamente');
      }

      setShowToast(true);
      setShowProductModal(false);
      await loadData();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setToastMessage('Error al guardar el producto');
      setShowToast(true);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await propietarioService.actualizarProducto(selectedProduct.id, { estado: 'inactivo' });
      setToastMessage('Producto eliminado exitosamente');
      setShowToast(true);
      setShowDeleteAlert(false);
      await loadData();
    } catch (error) {
      setToastMessage('Error al eliminar el producto');
      setShowToast(true);
    }
  };

  const handleImageUpload = () => {
    // Simulación de upload de imagen
    const newImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    setImagenes([...imagenes, newImageUrl]);
    setToastMessage('Imagen agregada exitosamente');
    setShowToast(true);
  };

  const removeImage = (index: number) => {
    const newImages = imagenes.filter((_, i) => i !== index);
    setImagenes(newImages);
  };

  const openActionSheet = (product: Producto) => {
    setSelectedProduct(product);
    setShowActionSheet(true);
  };

  const calculatePotentialEarnings = (producto: Producto) => {
    const gananciaUnitaria = producto.tipoComision === 'porcentaje'
      ? (producto.precio * producto.comision / 100)
      : producto.comision;
    return gananciaUnitaria * producto.stock;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gestión de Inventario</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => openProductModal()}>
              <IonIcon slot="icon-only" icon={addOutline} />
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
            value={selectedEstado}
            onIonChange={e => setSelectedEstado(e.detail.value as any)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="activo">
              <IonLabel>Activos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="inactivo">
              <IonLabel>Inactivos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="proximamente">
              <IonLabel>Próximamente</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {filteredProductos.length === 0 && !loading ? (
          <div className="empty-state">
            <IonIcon icon={cubeOutline} />
            <h2>No hay productos</h2>
            <p>Agrega tu primer producto para comenzar a vender</p>
            <IonButton onClick={() => openProductModal()}>
              <IonIcon slot="start" icon={addOutline} />
              Agregar Producto
            </IonButton>
          </div>
        ) : (
          <IonList>
            {filteredProductos.map((producto) => {
              const stockStatus = getStockStatus(producto.stock);
              return (
                <IonCard key={producto.id} className="product-item-card">
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="auto">
                          <IonAvatar className="product-avatar">
                            <img src={producto.imagenes[0] || 'https://via.placeholder.com/80'} alt={producto.nombre} />
                          </IonAvatar>
                        </IonCol>
                        <IonCol>
                          <div className="product-info">
                            <div className="product-header">
                              <h2>{producto.nombre}</h2>
                              <IonButton
                                fill="clear"
                                size="small"
                                onClick={() => openActionSheet(producto)}
                              >
                                <IonIcon slot="icon-only" icon={ellipsisVerticalOutline} />
                              </IonButton>
                            </div>
                            <p className="product-category">{producto.categoria}</p>
                            <p className="product-description">{producto.descripcion}</p>
                            
                            <div className="product-chips">
                              <IonChip color={getEstadoColor(producto.estado)}>
                                <IonIcon icon={getEstadoIcon(producto.estado)} />
                                <IonLabel>{producto.estado}</IonLabel>
                              </IonChip>
                              <IonChip color={stockStatus.color}>
                                <IonIcon icon={stockStatus.icon} />
                                <IonLabel>{producto.stock} unidades</IonLabel>
                              </IonChip>
                            </div>

                            <div className="product-metrics">
                              <div className="metric">
                                <IonText color="medium">
                                  <p>Precio</p>
                                </IonText>
                                <IonText>
                                  <h3>{formatCurrency(producto.precio)}</h3>
                                </IonText>
                              </div>
                              <div className="metric">
                                <IonText color="medium">
                                  <p>Comisión</p>
                                </IonText>
                                <IonText>
                                  <h3>
                                    {producto.tipoComision === 'porcentaje' 
                                      ? `${producto.comision}%` 
                                      : formatCurrency(producto.comision)}
                                  </h3>
                                </IonText>
                              </div>
                              <div className="metric">
                                <IonText color="medium">
                                  <p>Ganancia potencial</p>
                                </IonText>
                                <IonText color="success">
                                  <h3>{formatCurrency(calculatePotentialEarnings(producto))}</h3>
                                </IonText>
                              </div>
                            </div>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              );
            })}
          </IonList>
        )}

        {/* FAB para agregar producto */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => openProductModal()}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal para crear/editar producto */}
        <IonModal isOpen={showProductModal} onDidDismiss={() => setShowProductModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowProductModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Nombre del producto *</IonLabel>
              <IonInput
                value={nombre}
                onIonChange={e => setNombre(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Descripción *</IonLabel>
              <IonTextarea
                value={descripcion}
                onIonChange={e => setDescripcion(e.detail.value!)}
                rows={4}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Categoría *</IonLabel>
              <IonSelect
                value={categoria}
                onIonChange={e => setCategoria(e.detail.value)}
                interface="popover"
              >
                {categorias.map(cat => (
                  <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Precio ($) *</IonLabel>
              <IonInput
                type="number"
                value={precio}
                onIonChange={e => setPrecio(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Stock inicial *</IonLabel>
              <IonInput
                type="number"
                value={stock}
                onIonChange={e => setStock(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel>Tipo de comisión</IonLabel>
              <IonSelect
                value={tipoComision}
                onIonChange={e => setTipoComision(e.detail.value)}
                interface="popover"
              >
                <IonSelectOption value="porcentaje">Porcentaje</IonSelectOption>
                <IonSelectOption value="fijo">Monto fijo</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="floating">
                Comisión {tipoComision === 'porcentaje' ? '(%)' : '($)'} *
              </IonLabel>
              <IonInput
                type="number"
                value={comision}
                onIonChange={e => setComision(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Peso (kg)</IonLabel>
              <IonInput
                type="number"
                value={peso}
                onIonChange={e => setPeso(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Dimensiones</IonLabel>
              <IonInput
                value={dimensiones}
                onIonChange={e => setDimensiones(e.detail.value!)}
                placeholder="ej: 30cm x 20cm x 10cm"
              />
            </IonItem>

            <IonItem>
              <IonLabel>Estado del producto</IonLabel>
              <IonSelect
                value={estado}
                onIonChange={e => setEstado(e.detail.value)}
                interface="popover"
              >
                <IonSelectOption value="activo">Activo</IonSelectOption>
                <IonSelectOption value="inactivo">Inactivo</IonSelectOption>
                <IonSelectOption value="proximamente">Próximamente</IonSelectOption>
              </IonSelect>
            </IonItem>

            <div className="image-section">
              <h3>Imágenes del producto</h3>
              <div className="image-grid">
                {imagenes.map((img, index) => (
                  <div key={index} className="image-item">
                    <img src={img} alt={`Producto ${index + 1}`} />
                    <IonButton
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                ))}
                <IonButton
                  fill="outline"
                  className="add-image-btn"
                  onClick={handleImageUpload}
                >
                  <IonIcon icon={cameraOutline} />
                  <p>Agregar imagen</p>
                </IonButton>
              </div>
            </div>

            <IonButton
              expand="block"
              onClick={handleSaveProduct}
              disabled={!nombre || !descripcion || !precio || !stock || !categoria || !comision}
              className="save-button"
            >
              {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          buttons={[
            {
              text: 'Editar',
              icon: createOutline,
              handler: () => {
                if (selectedProduct) {
                  openProductModal(selectedProduct);
                }
              }
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              icon: trashOutline,
              handler: () => {
                setShowDeleteAlert(true);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />

        {/* Alert de confirmación de eliminación */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirmar eliminación'}
          message={`¿Estás seguro de que deseas eliminar "${selectedProduct?.nombre}"?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: handleDeleteProduct
            }
          ]}
        />

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

export default Inventario;
