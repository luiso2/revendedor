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
  IonIcon
} from '@ionic/react';
import {
  cardOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

const Suscripcion: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Suscripción</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={cardOutline} color="primary" />
              Gestionar Suscripción
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <h2>Plan Actual: Básico</h2>
            <p>Tu suscripción está activa hasta el 31 de diciembre de 2024</p>
            
            <IonButton expand="block" color="primary">
              <IonIcon icon={checkmarkCircleOutline} slot="start" />
              Renovar Suscripción
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Suscripcion; 