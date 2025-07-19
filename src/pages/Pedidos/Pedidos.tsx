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
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonText,
  IonBadge,
  IonIcon,
  IonModal,
  IonButton,
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
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonSearchbar,
  IonAvatar
} from '@ionic/react';
import {
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
  cartOutline,
  personOutline,
  calendarOutline,
  cubeOutline
} from 'ionicons/icons';
import { propietarioService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Pedido, EstadoPedido } from '../../types';
import './Pedidos.css';

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<string>('todos');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido | ''>('');
  const [notaEstado, setNotaEstado] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchText, setSearchText] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const data = await propietarioService.getMisPedidos();
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
      'pendiente': 'danger',
      'coordinando': 'warning',
      'listo_entrega': 'secondary',
      'en_entrega': 'primary',
      'entregado_pago_recibido': 'success',
      'cerrado': 'medium',
      'cancelado': 'dark'
    };
    return colorMap[estado] || 'medium';
  };

  const getEstadoLabel = (estado: EstadoPedido): string => {
    const labelMap: Record<EstadoPedido, string> = {
      'pendiente': 'Nuevo Pedido',
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

  const getNextEstadosPropietario = (estadoActual: EstadoPedido): EstadoPedido[] => {
    // Los propietarios tienen un flujo diferente al actualizar estados
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
    let filtered = pedidos;

    // Filtrar por búsqueda
    if (searchText) {
      filtered = filtered.filter(p => 
        p.productoNombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.gestorNombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        p.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtrar por segmento
    if (selectedSegment === 'todos') {
      return filtered;
    }
    
    const filterMap: Record<string, EstadoPedido[]> = {
      'nuevos': ['pendiente'],
      'proceso': ['coordinando', 'listo_entrega', 'en_entrega'],
      'completados': ['entregado_pago_recibido'],
      'finalizados': ['cerrado', 'cancelado']
    };
    
    const estadosToFilter = filterMap[selectedSegment] || [];
    return filtered.filter(p => estadosToFilter.includes(p.estado));
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

  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PY', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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
      await propietarioService.actualizarEstadoPedido(selectedPedido.id, {
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

  const handleWhatsApp = (telefono: string, nombre: string, esGestor: boolean = false) => {
    const message = esGestor 
      ? encodeURIComponent(`Hola ${nombre}, te escribo por el pedido que registraste en VendeMax.`)
      : encodeURIComponent(`Hola ${nombre}, somos ${user?.nombre}. Nos comunicamos por tu pedido.`);
    window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getResumenEstados = () => {
    const resumen = {
      nuevos: pedidos.filter(p => p.estado === 'pendiente').length,
      enProceso: pedidos.filter(p => ['coordinando', 'listo_entrega', 'en_entrega'].includes(p.estado)).length,
      completados: pedidos.filter(p => p.estado === 'entregado_pago_recibido').length,
      total: pedidos.length
    };
    return resumen;
  };

  const calculateIngresos = (pedido: Pedido) => {
    return pedido.precioTotal - pedido.comisionGestor;
  };

  const resumen = getResumenEstados();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Pedidos Recibidos</IonTitle>
          {resumen.nuevos > 0 && (
            <IonBadge color="danger" slot="end">
              {resumen.nuevos} nuevos
            </IonBadge>
          )}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar por producto, gestor o cliente..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            scrollable
            value={selectedSegment} 
            onIonChange={e => setSelectedSegment(e.detail.value as string)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos ({resumen.total})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="nuevos">
              <IonLabel>Nuevos ({resumen.nuevos})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="proceso">
              <IonLabel>En Proceso ({resumen.enProceso})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="completados">
              <IonLabel>Completados ({resumen.completados})</IonLabel>
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
                <p>Los pedidos de tus gestores aparecerán aquí.</p>
              </IonText>
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
                  {/* Información del Gestor */}
                  <div className="section-title">
                    <IonIcon icon={personOutline} />
                    <span>Gestor</span>
                  </div>
                  <div className="info-row gestor-info">
                    <IonAvatar className="small-avatar">
                      <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt={pedido.gestorNombre} />
                    </IonAvatar>
                    <IonText>
                      <p><strong>{pedido.gestorNombre}</strong></p>
                      <p className="small-text">ID: {pedido.gestorId}</p>
                    </IonText>
                    <IonButton 
                      size="small" 
                      fill="clear" 
                      color="success"
                      onClick={() => handleWhatsApp('0981234567', pedido.gestorNombre, true)}
                    >
                      <IonIcon icon={callOutline} />
                    </IonButton>
                  </div>

                  {/* Información del Cliente */}
                  <div className="section-title">
                    <IonIcon icon={locationOutline} />
                    <span>Cliente Final</span>
                  </div>
                  <div className="info-row">
                    <IonText>
                      <p><strong>{pedido.cliente.nombre}</strong></p>
                      <p>{pedido.cliente.telefono}</p>
                      <p className="small-text">{pedido.cliente.direccion}</p>
                    </IonText>
                  </div>
                  {pedido.cliente.notas && (
                    <div className="notas-cliente">
                      <IonNote>
                        <IonIcon icon={createOutline} /> {pedido.cliente.notas}
                      </IonNote>
                    </div>
                  )}

                  {/* Información Financiera */}
                  <div className="section-title">
                    <IonIcon icon={cashOutline} />
                    <span>Detalles Financieros</span>
                  </div>
                  <div className="financial-info">
                    <div className="financial-row">
                      <span>Cantidad:</span>
                      <strong>{pedido.cantidad} unidades</strong>
                    </div>
                    <div className="financial-row">
                      <span>Precio Total:</span>
                      <strong>{formatCurrency(pedido.precioTotal)}</strong>
                    </div>
                    <div className="financial-row">
                      <span>Comisión Gestor:</span>
                      <strong className="commission">-{formatCurrency(pedido.comisionGestor)}</strong>
                    </div>
                    <div className="financial-row total">
                      <span>Tu Ingreso:</span>
                      <strong className="income">{formatCurrency(calculateIngresos(pedido))}</strong>
                    </div>
                  </div>

                  {/* Información de Producto */}
                  <div className="section-title">
                    <IonIcon icon={cubeOutline} />
                    <span>Producto</span>
                  </div>
                  <div className="info-row">
                    <IonText>
                      <p>SKU: {pedido.productoId}</p>
                      <p>Stock actual: Verificar en inventario</p>
                    </IonText>
                  </div>

                  {/* Fechas */}
                  <div className="section-title">
                    <IonIcon icon={calendarOutline} />
                    <span>Timeline</span>
                  </div>
                  <div className="info-row">
                    <IonText>
                      <p>Creado: {formatFullDate(pedido.fechaCreacion)}</p>
                      <p>Última actualización: {formatDate(pedido.fechaActualizacion)}</p>
                    </IonText>
                  </div>
                </div>

                <IonAccordionGroup>
                  <IonAccordion value="historial">
                    <IonItem slot="header" color="light">
                      <IonLabel>Ver Historial Completo</IonLabel>
                    </IonItem>
                    <div className="ion-padding" slot="content">
                      {pedido.historialEstados.map((historial, index) => (
                        <div key={index} className="historial-item">
                          <IonChip color={getEstadoColor(historial.estado)}>
                            <IonLabel>{getEstadoLabel(historial.estado)}</IonLabel>
                          </IonChip>
                          <IonText>
                            <p>{formatFullDate(historial.fecha)}</p>
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
                    <IonIcon slot="start" icon={callOutline} />
                    Llamar Cliente
                  </IonButton>
                  <IonButton 
                    size="small" 
                    fill="outline" 
                    color="success"
                    onClick={() => handleWhatsApp(pedido.cliente.telefono, pedido.cliente.nombre)}
                  >
                    WhatsApp Cliente
                  </IonButton>
                  {getNextEstadosPropietario(pedido.estado).length > 0 && (
                    <IonButton 
                      size="small" 
                      expand="block"
                      color="primary"
                      onClick={() => openUpdateModal(pedido)}
                    >
                      Actualizar Estado
                      <IonIcon slot="end" icon={arrowForwardOutline} />
                    </IonButton>
                  )}
                </div>

                {/* Notas internas */}
                {pedido.notasInternas && (
                  <IonCard color="warning" className="internal-notes">
                    <IonCardContent>
                      <IonText>
                        <p><strong>Notas internas:</strong></p>
                        <p>{pedido.notasInternas}</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                )}
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
                      <p>Gestor: {selectedPedido.gestorNombre}</p>
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
                      {getNextEstadosPropietario(selectedPedido.estado).map(estado => (
                        <IonSelectOption key={estado} value={estado}>
                          {getEstadoLabel(estado)}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Nota para el gestor</IonLabel>
                    <IonTextarea
                      value={notaEstado}
                      onIonChange={e => setNotaEstado(e.detail.value!)}
                      rows={3}
                      placeholder="Esta nota será visible para el gestor..."
                    />
                  </IonItem>
                </IonList>

                <IonCard color="light">
                  <IonCardContent>
                    <IonText color="medium">
                      <p><strong>Sugerencias según el estado:</strong></p>
                      {nuevoEstado === 'coordinando' && <p>• Contacta al gestor para coordinar la entrega</p>}
                      {nuevoEstado === 'listo_entrega' && <p>• Confirma que el producto está empacado y listo</p>}
                      {nuevoEstado === 'en_entrega' && <p>• Registra quién está realizando la entrega</p>}
                      {nuevoEstado === 'entregado_pago_recibido' && <p>• Confirma que recibiste el pago del gestor</p>}
                      {nuevoEstado === 'cancelado' && <p>• Explica el motivo de la cancelación</p>}
                    </IonText>
                  </IonCardContent>
                </IonCard>

                <div className="ion-padding">
                  <IonButton 
                    expand="block" 
                    onClick={handleUpdateEstado}
                    disabled={!nuevoEstado}
                  >
                    Confirmar Actualización
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
      </IonContent>
    </IonPage>
  );
};

export default Pedidos;
