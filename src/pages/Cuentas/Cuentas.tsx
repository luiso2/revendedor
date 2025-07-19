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
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonProgressBar,
  IonChip,
  IonAvatar,
  IonModal,
  IonCheckbox,
  IonToast,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonAccordion,
  IonAccordionGroup,
  IonNote
} from '@ionic/react';
import {
  cashOutline,
  checkmarkCircleOutline,
  timeOutline,
  personOutline,
  callOutline,
  documentTextOutline,
  alertCircleOutline,
  walletOutline,
  trendingUpOutline,
  checkmarkDoneOutline,
  calendarOutline,
  receiptOutline
} from 'ionicons/icons';
import { propietarioService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { GestorVentas, Pedido } from '../../types';
import './Cuentas.css';

interface CuentaGestor {
  gestor: GestorVentas;
  pedidosPendientesPago: Pedido[];
  montoTotal: number;
}

const Cuentas: React.FC = () => {
  const [cuentas, setCuentas] = useState<CuentaGestor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCuenta, setSelectedCuenta] = useState<CuentaGestor | null>(null);
  const [selectedPedidos, setSelectedPedidos] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadCuentas();
  }, []);

  const loadCuentas = async () => {
    setLoading(true);
    try {
      const data = await propietarioService.getCuentasPorGestor();
      setCuentas(data);
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
      setToastMessage('Error al cargar las cuentas');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadCuentas();
    event.detail.complete();
  };

  const filterCuentas = (): CuentaGestor[] => {
    let filtered = cuentas;

    // Filtrar por búsqueda
    if (searchText) {
      filtered = filtered.filter(cuenta =>
        cuenta.gestor.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        cuenta.gestor.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtrar por estado
    switch (selectedFilter) {
      case 'pendientes':
        return filtered.filter(c => c.montoTotal > 0);
      case 'saldados':
        return filtered.filter(c => c.montoTotal === 0);
      default:
        return filtered;
    }
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
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-PY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const calculateTotalPendiente = (): number => {
    return cuentas.reduce((total, cuenta) => total + cuenta.montoTotal, 0);
  };

  const calculateTotalGestores = (): number => {
    return cuentas.filter(c => c.montoTotal > 0).length;
  };

  const openPaymentModal = (cuenta: CuentaGestor) => {
    setSelectedCuenta(cuenta);
    setSelectedPedidos([]);
    setShowPaymentModal(true);
  };

  const handlePedidoSelection = (pedidoId: string) => {
    setSelectedPedidos(prev => {
      if (prev.includes(pedidoId)) {
        return prev.filter(id => id !== pedidoId);
      }
      return [...prev, pedidoId];
    });
  };

  const handleSelectAll = () => {
    if (selectedCuenta) {
      if (selectedPedidos.length === selectedCuenta.pedidosPendientesPago.length) {
        setSelectedPedidos([]);
      } else {
        setSelectedPedidos(selectedCuenta.pedidosPendientesPago.map(p => p.id));
      }
    }
  };

  const calculateSelectedTotal = (): number => {
    if (!selectedCuenta) return 0;
    
    return selectedCuenta.pedidosPendientesPago
      .filter(p => selectedPedidos.includes(p.id))
      .reduce((total, pedido) => total + (pedido.precioTotal - pedido.comisionGestor), 0);
  };

  const handleConfirmPayment = async () => {
    if (!selectedCuenta || selectedPedidos.length === 0) return;

    try {
      await propietarioService.marcarPagoRecibido(selectedCuenta.gestor.id, selectedPedidos);
      
      setShowPaymentModal(false);
      setToastMessage('Pago registrado exitosamente');
      setShowToast(true);
      
      // Recargar cuentas
      await loadCuentas();
    } catch (error) {
      setToastMessage('Error al registrar el pago');
      setShowToast(true);
    }
  };

  const handleCall = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleWhatsApp = (telefono: string, nombre: string) => {
    const message = encodeURIComponent(`Hola ${nombre}, te escribo para coordinar el pago de las comisiones pendientes en VendeMax.`);
    window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getResumenGeneral = () => {
    const totalPedidos = cuentas.reduce((sum, c) => sum + c.pedidosPendientesPago.length, 0);
    const oldestPedido = cuentas
      .flatMap(c => c.pedidosPendientesPago)
      .sort((a, b) => new Date(a.fechaActualizacion).getTime() - new Date(b.fechaActualizacion).getTime())[0];

    return {
      totalPendiente: calculateTotalPendiente(),
      gestoresConDeuda: calculateTotalGestores(),
      pedidosPendientes: totalPedidos,
      diasMasAntiguo: oldestPedido 
        ? Math.floor((new Date().getTime() - new Date(oldestPedido.fechaActualizacion).getTime()) / (1000 * 60 * 60 * 24))
        : 0
    };
  };

  const resumen = getResumenGeneral();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Estado de Cuentas</IonTitle>
          {resumen.gestoresConDeuda > 0 && (
            <IonBadge color="warning" slot="end">
              {resumen.gestoresConDeuda} pendientes
            </IonBadge>
          )}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar gestor..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            value={selectedFilter} 
            onIonChange={e => setSelectedFilter(e.detail.value as string)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pendientes">
              <IonLabel>Con Saldo</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="saldados">
              <IonLabel>Saldados</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {/* Resumen General */}
        <IonCard className="summary-card">
          <IonCardHeader>
            <IonCardTitle>Resumen General</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={walletOutline} color="primary" />
                    <IonText>
                      <p>Total por Recibir</p>
                      <h3>{formatCurrency(resumen.totalPendiente)}</h3>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={personOutline} color="warning" />
                    <IonText>
                      <p>Gestores con Deuda</p>
                      <h3>{resumen.gestoresConDeuda}</h3>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={receiptOutline} color="tertiary" />
                    <IonText>
                      <p>Pedidos Pendientes</p>
                      <h3>{resumen.pedidosPendientes}</h3>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={timeOutline} color="danger" />
                    <IonText>
                      <p>Días Más Antiguo</p>
                      <h3>{resumen.diasMasAntiguo}</h3>
                    </IonText>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Lista de Cuentas por Gestor */}
        <IonList>
          {filterCuentas().map((cuenta) => (
            <IonCard key={cuenta.gestor.id} className="cuenta-card">
              <IonCardHeader>
                <div className="cuenta-header">
                  <div className="gestor-info">
                    <IonAvatar>
                      <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt={cuenta.gestor.nombre} />
                    </IonAvatar>
                    <div>
                      <IonText>
                        <h2>{cuenta.gestor.nombre}</h2>
                        <p>{cuenta.gestor.email}</p>
                      </IonText>
                    </div>
                  </div>
                  <div className="cuenta-total">
                    <IonText color={cuenta.montoTotal > 0 ? 'warning' : 'success'}>
                      <h3>{formatCurrency(cuenta.montoTotal)}</h3>
                    </IonText>
                    <IonChip color={cuenta.montoTotal > 0 ? 'warning' : 'success'} outline>
                      <IonLabel>
                        {cuenta.montoTotal > 0 ? 'Pendiente' : 'Saldado'}
                      </IonLabel>
                    </IonChip>
                  </div>
                </div>
              </IonCardHeader>

              <IonCardContent>
                {cuenta.montoTotal > 0 && (
                  <>
                    <div className="cuenta-stats">
                      <div className="stat">
                        <IonIcon icon={documentTextOutline} color="primary" />
                        <IonText>
                          <p>{cuenta.pedidosPendientesPago.length} pedidos</p>
                        </IonText>
                      </div>
                      <div className="stat">
                        <IonIcon icon={trendingUpOutline} color="success" />
                        <IonText>
                          <p>{cuenta.gestor.ventasTotales} ventas totales</p>
                        </IonText>
                      </div>
                    </div>

                    <IonAccordionGroup>
                      <IonAccordion value="pedidos">
                        <IonItem slot="header" color="light">
                          <IonLabel>Ver Pedidos Pendientes de Pago</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                          <IonList>
                            {cuenta.pedidosPendientesPago.map(pedido => (
                              <IonItem key={pedido.id} lines="full">
                                <IonLabel>
                                  <h3>{pedido.productoNombre}</h3>
                                  <p>Cliente: {pedido.cliente.nombre}</p>
                                  <p>{formatDateTime(pedido.fechaActualizacion)}</p>
                                </IonLabel>
                                <IonNote slot="end">
                                  <IonText color="primary">
                                    <h4>{formatCurrency(pedido.precioTotal - pedido.comisionGestor)}</h4>
                                  </IonText>
                                </IonNote>
                              </IonItem>
                            ))}
                          </IonList>
                        </div>
                      </IonAccordion>
                    </IonAccordionGroup>

                    <div className="action-buttons">
                      <IonButton 
                        size="small" 
                        fill="outline"
                        onClick={() => handleCall(cuenta.gestor.telefono || '')}
                      >
                        <IonIcon slot="icon-only" icon={callOutline} />
                      </IonButton>
                      <IonButton 
                        size="small" 
                        fill="outline" 
                        color="success"
                        onClick={() => handleWhatsApp(cuenta.gestor.telefono || '', cuenta.gestor.nombre)}
                      >
                        WhatsApp
                      </IonButton>
                      <IonButton 
                        size="small"
                        expand="block"
                        onClick={() => openPaymentModal(cuenta)}
                      >
                        Registrar Pago
                        <IonIcon slot="end" icon={checkmarkCircleOutline} />
                      </IonButton>
                    </div>
                  </>
                )}

                {cuenta.montoTotal === 0 && (
                  <div className="saldado-message">
                    <IonIcon icon={checkmarkDoneOutline} color="success" />
                    <IonText color="success">
                      <p>Cuenta al día</p>
                    </IonText>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {filterCuentas().length === 0 && (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon icon={cashOutline} size="large" color="medium" />
              <IonText>
                <h3>No hay cuentas que mostrar</h3>
                <p>Las cuentas aparecerán aquí cuando los gestores tengan pedidos entregados.</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Modal para registrar pago */}
        <IonModal isOpen={showPaymentModal} onDidDismiss={() => setShowPaymentModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Registrar Pago Recibido</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowPaymentModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedCuenta && (
              <div className="ion-padding">
                <IonCard>
                  <IonCardContent>
                    <div className="payment-header">
                      <IonAvatar>
                        <img src="https://ionicframework.com/docs/img/demos/avatar.svg" alt={selectedCuenta.gestor.nombre} />
                      </IonAvatar>
                      <IonText>
                        <h3>{selectedCuenta.gestor.nombre}</h3>
                        <p>Total pendiente: {formatCurrency(selectedCuenta.montoTotal)}</p>
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>

                <IonCard>
                  <IonCardHeader>
                    <IonItem lines="none">
                      <IonLabel>Seleccionar Pedidos a Pagar</IonLabel>
                      <IonButton 
                        fill="clear" 
                        slot="end"
                        onClick={handleSelectAll}
                      >
                        {selectedPedidos.length === selectedCuenta.pedidosPendientesPago.length ? 'Deseleccionar' : 'Seleccionar'} Todos
                      </IonButton>
                    </IonItem>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonList>
                      {selectedCuenta.pedidosPendientesPago.map(pedido => (
                        <IonItem key={pedido.id}>
                          <IonCheckbox
                            slot="start"
                            checked={selectedPedidos.includes(pedido.id)}
                            onIonChange={() => handlePedidoSelection(pedido.id)}
                          />
                          <IonLabel>
                            <h3>{pedido.productoNombre}</h3>
                            <p>Pedido #{pedido.id.slice(-6)}</p>
                            <p>{formatDate(pedido.fechaActualizacion)}</p>
                          </IonLabel>
                          <IonNote slot="end">
                            <IonText color="primary">
                              <h4>{formatCurrency(pedido.precioTotal - pedido.comisionGestor)}</h4>
                            </IonText>
                          </IonNote>
                        </IonItem>
                      ))}
                    </IonList>
                  </IonCardContent>
                </IonCard>

                <IonCard color="light">
                  <IonCardContent>
                    <div className="payment-summary">
                      <IonText>
                        <h3>Resumen del Pago</h3>
                      </IonText>
                      <div className="summary-row">
                        <span>Pedidos seleccionados:</span>
                        <strong>{selectedPedidos.length}</strong>
                      </div>
                      <div className="summary-row total">
                        <span>Total a recibir:</span>
                        <IonText color="primary">
                          <h3>{formatCurrency(calculateSelectedTotal())}</h3>
                        </IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>

                <IonCard color="warning">
                  <IonCardContent>
                    <IonText>
                      <p><IonIcon icon={alertCircleOutline} /> <strong>Importante:</strong></p>
                      <p>Al confirmar, estos pedidos se marcarán como pagados y el gestor recibirá una notificación.</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>

                <div className="ion-padding">
                  <IonButton 
                    expand="block" 
                    onClick={handleConfirmPayment}
                    disabled={selectedPedidos.length === 0}
                  >
                    <IonIcon slot="start" icon={checkmarkCircleOutline} />
                    Confirmar Pago Recibido
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

export default Cuentas;
