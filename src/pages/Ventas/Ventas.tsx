import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonText,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonProgressBar,
  IonChip,
  IonNote,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/react';
import {
  addOutline,
  timeOutline,
  checkmarkCircleOutline,
  carOutline,
  cashOutline,
  alertCircleOutline,
  callOutline,
  locationOutline,
  createOutline,
  closeCircleOutline,
  arrowForwardOutline,
  cartOutline
} from 'ionicons/icons';
import { gestorService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Pedido, EstadoPedido } from '../../types';
import './Ventas.css';

const Ventas: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido | ''>('');
  const [notaEstado, setNotaEstado] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await gestorService.getMisPedidos();
      // Ordenar por fecha más reciente primero
      const sortedData = data.sort((a, b) => 
        new Date(b.fechaActualizacion).getTime() - new Date(a.fechaActualizacion).getTime()
      );
      setPedidos(sortedData);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setToastMessage('Error al cargar los pedidos');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadPedidos();
    event.detail.complete();
  };

  const getEstadoColor = (estado: EstadoPedido): string => {
    const colorMap: Record<EstadoPedido, string> = {
      'pendiente': 'warning',
      'coordinando': 'tertiary',
      'listo_entrega': 'secondary',
      'en_entrega': 'primary',
      'entregado_pago_recibido': 'success',
      'cerrado': 'medium',
      'cancelado': 'danger'
    };
    return colorMap[estado] || 'medium';
  };

  const getEstadoLabel = (estado: EstadoPedido): string => {
    const labelMap: Record<EstadoPedido, string> = {
      'pendiente': 'Pendiente',
      'coordinando': 'Coordinando',
      'listo_entrega': 'Listo para Entrega',
      'en_entrega': 'En Entrega',
      'entregado_pago_recibido': 'Entregado - Pago Recibido',
      'cerrado': 'Cerrado',
      'cancelado': 'Cancelado'
    };
    return labelMap[estado] || estado;
  };

  const getEstadoIcon = (estado: EstadoPedido): string => {
    const iconMap: Record<EstadoPedido, string> = {
      'pendiente': alertCircleOutline,
      'coordinando': timeOutline,
      'listo_entrega': checkmarkCircleOutline,
      'en_entrega': carOutline,
      'entregado_pago_recibido': cashOutline,
      'cerrado': checkmarkCircleOutline,
      'cancelado': closeCircleOutline
    };
    return iconMap[estado] || alertCircleOutline;
  };

  const getNextEstados = (estadoActual: EstadoPedido): EstadoPedido[] => {
    const flujoEstados: Record<EstadoPedido, EstadoPedido[]> = {
      'pendiente': ['coordinando', 'cancelado'],
      'coordinando': ['listo_entrega', 'cancelado'],
      'listo_entrega': ['en_entrega', 'cancelado'],
      'en_entrega': ['entregado_pago_recibido', 'cancelado'],
      'entregado_pago_recibido': ['cerrado'],
      'cerrado': [],
      'cancelado': []
    };
    return flujoEstados[estadoActual] || [];
  };

  const filterPedidos = () => {
    if (selectedSegment === 'todos') {
      return pedidos;
    }
    
    const filterMap: Record<string, EstadoPedido[]> = {
      'activos': ['pendiente', 'coordinando', 'listo_entrega', 'en_entrega'],
      'entregados': ['entregado_pago_recibido'],
      'finalizados': ['cerrado', 'cancelado']
    };
    
    const estadosToFilter = filterMap[selectedSegment] || [];
    return pedidos.filter(p => estadosToFilter.includes(p.estado));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const openUpdateModal = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setNuevoEstado('');
    setNotaEstado('');
    setShowUpdateModal(true);
  };

  const handleUpdateEstado = async () => {
    if (!selectedPedido || !nuevoEstado) return;

    try {
      await gestorService.actualizarEstadoPedido(selectedPedido.id, {
        estado: nuevoEstado,
        nota: notaEstado
      });
      
      await loadPedidos();
      setShowUpdateModal(false);
      setToastMessage('Estado actualizado exitosamente');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error al actualizar el estado');
      setShowToast(true);
    }
  };

  const handleCall = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleWhatsApp = (telefono: string, nombre: string) => {
    const message = encodeURIComponent(`Hola ${nombre}, soy ${user?.nombre} de VendeMax. Me comunico por tu pedido.`);
    window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getResumenEstados = () => {
    const resumen = {
      pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      enProceso: pedidos.filter(p => ['coordinando', 'listo_entrega', 'en_entrega'].includes(p.estado)).length,
      completados: pedidos.filter(p => p.estado === 'entregado_pago_recibido').length,
      total: pedidos.length
    };
    return resumen;
  };

  const resumen = getResumenEstados();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mis Ventas</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            value={selectedSegment} 
            onIonChange={e => setSelectedSegment(e.detail.value as string)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos ({resumen.total})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="activos">
              <IonLabel>Activos ({resumen.pendientes + resumen.enProceso})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="entregados">
              <IonLabel>Entregados ({resumen.completados})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finalizados">
              <IonLabel>Finalizados</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {!loading && filterPedidos().length === 0 && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon icon={cartOutline} size="large" color="medium" />
              <IonText>
                <h3>No hay pedidos en esta categoría</h3>
                <p>Los pedidos aparecerán aquí cuando generes ventas desde el catálogo.</p>
              </IonText>
              <IonButton routerLink="/catalogo" color="primary">
                Ir al Catálogo
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        <IonList>
          {filterPedidos().map((pedido) => (
            <IonCard key={pedido.id} className="pedido-card">
              <IonCardHeader>
                <div className="pedido-header">
                  <div>
                    <IonText>
                      <h2>{pedido.productoNombre}</h2>
                      <p className="pedido-id">Pedido #{pedido.id.slice(-6)}</p>
                    </IonText>
                  </div>
                  <IonChip color={getEstadoColor(pedido.estado)}>
                    <IonIcon icon={getEstadoIcon(pedido.estado)} />
                    <IonLabel>{getEstadoLabel(pedido.estado)}</IonLabel>
                  </IonChip>
                </div>
              </IonCardHeader>

              <IonCardContent>
                <div className="pedido-info">
                  <div className="info-row">
                    <IonIcon icon={cashOutline} color="success" />
                    <IonText>
                      <p>Total: <strong>{formatCurrency(pedido.precioTotal)}</strong></p>
                      <p className="comision">Tu comisión: {formatCurrency(pedido.comisionGestor)}</p>
                    </IonText>
                  </div>

                  <div className="info-row">
                    <IonIcon icon={locationOutline} color="primary" />
                    <IonText>
                      <p><strong>{pedido.cliente.nombre}</strong></p>
                      <p>{pedido.cliente.direccion}</p>
                    </IonText>
                  </div>

                  <div className="info-row">
                    <IonIcon icon={timeOutline} color="medium" />
                    <IonText>
                      <p>Actualizado: {formatDate(pedido.fechaActualizacion)}</p>
                    </IonText>
                  </div>

                  {pedido.cliente.notas && (
                    <div className="notas-cliente">
                      <IonNote>
                        <IonIcon icon={createOutline} /> {pedido.cliente.notas}
                      </IonNote>
                    </div>
                  )}
                </div>

                <IonAccordionGroup>
                  <IonAccordion value="historial">
                    <IonItem slot="header" color="light">
                      <IonLabel>Ver Historial de Estados</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                      {pedido.historialEstados.map((historial, index) => (
                        <div key={index} className="historial-item">
                          <IonChip color={getEstadoColor(historial.estado)}>
                            <IonLabel>{getEstadoLabel(historial.estado)}</IonLabel>
                          </IonChip>
                          <IonText>
                            <p>{formatDate(historial.fecha)}</p>
                            {historial.nota && <p className="nota">{historial.nota}</p>}
                          </IonText>
                        </div>
                      ))}
                    </div>
                  </IonAccordion>
                </IonAccordionGroup>

                <div className="action-buttons">
                  <IonButton 
                    size="small" 
                    fill="outline"
                    onClick={() => handleCall(pedido.cliente.telefono)}
                  >
                    <IonIcon slot="icon-only" icon={callOutline} />
                  </IonButton>
                  <IonButton 
                    size="small" 
                    fill="outline" 
                    color="success"
                    onClick={() => handleWhatsApp(pedido.cliente.telefono, pedido.cliente.nombre)}
                  >
                    WhatsApp
                  </IonButton>
                  {getNextEstados(pedido.estado).length > 0 && (
                    <IonButton 
                      size="small" 
                      expand="block"
                      onClick={() => openUpdateModal(pedido)}
                    >
                      Actualizar Estado
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal para actualizar estado */}
        <IonModal isOpen={showUpdateModal} onDidDismiss={() => setShowUpdateModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Actualizar Estado del Pedido</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowUpdateModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedPedido && (
              <div className="ion-padding">
                <IonCard>
                  <IonCardContent>
                    <IonText>
                      <h3>{selectedPedido.productoNombre}</h3>
                      <p>Cliente: {selectedPedido.cliente.nombre}</p>
                      <p>Estado actual: <IonChip color={getEstadoColor(selectedPedido.estado)}>
                        <IonLabel>{getEstadoLabel(selectedPedido.estado)}</IonLabel>
                      </IonChip></p>
                    </IonText>
                  </IonCardContent>
                </IonCard>

                <IonList>
                  <IonItem>
                    <IonLabel>Nuevo Estado</IonLabel>
                    <IonSelect 
                      value={nuevoEstado} 
                      onIonChange={e => setNuevoEstado(e.detail.value)}
                      placeholder="Selecciona un estado"
                    >
                      {getNextEstados(selectedPedido.estado).map(estado => (
                        <IonSelectOption key={estado} value={estado}>
                          {getEstadoLabel(estado)}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Nota (opcional)</IonLabel>
                    <IonTextarea
                      value={notaEstado}
                      onIonChange={e => setNotaEstado(e.detail.value!)}
                      rows={3}
                      placeholder="Añade una nota sobre este cambio..."
                    />
                  </IonItem>
                </IonList>

                <div className="ion-padding">
                  <IonButton 
                    expand="block" 
                    onClick={handleUpdateEstado}
                    disabled={!nuevoEstado}
                  >
                    Actualizar Estado
                  </IonButton>
                </div>
              </div>
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

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/catalogo">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Ventas;
