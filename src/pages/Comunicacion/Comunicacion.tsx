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
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  IonModal,
  IonTextarea,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonSpinner
} from '@ionic/react';
import {
  add,
  send,
  chatbubbleOutline,
  notificationsOutline,
  mailOutline,
  callOutline,
  timeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import './Comunicacion.css';

interface Mensaje {
  id: string;
  tipo: 'whatsapp' | 'email' | 'sms' | 'notificacion';
  destinatario: string;
  asunto: string;
  contenido: string;
  fecha: Date;
  estado: 'pendiente' | 'enviado' | 'entregado' | 'leido' | 'error';
  prioridad: 'baja' | 'media' | 'alta';
}

const Comunicacion: React.FC = () => {
  const [mensajes, setMensajes] = React.useState<Mensaje[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');

  // Estados del formulario
  const [tipoMensaje, setTipoMensaje] = React.useState<'whatsapp' | 'email' | 'sms' | 'notificacion'>('whatsapp');
  const [destinatario, setDestinatario] = React.useState('');
  const [asunto, setAsunto] = React.useState('');
  const [contenido, setContenido] = React.useState('');
  const [prioridad, setPrioridad] = React.useState<'baja' | 'media' | 'alta'>('media');

  React.useEffect(() => {
    loadMensajes();
  }, []);

  const loadMensajes = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMensajes: Mensaje[] = [
        {
          id: '1',
          tipo: 'whatsapp',
          destinatario: 'Juan Pérez',
          asunto: 'Nuevos productos disponibles',
          contenido: 'Hola Juan, tenemos nuevos productos que podrían interesarte...',
          fecha: new Date(Date.now() - 3600000),
          estado: 'leido',
          prioridad: 'media'
        },
        {
          id: '2',
          tipo: 'email',
          destinatario: 'María García',
          asunto: 'Resumen de ventas del mes',
          contenido: 'Adjunto el resumen de ventas del mes de enero...',
          fecha: new Date(Date.now() - 7200000),
          estado: 'enviado',
          prioridad: 'alta'
        },
        {
          id: '3',
          tipo: 'sms',
          destinatario: 'Carlos López',
          asunto: 'Recordatorio de pago',
          contenido: 'Recordatorio: Su pago vence mañana. Gracias.',
          fecha: new Date(Date.now() - 10800000),
          estado: 'entregado',
          prioridad: 'alta'
        }
      ];
      
      setMensajes(mockMensajes);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      setToastMessage('Error al cargar los mensajes');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!destinatario || !contenido) {
      setToastMessage('Por favor completa todos los campos requeridos');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const nuevoMensaje: Mensaje = {
        id: Date.now().toString(),
        tipo: tipoMensaje,
        destinatario,
        asunto,
        contenido,
        fecha: new Date(),
        estado: 'pendiente',
        prioridad
      };

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMensajes(prev => [nuevoMensaje, ...prev]);
      setShowModal(false);
      resetForm();
      setToastMessage('Mensaje enviado correctamente');
      setShowToast(true);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setToastMessage('Error al enviar el mensaje');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTipoMensaje('whatsapp');
    setDestinatario('');
    setAsunto('');
    setContenido('');
    setPrioridad('media');
  };

  const getTipoIcon = (tipo: Mensaje['tipo']) => {
    switch (tipo) {
      case 'whatsapp': return chatbubbleOutline;
      case 'email': return mailOutline;
      case 'sms': return notificationsOutline;
      case 'notificacion': return notificationsOutline;
      default: return chatbubbleOutline;
    }
  };

  const getEstadoColor = (estado: Mensaje['estado']) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'enviado': return 'primary';
      case 'entregado': return 'success';
      case 'leido': return 'success';
      case 'error': return 'danger';
      default: return 'medium';
    }
  };

  const getPrioridadColor = (prioridad: Mensaje['prioridad']) => {
    switch (prioridad) {
      case 'baja': return 'success';
      case 'media': return 'warning';
      case 'alta': return 'danger';
      default: return 'medium';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comunicación</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading && (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Cargando mensajes...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Estadísticas */}
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Resumen de Comunicación</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="stats-grid">
                  <div className="stat-item">
                    <IonIcon icon={chatbubbleOutline} color="primary" />
                    <span>{mensajes.filter(m => m.tipo === 'whatsapp').length} WhatsApp</span>
                  </div>
                  <div className="stat-item">
                    <IonIcon icon={mailOutline} color="secondary" />
                    <span>{mensajes.filter(m => m.tipo === 'email').length} Emails</span>
                  </div>
                  <div className="stat-item">
                    <IonIcon icon={notificationsOutline} color="tertiary" />
                    <span>{mensajes.filter(m => m.tipo === 'sms').length} SMS</span>
                  </div>
                  <div className="stat-item">
                    <IonIcon icon={checkmarkCircleOutline} color="success" />
                    <span>{mensajes.filter(m => m.estado === 'leido').length} Leídos</span>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Lista de mensajes */}
            <IonList>
              {mensajes.map(mensaje => (
                <IonItem key={mensaje.id} className="mensaje-item">
                  <IonIcon 
                    icon={getTipoIcon(mensaje.tipo)} 
                    slot="start" 
                    color="primary"
                  />
                  <IonLabel>
                    <h2>{mensaje.destinatario}</h2>
                    <h3>{mensaje.asunto}</h3>
                    <p>{mensaje.contenido.substring(0, 100)}...</p>
                    <div className="mensaje-meta">
                      <IonIcon icon={timeOutline} />
                      <span>{formatDate(mensaje.fecha)}</span>
                      <IonBadge color={getEstadoColor(mensaje.estado)}>
                        {mensaje.estado}
                      </IonBadge>
                      <IonBadge color={getPrioridadColor(mensaje.prioridad)}>
                        {mensaje.prioridad}
                      </IonBadge>
                    </div>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            {mensajes.length === 0 && (
              <div className="empty-state">
                <IonIcon icon={chatbubbleOutline} size="large" color="medium" />
                <h3>No hay mensajes</h3>
                <p>Comienza enviando tu primer mensaje</p>
              </div>
            )}
          </>
        )}

        {/* Modal para nuevo mensaje */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Mensaje</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="ion-padding">
              <IonItem>
                <IonLabel>Tipo de mensaje</IonLabel>
                <IonSelect
                  value={tipoMensaje}
                  onIonChange={e => setTipoMensaje(e.detail.value)}
                >
                  <IonSelectOption value="whatsapp">WhatsApp</IonSelectOption>
                  <IonSelectOption value="email">Email</IonSelectOption>
                  <IonSelectOption value="sms">SMS</IonSelectOption>
                  <IonSelectOption value="notificacion">Notificación</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Destinatario *</IonLabel>
                <IonInput
                  value={destinatario}
                  onIonChange={(e: any) => setDestinatario(e.detail.value!)}
                  placeholder="Nombre o número"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Asunto</IonLabel>
                <IonInput
                  value={asunto}
                  onIonChange={(e: any) => setAsunto(e.detail.value!)}
                  placeholder="Título del mensaje"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Mensaje *</IonLabel>
                <IonTextarea
                  value={contenido}
                  onIonChange={e => setContenido(e.detail.value!)}
                  rows={6}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel>Prioridad</IonLabel>
                <IonSelect
                  value={prioridad}
                  onIonChange={e => setPrioridad(e.detail.value)}
                >
                  <IonSelectOption value="baja">Baja</IonSelectOption>
                  <IonSelectOption value="media">Media</IonSelectOption>
                  <IonSelectOption value="alta">Alta</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSendMessage}
                disabled={!destinatario || !contenido || loading}
                className="send-button"
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <IonIcon icon={send} slot="start" />
                    Enviar Mensaje
                  </>
                )}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* FAB para nuevo mensaje */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

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

export default Comunicacion; 