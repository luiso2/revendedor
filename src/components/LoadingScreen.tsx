import React from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';

const LoadingScreen: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}>
          <IonSpinner name="crescent" style={{ transform: 'scale(2)' }} />
          <h2 style={{ marginTop: '20px' }}>Cargando VendeMax...</h2>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoadingScreen;
