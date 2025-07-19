import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon
} from '@ionic/react';
import {
  starOutline,
  timeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

const Novedades: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Novedades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Últimas Actualizaciones</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonIcon icon={starOutline} slot="start" color="primary" />
                <IonLabel>
                  <h2>Nueva funcionalidad de reportes</h2>
                  <p>Ahora puedes generar reportes detallados de ventas</p>
                </IonLabel>
                <IonBadge color="success">Nuevo</IonBadge>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>
                  <h2>Mejoras en el dashboard</h2>
                  <p>Interfaz más intuitiva y responsive</p>
                </IonLabel>
                <IonBadge color="primary">Mejora</IonBadge>
              </IonItem>
              <IonItem>
                <IonIcon icon={timeOutline} slot="start" color="warning" />
                <IonLabel>
                  <h2>Próximamente: Integración con WhatsApp</h2>
                  <p>Enviar mensajes directamente desde la app</p>
                </IonLabel>
                <IonBadge color="warning">Próximo</IonBadge>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Novedades; 