import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/react';

const createPlaceholderPage = (title: string, description: string) => {
  const Component: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div className="ion-padding">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  return Component;
};

// Gestor Pages
export const Ganancias = createPlaceholderPage('Mis Ganancias', 'Aquí podrás ver tu balance de comisiones y llevar tu contabilidad personal.');
export const Clientes = createPlaceholderPage('Mis Clientes', 'Gestiona tu lista de clientes y clientes potenciales.');
export const Herramientas = createPlaceholderPage('Herramientas de Venta', 'Accede a recursos para vender de manera más efectiva.');
export const Novedades = createPlaceholderPage('Novedades', 'Mantente informado sobre nuevos productos y sugerencias.');
export const TiendaPro = createPlaceholderPage('Mi Tienda Pro', 'Conoce los beneficios del plan Gestor Pro.');

// Propietario Pages
export const Inventario = createPlaceholderPage('Gestión de Inventario', 'Administra tus productos y stock.');
export const Pedidos = createPlaceholderPage('Pedidos Recibidos', 'Gestiona los pedidos de tus gestores.');
export const Cuentas = createPlaceholderPage('Estado de Cuentas', 'Revisa las cuentas pendientes con tus gestores.');
export const Gestores = createPlaceholderPage('Mis Gestores', 'Administra tu red de gestores de ventas.');
export const Comunicacion = createPlaceholderPage('Comunicación', 'Envía mensajes y anuncios a tus gestores.');
export const Estadisticas = createPlaceholderPage('Estadísticas', 'Analiza el rendimiento de tu negocio.');
export const Suscripcion = createPlaceholderPage('Mi Suscripción', 'Gestiona tu plan y suscripción.');

// Common
export const Perfil = createPlaceholderPage('Mi Perfil', 'Gestiona tu información personal y configuración.');
