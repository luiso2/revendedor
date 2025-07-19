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
  IonBadge,
  IonButton
} from '@ionic/react';
import {
  cartOutline,
  cashOutline,
  peopleOutline,
  trendingUpOutline,
  cubeOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
  addCircleOutline,
  megaphoneOutline
} from 'ionicons/icons';
import { propietarioService } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { EstadisticasPropietario, PropietarioProducto } from '../../types';
import './Dashboard.css';

const DashboardPropietario: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasPropietario | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const currentUser = user as PropietarioProducto;

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    setLoading(true);
    try {
      const data = await propietarioService.getEstadisticas();
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
      title: 'Nuevos Pedidos',
      value: estadisticas?.nuevosPedidos || 0,
      icon: alertCircleOutline,
      color: 'danger',
      link: '/pedidos'
    },
    {
      title: 'En Coordinación',
      value: estadisticas?.pedidosEnCoordinacion || 0,
      icon: timeOutline,
      color: 'warning',
      link: '/pedidos'
    },
    {
      title: 'Por Recibir',
      value: formatCurrency(estadisticas?.montoPendienteRecibir || 0),
      icon: cashOutline,
      color: 'success',
      link: '/cuentas'
    },
    {
      title: 'Productos Activos',
      value: estadisticas?.productosActivos || 0,
      icon: cubeOutline,
      color: 'primary',
      link: '/inventario'
    }
  ];

  const getPlanColor = (plan: string) => {
    switch(plan) {
      case 'gratuito': return 'medium';
      case 'basico': return 'primary';
      case 'premium': return 'success';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
          <IonChip slot="end" color={getPlanColor(currentUser?.planSuscripcion || 'gratuito')}>
            <IonLabel>Plan {currentUser?.planSuscripcion}</IonLabel>
          </IonChip>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        <div className="dashboard-header">
          <IonText>
            <h1>{currentUser?.nombreMarca}</h1>
            <p>Centro de Control de tu Negocio</p>
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
            <IonCardTitle>Resumen del Mes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={cartOutline} color="primary" />
                    <IonText>
                      <h3>{estadisticas?.ventasMes || 0}</h3>
                      <p>Ventas</p>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={peopleOutline} color="secondary" />
                    <IonText>
                      <h3>{estadisticas?.gestoresActivos || 0}</h3>
                      <p>Gestores</p>
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div className="metric-box">
                    <IonIcon icon={trendingUpOutline} color="success" />
                    <IonText>
                      <h3>+23%</h3>
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
              {estadisticas?.productosMasVendidos.map((producto, index) => (
                <IonItem key={index} routerLink={`/inventario/${producto.productoId}`}>
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
            <IonCardTitle>Mejores Gestores</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {estadisticas?.mejoresGestores.map((gestor, index) => (
                <IonItem key={index}>
                  <IonAvatar slot="start">
                    <img src={`https://ionicframework.com/docs/img/demos/avatar.svg`} alt={gestor.nombre} />
                  </IonAvatar>
                  <IonLabel>
                    <h2>{gestor.nombre}</h2>
                    <p>{gestor.ventas} ventas este mes</p>
                  </IonLabel>
                  <IonIcon icon={index === 0 ? checkmarkCircleOutline : undefined} color="success" slot="end" />
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
                  <IonCard button routerLink="/inventario/nuevo" className="action-card">
                    <IonCardContent className="ion-text-center">
                      <IonIcon icon={addCircleOutline} size="large" color="primary" />
                      <IonText>
                        <p>Añadir Producto</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
                <IonCol size="6">
                  <IonCard button routerLink="/comunicacion/nuevo" className="action-card">
                    <IonCardContent className="ion-text-center">
                      <IonIcon icon={megaphoneOutline} size="large" color="secondary" />
                      <IonText>
                        <p>Enviar Anuncio</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {currentUser?.planSuscripcion === 'gratuito' && (
          <IonCard className="upgrade-card">
            <IonCardContent>
              <IonChip color="primary">
                <IonLabel>Mejora tu Plan</IonLabel>
              </IonChip>
              <IonText>
                <h3>Desbloquea más funcionalidades</h3>
                <p>Con los planes Básico y Premium obtén estadísticas avanzadas, más productos y soporte prioritario.</p>
              </IonText>
              <IonButton expand="block" routerLink="/suscripcion" color="primary">
                Ver Planes
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DashboardPropietario;
