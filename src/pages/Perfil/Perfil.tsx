import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonProgressBar,
  IonAvatar,
  IonChip,
  IonList,
  IonListHeader,
  IonNote,
  IonToggle,
  IonActionSheet,
  IonAlert,
  IonModal,
  IonText,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  personOutline,
  cameraOutline,
  saveOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline,
  timeOutline,
  notificationsOutline,
  lockClosedOutline,
  logOutOutline,
  trashOutline,
  checkmarkCircleOutline,
  medalOutline,
  starOutline,
  cashOutline,
  cartOutline,
  peopleOutline,
  imageOutline,
  createOutline
} from 'ionicons/icons';
import { useAuth } from '../../contexts/AuthContext';
import { GestorVentas, PropietarioProducto } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './Perfil.css';

const Perfil: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showImageActionSheet, setShowImageActionSheet] = useState(false);

  // Form fields comunes
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [provincia, setProvincia] = useState('');
  const [municipio, setMunicipio] = useState('');

  // Form fields para gestor
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [redSocialPrincipal, setRedSocialPrincipal] = useState('');

  // Form fields para propietario
  const [nombreMarca, setNombreMarca] = useState('');
  const [tipoProducto, setTipoProducto] = useState('');
  const [direccionRecogida, setDireccionRecogida] = useState('');
  const [descripcionNegocio, setDescripcionNegocio] = useState('');
  const [horarioAtencion, setHorarioAtencion] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification preferences
  const [notificacionesPedidos, setNotificacionesPedidos] = useState(true);
  const [notificacionesVentas, setNotificacionesVentas] = useState(true);
  const [notificacionesAnuncios, setNotificacionesAnuncios] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    if (!user) return;

    // Common fields
    setNombre(user.nombre);
    setEmail(user.email);
    setTelefono(user.telefono || '');
    setProvincia(user.provincia);
    setMunicipio(user.municipio);

    // Role specific fields
    if (user.rol === 'gestor') {
      const gestor = user as GestorVentas;
      setNombreUsuario(gestor.nombreUsuario);
      setRedSocialPrincipal(gestor.redSocialPrincipal || '');
    } else {
      const propietario = user as PropietarioProducto;
      setNombreMarca(propietario.nombreMarca);
      setTipoProducto(propietario.tipoProducto);
      setDireccionRecogida(propietario.direccionRecogida);
      setDescripcionNegocio(propietario.descripcionNegocio || '');
      setHorarioAtencion(propietario.horarioAtencion || '');
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updates: any = {
        nombre,
        email,
        telefono,
        provincia,
        municipio
      };

      if (user?.rol === 'gestor') {
        updates.nombreUsuario = nombreUsuario;
        updates.redSocialPrincipal = redSocialPrincipal;
      } else {
        updates.nombreMarca = nombreMarca;
        updates.tipoProducto = tipoProducto;
        updates.direccionRecogida = direccionRecogida;
        updates.descripcionNegocio = descripcionNegocio;
        updates.horarioAtencion = horarioAtencion;
      }

      await updateProfile(updates);
      setToastMessage('Perfil actualizado exitosamente');
      setShowToast(true);
      setEditMode(false);
    } catch (error) {
      setToastMessage('Error al actualizar el perfil');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden');
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage('La contraseña debe tener al menos 6 caracteres');
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      // Simulación de cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      setToastMessage('Contraseña actualizada exitosamente');
      setShowToast(true);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setToastMessage('Error al cambiar la contraseña');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    // Simulación de upload de imagen
    setToastMessage('Imagen de perfil actualizada');
    setShowToast(true);
    setShowImageActionSheet(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulación de eliminación de cuenta
      await new Promise(resolve => setTimeout(resolve, 1000));
      await logout();
    } catch (error) {
      setToastMessage('Error al eliminar la cuenta');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = () => {
    if (user?.rol === 'propietario') {
      const propietario = user as PropietarioProducto;
      return propietario.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.nombre}`;
    }
    return `https://api.dicebear.com/7.x/initials/svg?seed=${user?.nombre || 'Usuario'}`;
  };

  const getSubscriptionBadge = () => {
    if (user?.rol === 'gestor') {
      const gestor = user as GestorVentas;
      return gestor.esPro ? (
        <IonChip color="success">
          <IonIcon icon={medalOutline} />
          <IonLabel>Gestor Pro</IonLabel>
        </IonChip>
      ) : (
        <IonChip color="medium">
          <IonLabel>Plan Básico</IonLabel>
        </IonChip>
      );
    } else {
      const propietario = user as PropietarioProducto;
      const planColors = {
        gratuito: 'medium',
        basico: 'primary',
        premium: 'success'
      };
      return (
        <IonChip color={planColors[propietario.planSuscripcion]}>
          <IonIcon icon={starOutline} />
          <IonLabel>Plan {propietario.planSuscripcion}</IonLabel>
        </IonChip>
      );
    }
  };

  const getStatistics = () => {
    if (user?.rol === 'gestor') {
      const gestor = user as GestorVentas;
      return {
        ventas: gestor.ventasTotales,
        clientes: gestor.clientesPotenciales,
        comisiones: formatCurrency(gestor.comisionesGanadas)
      };
    }
    return null;
  };

  const stats = getStatistics();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mi Perfil</IonTitle>
          <IonButtons slot="end">
            {!editMode ? (
              <IonButton onClick={() => setEditMode(true)}>
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
            ) : (
              <IonButton onClick={() => {
                setEditMode(false);
                loadUserData();
              }}>
                Cancelar
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {loading && <IonProgressBar type="indeterminate" />}

        {/* Header del perfil */}
        <div className="profile-header">
          <IonAvatar className="profile-avatar" onClick={() => setShowImageActionSheet(true)}>
            <img src={getAvatarUrl()} alt="Avatar" />
            <div className="avatar-overlay">
              <IonIcon icon={cameraOutline} />
            </div>
          </IonAvatar>
          <h2>{user?.nombre}</h2>
          <p>{user?.email}</p>
          {getSubscriptionBadge()}
          <IonText color="medium">
            <p>Miembro desde {user && formatDistanceToNow(new Date(user.fechaRegistro), { 
              addSuffix: true,
              locale: es 
            })}</p>
          </IonText>
        </div>

        {/* Estadísticas para gestores */}
        {stats && (
          <IonCard className="stats-card">
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <div className="stat-item">
                      <IonIcon icon={cartOutline} color="primary" />
                      <h3>{stats.ventas}</h3>
                      <p>Ventas totales</p>
                    </div>
                  </IonCol>
                  <IonCol>
                    <div className="stat-item">
                      <IonIcon icon={peopleOutline} color="tertiary" />
                      <h3>{stats.clientes}</h3>
                      <p>Clientes potenciales</p>
                    </div>
                  </IonCol>
                  <IonCol>
                    <div className="stat-item">
                      <IonIcon icon={cashOutline} color="success" />
                      <h3>{stats.comisiones}</h3>
                      <p>Comisiones ganadas</p>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )}

        {/* Información personal */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información Personal</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem lines={editMode ? 'full' : 'none'}>
                <IonIcon icon={personOutline} slot="start" />
                <IonLabel position={editMode ? 'floating' : 'stacked'}>Nombre completo</IonLabel>
                {editMode ? (
                  <IonInput
                    value={nombre}
                    onIonChange={e => setNombre(e.detail.value!)}
                  />
                ) : (
                  <IonNote slot="end">{nombre}</IonNote>
                )}
              </IonItem>

              <IonItem lines={editMode ? 'full' : 'none'}>
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel position={editMode ? 'floating' : 'stacked'}>Email</IonLabel>
                {editMode ? (
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={e => setEmail(e.detail.value!)}
                  />
                ) : (
                  <IonNote slot="end">{email}</IonNote>
                )}
              </IonItem>

              <IonItem lines={editMode ? 'full' : 'none'}>
                <IonIcon icon={callOutline} slot="start" />
                <IonLabel position={editMode ? 'floating' : 'stacked'}>Teléfono</IonLabel>
                {editMode ? (
                  <IonInput
                    type="tel"
                    value={telefono}
                    onIonChange={e => setTelefono(e.detail.value!)}
                  />
                ) : (
                  <IonNote slot="end">{telefono || 'No especificado'}</IonNote>
                )}
              </IonItem>

              <IonItem lines={editMode ? 'full' : 'none'}>
                <IonIcon icon={locationOutline} slot="start" />
                <IonLabel position={editMode ? 'floating' : 'stacked'}>Provincia</IonLabel>
                {editMode ? (
                  <IonInput
                    value={provincia}
                    onIonChange={e => setProvincia(e.detail.value!)}
                  />
                ) : (
                  <IonNote slot="end">{provincia}</IonNote>
                )}
              </IonItem>

              <IonItem lines="none">
                <IonIcon icon={locationOutline} slot="start" />
                <IonLabel position={editMode ? 'floating' : 'stacked'}>Municipio</IonLabel>
                {editMode ? (
                  <IonInput
                    value={municipio}
                    onIonChange={e => setMunicipio(e.detail.value!)}
                  />
                ) : (
                  <IonNote slot="end">{municipio}</IonNote>
                )}
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Información específica del rol */}
        {user?.rol === 'gestor' ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Información de Gestor</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem lines={editMode ? 'full' : 'none'}>
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Nombre de usuario</IonLabel>
                  {editMode ? (
                    <IonInput
                      value={nombreUsuario}
                      onIonChange={e => setNombreUsuario(e.detail.value!)}
                    />
                  ) : (
                    <IonNote slot="end">{nombreUsuario}</IonNote>
                  )}
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Red social principal</IonLabel>
                  {editMode ? (
                    <IonInput
                      value={redSocialPrincipal}
                      onIonChange={e => setRedSocialPrincipal(e.detail.value!)}
                      placeholder="https://..."
                    />
                  ) : (
                    <IonNote slot="end">{redSocialPrincipal || 'No especificada'}</IonNote>
                  )}
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Información del Negocio</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem lines={editMode ? 'full' : 'none'}>
                  <IonIcon icon={businessOutline} slot="start" />
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Nombre de la marca</IonLabel>
                  {editMode ? (
                    <IonInput
                      value={nombreMarca}
                      onIonChange={e => setNombreMarca(e.detail.value!)}
                    />
                  ) : (
                    <IonNote slot="end">{nombreMarca}</IonNote>
                  )}
                </IonItem>

                <IonItem lines={editMode ? 'full' : 'none'}>
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Tipo de producto</IonLabel>
                  {editMode ? (
                    <IonInput
                      value={tipoProducto}
                      onIonChange={e => setTipoProducto(e.detail.value!)}
                    />
                  ) : (
                    <IonNote slot="end">{tipoProducto}</IonNote>
                  )}
                </IonItem>

                <IonItem lines={editMode ? 'full' : 'none'}>
                  <IonIcon icon={locationOutline} slot="start" />
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Dirección de recogida</IonLabel>
                  {editMode ? (
                    <IonTextarea
                      value={direccionRecogida}
                      onIonChange={e => setDireccionRecogida(e.detail.value!)}
                      rows={2}
                    />
                  ) : (
                    <IonNote slot="end" className="text-wrap">{direccionRecogida}</IonNote>
                  )}
                </IonItem>

                <IonItem lines={editMode ? 'full' : 'none'}>
                  <IonIcon icon={timeOutline} slot="start" />
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Horario de atención</IonLabel>
                  {editMode ? (
                    <IonInput
                      value={horarioAtencion}
                      onIonChange={e => setHorarioAtencion(e.detail.value!)}
                    />
                  ) : (
                    <IonNote slot="end">{horarioAtencion || 'No especificado'}</IonNote>
                  )}
                </IonItem>

                <IonItem lines="none">
                  <IonLabel position={editMode ? 'floating' : 'stacked'}>Descripción del negocio</IonLabel>
                  {editMode ? (
                    <IonTextarea
                      value={descripcionNegocio}
                      onIonChange={e => setDescripcionNegocio(e.detail.value!)}
                      rows={3}
                    />
                  ) : (
                    <IonNote slot="end" className="text-wrap">{descripcionNegocio || 'No especificada'}</IonNote>
                  )}
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        {/* Configuración */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Configuración</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonListHeader>
                <IonLabel>Notificaciones</IonLabel>
              </IonListHeader>
              
              <IonItem>
                <IonIcon icon={notificationsOutline} slot="start" />
                <IonLabel>Nuevos pedidos</IonLabel>
                <IonToggle
                  checked={notificacionesPedidos}
                  onIonChange={e => setNotificacionesPedidos(e.detail.checked)}
                />
              </IonItem>

              <IonItem>
                <IonIcon icon={cashOutline} slot="start" />
                <IonLabel>Ventas completadas</IonLabel>
                <IonToggle
                  checked={notificacionesVentas}
                  onIonChange={e => setNotificacionesVentas(e.detail.checked)}
                />
              </IonItem>

              <IonItem lines="none">
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel>Anuncios y novedades</IonLabel>
                <IonToggle
                  checked={notificacionesAnuncios}
                  onIonChange={e => setNotificacionesAnuncios(e.detail.checked)}
                />
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Seguridad */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Seguridad</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem button onClick={() => setShowPasswordModal(true)}>
                <IonIcon icon={lockClosedOutline} slot="start" color="primary" />
                <IonLabel>Cambiar contraseña</IonLabel>
              </IonItem>

              <IonItem button onClick={logout} lines="none">
                <IonIcon icon={logOutOutline} slot="start" color="warning" />
                <IonLabel color="warning">Cerrar sesión</IonLabel>
              </IonItem>

              <IonItem button onClick={() => setShowDeleteAlert(true)} lines="none">
                <IonIcon icon={trashOutline} slot="start" color="danger" />
                <IonLabel color="danger">Eliminar cuenta</IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Botón de guardar en modo edición */}
        {editMode && (
          <div className="ion-padding">
            <IonButton
              expand="block"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              <IonIcon slot="start" icon={saveOutline} />
              Guardar Cambios
            </IonButton>
          </div>
        )}

        {/* Modal de cambio de contraseña */}
        <IonModal isOpen={showPasswordModal} onDidDismiss={() => setShowPasswordModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Cambiar Contraseña</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowPasswordModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="ion-padding">
              <IonItem>
                <IonLabel position="floating">Contraseña actual</IonLabel>
                <IonInput
                  type="password"
                  value={currentPassword}
                  onIonChange={e => setCurrentPassword(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Nueva contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={newPassword}
                  onIonChange={e => setNewPassword(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Confirmar nueva contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonChange={e => setConfirmPassword(e.detail.value!)}
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || loading}
                className="save-button"
              >
                Cambiar Contraseña
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Action Sheet para imagen de perfil */}
        <IonActionSheet
          isOpen={showImageActionSheet}
          onDidDismiss={() => setShowImageActionSheet(false)}
          header="Cambiar foto de perfil"
          buttons={[
            {
              text: 'Tomar foto',
              icon: cameraOutline,
              handler: handleImageUpload
            },
            {
              text: 'Elegir de galería',
              icon: imageOutline,
              handler: handleImageUpload
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />

        {/* Alert de eliminación de cuenta */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'¿Eliminar cuenta?'}
          message={'Esta acción no se puede deshacer. Se eliminarán todos tus datos de forma permanente.'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: handleDeleteAccount
            }
          ]}
        />

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

export default Perfil;
