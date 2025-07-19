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
  IonText,
  IonIcon,
  IonButton,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonProgressBar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonBadge,
  IonNote
} from '@ionic/react';
import {
  cashOutline,
  trendingUpOutline,
  trendingDownOutline,
  walletOutline,
  checkmarkCircleOutline,
  timeOutline,
  calendarOutline,
  downloadOutline,
  analyticsOutline,
  alertCircleOutline,
  arrowUpCircleOutline,
  arrowDownCircleOutline
} from 'ionicons/icons';
import { gestorService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Pedido, GestorVentas } from '../../types';
import './Ganancias.css';

interface ResumenFinanciero {
  totalGanado: number;
  porCobrar: number;
  cobrado: number;
  ventasTotales: number;
}

interface TransaccionFinanciera {
  id: string;
  tipo: 'comision' | 'cobro' | 'ajuste';
  monto: number;
  descripcion: string;
  fecha: Date;
  pedidoId?: string;
  estado: 'pendiente' | 'cobrado' | 'cancelado';
}

const Ganancias: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('mes');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [resumenFinanciero, setResumenFinanciero] = useState<ResumenFinanciero>({
    totalGanado: 0,
    porCobrar: 0,
    cobrado: 0,
    ventasTotales: 0
  });
  const { user } = useAuth();
  const currentUser = user as GestorVentas;

  useEffect(() => {
    loadData();
  }, [selectedPeriod, selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await gestorService.getMisPedidos();
      const filteredData = filterByPeriod(data);
      setPedidos(filteredData);
      calculateResumen(filteredData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByPeriod = (pedidos: Pedido[]): Pedido[] => {
    const now = new Date();
    const selected = new Date(selectedDate);
    
    return pedidos.filter(pedido => {
      const pedidoDate = new Date(pedido.fechaCreacion);
      
      switch (selectedPeriod) {
        case 'hoy':
          return pedidoDate.toDateString() === now.toDateString();
        case 'semana':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          return pedidoDate >= weekStart;
        case 'mes':
          return pedidoDate.getMonth() === now.getMonth() && 
                 pedidoDate.getFullYear() === now.getFullYear();
        case 'custom':
          return pedidoDate.getMonth() === selected.getMonth() && 
                 pedidoDate.getFullYear() === selected.getFullYear();
        default:
          return true;
      }
    });
  };

  const calculateResumen = (pedidos: Pedido[]) => {
    const resumen = pedidos.reduce((acc, pedido) => {
      if (pedido.estado !== 'cancelado') {
        acc.ventasTotales += pedido.precioTotal;
        acc.totalGanado += pedido.comisionGestor;
        
        if (pedido.estado === 'entregado_pago_recibido') {
          acc.porCobrar += pedido.comisionGestor;
        } else if (pedido.estado === 'cerrado') {
          acc.cobrado += pedido.comisionGestor;
        }
      }
      return acc;
    }, {
      totalGanado: 0,
      porCobrar: 0,
      cobrado: 0,
      ventasTotales: 0
    });
    
    setResumenFinanciero(resumen);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
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

  const getTransacciones = (): TransaccionFinanciera[] => {
    return pedidos
      .filter(p => p.estado !== 'cancelado')
      .map(pedido => ({
        id: `trans-${pedido.id}`,
        tipo: 'comision' as const,
        monto: pedido.comisionGestor,
        descripcion: `Comisión por ${pedido.productoNombre}`,
        fecha: pedido.fechaActualizacion,
        pedidoId: pedido.id,
        estado: (pedido.estado === 'cerrado' ? 'cobrado' : 
                pedido.estado === 'entregado_pago_recibido' ? 'pendiente' : 'pendiente') as 'pendiente' | 'cobrado' | 'cancelado'
      }))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'cobrado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      default: return 'medium';
    }
  };

  const getEstadoIcon = (estado: string): string => {
    switch (estado) {
      case 'cobrado': return checkmarkCircleOutline;
      case 'pendiente': return timeOutline;
      case 'cancelado': return alertCircleOutline;
      default: return cashOutline;
    }
  };

  const getPeriodLabel = (): string => {
    switch (selectedPeriod) {
      case 'hoy': return 'Hoy';
      case 'semana': return 'Esta Semana';
      case 'mes': return 'Este Mes';
      case 'custom': return formatDate(new Date(selectedDate));
      default: return '';
    }
  };

  const calculateTrend = (): number => {
    // Simulación de tendencia
    return 15.5;
  };

  const downloadReport = () => {
    // Simulación de descarga
    console.log('Descargando reporte...');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mis Ganancias</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={downloadReport}>
              <IonIcon slot="icon-only" icon={downloadOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            value={selectedPeriod} 
            onIonChange={e => setSelectedPeriod(e.detail.value as string)}
          >
            <IonSegmentButton value="hoy">
              <IonLabel>Hoy</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="semana">
              <IonLabel>Semana</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="mes">
              <IonLabel>Mes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="custom" onClick={() => setShowDateModal(true)}>
              <IonLabel>Personalizado</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        <div className="period-header">
          <IonText>
            <h2>{getPeriodLabel()}</h2>
            <p>Resumen de tus ganancias</p>
          </IonText>
        </div>

        {/* Cards de resumen */}
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard className="summary-card">
                <IonCardContent>
                  <div className="summary-icon">
                    <IonIcon icon={walletOutline} color="primary" />
                  </div>
                  <IonText>
                    <p>Total Ganado</p>
                    <h3>{formatCurrency(resumenFinanciero.totalGanado)}</h3>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="summary-card">
                <IonCardContent>
                  <div className="summary-icon">
                    <IonIcon icon={timeOutline} color="warning" />
                  </div>
                  <IonText>
                    <p>Por Cobrar</p>
                    <h3>{formatCurrency(resumenFinanciero.porCobrar)}</h3>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="summary-card">
                <IonCardContent>
                  <div className="summary-icon">
                    <IonIcon icon={checkmarkCircleOutline} color="success" />
                  </div>
                  <IonText>
                    <p>Cobrado</p>
                    <h3>{formatCurrency(resumenFinanciero.cobrado)}</h3>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="summary-card">
                <IonCardContent>
                  <div className="summary-icon">
                    <IonIcon icon={analyticsOutline} color="tertiary" />
                  </div>
                  <IonText>
                    <p>Ventas Totales</p>
                    <h3>{formatCurrency(resumenFinanciero.ventasTotales)}</h3>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Indicador de tendencia */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Rendimiento</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="trend-indicator">
              <IonIcon 
                icon={calculateTrend() > 0 ? trendingUpOutline : trendingDownOutline} 
                color={calculateTrend() > 0 ? 'success' : 'danger'}
                className="trend-icon"
              />
              <IonText>
                <h2 className={calculateTrend() > 0 ? 'positive' : 'negative'}>
                  {calculateTrend() > 0 ? '+' : ''}{calculateTrend()}%
                </h2>
                <p>Comparado con el período anterior</p>
              </IonText>
            </div>
            
            <div className="stats-grid">
              <div className="stat-item">
                <IonText color="medium">
                  <p>Promedio por venta</p>
                </IonText>
                <IonText>
                  <h4>{formatCurrency(resumenFinanciero.totalGanado / (pedidos.length || 1))}</h4>
                </IonText>
              </div>
              <div className="stat-item">
                <IonText color="medium">
                  <p>Total de ventas</p>
                </IonText>
                <IonText>
                  <h4>{pedidos.filter(p => p.estado !== 'cancelado').length}</h4>
                </IonText>
              </div>
              <div className="stat-item">
                <IonText color="medium">
                  <p>Tasa de éxito</p>
                </IonText>
                <IonText>
                  <h4>{((pedidos.filter(p => p.estado !== 'cancelado').length / (pedidos.length || 1)) * 100).toFixed(0)}%</h4>
                </IonText>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Lista de transacciones */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Detalle de Comisiones</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {getTransacciones().map((transaccion) => (
                <IonItem key={transaccion.id} lines="full">
                  <IonIcon 
                    icon={transaccion.tipo === 'comision' ? arrowUpCircleOutline : arrowDownCircleOutline} 
                    color={transaccion.tipo === 'comision' ? 'success' : 'danger'}
                    slot="start"
                  />
                  <IonLabel>
                    <h3>{transaccion.descripcion}</h3>
                    <p>{formatDate(transaccion.fecha)}</p>
                  </IonLabel>
                  <IonNote slot="end" className="transaction-amount">
                    <IonText color={transaccion.tipo === 'comision' ? 'success' : 'danger'}>
                      <h3>{transaccion.tipo === 'comision' ? '+' : '-'}{formatCurrency(transaccion.monto)}</h3>
                    </IonText>
                    <IonChip color={getEstadoColor(transaccion.estado)} outline>
                      <IonIcon icon={getEstadoIcon(transaccion.estado)} />
                      <IonLabel>{transaccion.estado}</IonLabel>
                    </IonChip>
                  </IonNote>
                </IonItem>
              ))}
            </IonList>

            {getTransacciones().length === 0 && (
              <div className="empty-state">
                <IonIcon icon={cashOutline} color="medium" />
                <IonText color="medium">
                  <p>No hay transacciones en este período</p>
                </IonText>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        {/* Consejos */}
        <IonCard color="light">
          <IonCardContent>
            <div className="tips-section">
              <IonIcon icon={alertCircleOutline} color="primary" />
              <IonText>
                <h3>💡 Consejo del día</h3>
                <p>Mantén un registro diario de tus cobros para llevar un mejor control de tus finanzas. ¡Recuerda confirmar con tu propietario cuando hayas cobrado tus comisiones!</p>
              </IonText>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Modal para selección de fecha */}
        <IonModal isOpen={showDateModal} onDidDismiss={() => setShowDateModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Seleccionar Período</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowDateModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonDatetime
              presentation="month-year"
              value={selectedDate}
              onIonChange={e => {
                setSelectedDate(e.detail.value as string);
                setSelectedPeriod('custom');
                setShowDateModal(false);
              }}
            />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Ganancias;
