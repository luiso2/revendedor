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
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonProgressBar,
  IonChip,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonList,
  IonItem,
  IonAvatar,
  IonBadge
} from '@ionic/react';
import {
  cartOutline,
  cashOutline,
  peopleOutline,
  trendingUpOutline,
  bagHandleOutline,
  timeOutline,
  checkmarkCircleOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { gestorService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { EstadisticasGestor, GestorVentas } from '../../types';
import './Dashboard.css';

const DashboardGestor: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGestor | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const currentUser = user as GestorVentas;

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    setLoading(true);
    try {
      const data = await gestorService.getEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadEstadisticas();
    event.detail.complete();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Pedidos Pendientes',
      value: estadisticas?.pedidosPendientes || 0,
      icon: alertCircleOutline,
      color: 'warning',
      link: '/ventas'
    },
    {
      title: 'En Entrega',
      value: estadisticas?.pedidosEnEntrega || 0,
      icon: timeOutline,
      color: 'primary',
      link: '/ventas'
    },
    {
      title: 'Por Cobrar',
      value: formatCurrency(estadisticas?.gananciasPorCobrar || 0),
      icon: cashOutline,
      color: 'success',
      link: '/ganancias'
    },
    {
      title: 'Clientes Potenciales',
      value: estadisticas?.clientesPotenciales || 0,
      icon: peopleOutline,
      color: 'tertiary',
      link: '/clientes'
    }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mi Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        <div className="dashboard-header">
          <IonText>
            <h1>¡Hola, {currentUser?.nombre}!</h1>
            <p>Este es tu resumen de hoy</p>
          </IonText>
        </div>

        <IonGrid>
          <IonRow>
            {statCards.map((stat, index) => (
              <IonCol size="6" key={index}>
                <IonCard routerLink={stat.link} className="stat-card">
                  <IonCardContent>
                    <IonIcon icon={stat.icon} color={stat.color} className="stat-icon" />
                    <IonText>
                      <h2>{stat.value}</h2>
                      <p>{stat.title}</p>
                    </IonText>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Rendimiento del Mes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={bagHandleOutline} color="primary" />
                    <IonText>
                      <h3>{estadisticas?.ventasMes || 0}</h3>
                      <p>Ventas</p>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={cashOutline} color="success" />
                    <IonText>
                      <h3>{formatCurrency(estadisticas?.comisionesMes || 0)}</h3>
                      <p>Comisiones</p>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={trendingUpOutline} color="tertiary" />
                    <IonText>
                      <h3>15%</h3>
                      <p>Crecimiento</p>
                    </IonText>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Productos Más Vendidos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {estadisticas?.productosVendidos.map((producto, index) => (
                <IonItem key={index}>
                  <IonAvatar slot="start">
                    <img src={`https://picsum.photos/80/80?random=${index}`} alt={producto.nombre} />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{producto.nombre}</h2>
                    <p>{producto.cantidad} unidades vendidas</p>
                  </IonLabel>
                  <IonBadge color="success" slot="end">{producto.cantidad}</IonBadge>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Acciones Rápidas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonCard button routerLink="/catalogo" className="action-card">
                    <IonCardContent className="ion-text-center">
                      <IonIcon icon={bagHandleOutline} size="large" color="primary" />
                      <IonText>
                        <p>Ver Catálogo</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard button routerLink="/clientes/nuevo" className="action-card">
                    <IonCardContent className="ion-text-center">
                      <IonIcon icon={peopleOutline} size="large" color="secondary" />
                      <IonText>
                        <p>Añadir Cliente</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {!currentUser?.esPro && (
          <IonCard className="upgrade-card">
            <IonCardContent>
              <IonChip color="warning">
                <IonLabel>¡Hazte Pro!</IonLabel>
              </IonChip>
              <IonText>
                <h3>Desbloquea tu Catálogo Personalizado</h3>
                <p>Obtén tu propia página de catálogo, estadísticas avanzadas y más beneficios.</p>
              </IonText>
              <IonCard button routerLink="/tienda-pro" color="warning">
                <IonCardContent>
                  <IonText color="dark">
                    <strong>Conoce más →</strong>
                  </IonText>
                </IonCardContent>
              </IonCard>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DashboardGestor;
