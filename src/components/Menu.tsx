import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonAvatar,
  IonChip,
  IonBadge,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { 
  homeOutline, 
  homeSharp,
  bagHandleOutline, 
  bagHandleSharp,
  cartOutline, 
  cartSharp,
  cashOutline, 
  cashSharp,
  peopleOutline, 
  peopleSharp,
  rocketOutline, 
  rocketSharp,
  chatbubblesOutline, 
  chatbubblesSharp,
  bulbOutline, 
  bulbSharp,
  personOutline, 
  personSharp,
  logOutOutline,
  logOutSharp,
  cubeOutline,
  cubeSharp,
  statsChartOutline,
  statsChartSharp,
  mailOutline,
  mailSharp,
  businessOutline,
  businessSharp,
  ribbonOutline,
  ribbonSharp
} from 'ionicons/icons';
import './Menu.css';
import { GestorVentas, PropietarioProducto } from '../types';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  badge?: number;
}

const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { user: currentUser, logout } = useAuth();

  // Páginas para Gestor de Ventas
  const gestorPages: AppPage[] = [
    {
      title: 'Mi Dashboard',
      url: '/dashboard',
      iosIcon: homeOutline,
      mdIcon: homeSharp
    },
    {
      title: 'Catálogo de Productos',
      url: '/catalogo',
      iosIcon: bagHandleOutline,
      mdIcon: bagHandleSharp
    },
    {
      title: 'Mis Ventas',
      url: '/ventas',
      iosIcon: cartOutline,
      mdIcon: cartSharp,
      badge: 3 // Pedidos pendientes
    },
    {
      title: 'Mis Ganancias',
      url: '/ganancias',
      iosIcon: cashOutline,
      mdIcon: cashSharp
    },
    {
      title: 'Mis Clientes',
      url: '/clientes',
      iosIcon: peopleOutline,
      mdIcon: peopleSharp
    },
    {
      title: 'Herramientas de Venta',
      url: '/herramientas',
      iosIcon: rocketOutline,
      mdIcon: rocketSharp
    },
    {
      title: 'Novedades',
      url: '/novedades',
      iosIcon: bulbOutline,
      mdIcon: bulbSharp,
      badge: 2 // Nuevos productos
    },
    {
      title: 'Mi Tienda Pro',
      url: '/tienda-pro',
      iosIcon: businessOutline,
      mdIcon: businessSharp
    }
  ];

  // Páginas para Propietario de Producto
  const propietarioPages: AppPage[] = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      iosIcon: homeOutline,
      mdIcon: homeSharp
    },
    {
      title: 'Gestión de Inventario',
      url: '/inventario',
      iosIcon: cubeOutline,
      mdIcon: cubeSharp
    },
    {
      title: 'Pedidos Recibidos',
      url: '/pedidos',
      iosIcon: cartOutline,
      mdIcon: cartSharp,
      badge: 5 // Nuevos pedidos
    },
    {
      title: 'Estado de Cuentas',
      url: '/cuentas',
      iosIcon: cashOutline,
      mdIcon: cashSharp
    },
    {
      title: 'Mis Gestores',
      url: '/gestores',
      iosIcon: peopleOutline,
      mdIcon: peopleSharp
    },
    {
      title: 'Comunicación',
      url: '/comunicacion',
      iosIcon: chatbubblesOutline,
      mdIcon: chatbubblesSharp
    },
    {
      title: 'Estadísticas',
      url: '/estadisticas',
      iosIcon: statsChartOutline,
      mdIcon: statsChartSharp
    },
    {
      title: 'Mi Suscripción',
      url: '/suscripcion',
      iosIcon: ribbonOutline,
      mdIcon: ribbonSharp
    }
  ];

  const appPages = currentUser?.rol === 'gestor' ? gestorPages : propietarioPages;

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
            <IonAvatar slot="start">
              <img 
                alt="Avatar" 
                src={currentUser?.rol === 'propietario' 
                  ? (currentUser as PropietarioProducto).logoUrl || "https://ionicframework.com/docs/img/demos/avatar.svg"
                  : "https://ionicframework.com/docs/img/demos/avatar.svg"
                } 
              />
            </IonAvatar>
            <IonLabel>
              <h2>{currentUser?.nombre || 'Usuario'}</h2>
              <p>{currentUser?.email}</p>
              {currentUser?.rol === 'gestor' && (
                <IonChip color={(currentUser as GestorVentas).esPro ? 'success' : 'medium'}>
                  <IonLabel>{(currentUser as GestorVentas).esPro ? 'Gestor Pro' : 'Gestor'}</IonLabel>
                </IonChip>
              )}
              {currentUser?.rol === 'propietario' && (
                <IonChip color="primary">
                  <IonLabel>{(currentUser as PropietarioProducto).nombreMarca}</IonLabel>
                </IonChip>
              )}
            </IonLabel>
          </IonListHeader>

          {currentUser?.rol === 'gestor' && (
            <IonItem lines="none" className="stats-item">
              <IonLabel>
                <p>Comisiones del mes</p>
                <h3>{formatCurrency((currentUser as GestorVentas).comisionesGanadas)}</h3>
              </IonLabel>
            </IonItem>
          )}

          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem 
                  className={location.pathname === appPage.url ? 'selected' : ''} 
                  routerLink={appPage.url} 
                  routerDirection="none" 
                  lines="none" 
                  detail={false}
                >
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                  {appPage.badge && (
                    <IonBadge color="danger" slot="end">{appPage.badge}</IonBadge>
                  )}
                </IonItem>
              </IonMenuToggle>
            );
          })}

          <IonMenuToggle autoHide={false}>
            <IonItem 
              routerLink="/perfil" 
              routerDirection="none" 
              lines="none" 
              detail={false}
              className={location.pathname === '/perfil' ? 'selected' : ''}
            >
              <IonIcon aria-hidden="true" slot="start" ios={personOutline} md={personSharp} />
              <IonLabel>Mi Perfil</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide={false}>
            <IonItem 
              button
              onClick={handleLogout}
              lines="none" 
              detail={false}
            >
              <IonIcon aria-hidden="true" slot="start" ios={logOutOutline} md={logOutSharp} />
              <IonLabel>Cerrar Sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
