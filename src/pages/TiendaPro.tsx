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
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge
} from '@ionic/react';
import {
  diamondOutline,
  starOutline,
  checkmarkCircleOutline,
  arrowForwardOutline
} from 'ionicons/icons';

const TiendaPro: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tienda Pro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={diamondOutline} color="primary" />
              Plan Pro
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h2>Desbloquea todo el potencial de Vendemax</h2>
            <p>Accede a funciones avanzadas y herramientas exclusivas</p>
            
            <IonList>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>Reportes avanzados y analytics</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>Integración con WhatsApp Business</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>Backup automático de datos</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>Soporte prioritario 24/7</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success" />
                <IonLabel>Múltiples gestores ilimitados</IonLabel>
              </IonItem>
            </IonList>

            <IonButton expand="block" color="primary">
              <IonIcon icon={starOutline} slot="start" />
              Actualizar a Pro
              <IonIcon icon={arrowForwardOutline} slot="end" />
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default TiendaPro; 