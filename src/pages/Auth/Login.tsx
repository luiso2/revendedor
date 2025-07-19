import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, businessOutline, bagHandleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [userType, setUserType] = useState<UserRole>('gestor');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [provincia, setProvincia] = useState('');
  const [municipio, setMunicipio] = useState('');
  
  // Campos específicos para gestor
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [redSocial, setRedSocial] = useState('');
  
  // Campos específicos para propietario
  const [nombreMarca, setNombreMarca] = useState('');
  const [tipoProducto, setTipoProducto] = useState('');
  const [direccionRecogida, setDireccionRecogida] = useState('');
  const [descripcionNegocio, setDescripcionNegocio] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await login(email, password, userType);
        setToastMessage(`¡Bienvenido!`);
        setShowToast(true);
        setTimeout(() => {
          history.push('/dashboard');
        }, 1000);
      } else {
        // Register
        const userData = {
          nombre,
          email,
          password,
          telefono,
          provincia,
          municipio,
          rol: userType,
          ...(userType === 'gestor' ? {
            nombreUsuario,
            redSocialPrincipal: redSocial
          } : {
            nombreMarca,
            tipoProducto,
            direccionRecogida,
            descripcionNegocio
          })
        };
        
        // Por ahora, el registro no está implementado en el contexto
        // await authService.register(userData);
        setToastMessage('Registro no implementado en esta demo. Use el login.');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Error: ' + (error as Error).message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  // Para demo: cargar credenciales de ejemplo
  const loadDemoCredentials = () => {
    if (userType === 'gestor') {
      setEmail('juan@email.com');
      setPassword('demo123');
    } else {
      setEmail('carlos@empresa.com');
      setPassword('demo123');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <div className="logo-container">
                  <IonImg src="/assets/logo.png" alt="VendeMax" className="app-logo" />
                  <h1 className="app-title">VendeMax</h1>
                  <p className="app-subtitle">Tu plataforma para emprender y vender</p>
                </div>

                <IonCard className="login-card">
                  <IonCardHeader>
                    <IonCardTitle>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</IonCardTitle>
                  </IonCardHeader>
                  
                  <IonCardContent>
                    <IonSegment value={userType} onIonChange={e => setUserType(e.detail.value as UserRole)}>
                      <IonSegmentButton value="gestor">
                        <IonLabel>
                          <IonIcon icon={bagHandleOutline} />
                          <p>Gestor de Ventas</p>
                        </IonLabel>
                      </IonSegmentButton>
                      <IonSegmentButton value="propietario">
                        <IonLabel>
                          <IonIcon icon={businessOutline} />
                          <p>Propietario</p>
                        </IonLabel>
                      </IonSegmentButton>
                    </IonSegment>

                    <form onSubmit={handleSubmit}>
                      {!isLogin && (
                        <>
                          <IonItem>
                            <IonIcon icon={personOutline} slot="start" />
                            <IonLabel position="floating">Nombre Completo</IonLabel>
                            <IonInput
                              type="text"
                              value={nombre}
                              onIonChange={e => setNombre(e.detail.value!)}
                              required
                            />
                          </IonItem>

                          {userType === 'gestor' && (
                            <>
                              <IonItem>
                                <IonLabel position="floating">Nombre de Usuario</IonLabel>
                                <IonInput
                                  type="text"
                                  value={nombreUsuario}
                                  onIonChange={e => setNombreUsuario(e.detail.value!)}
                                  required
                                />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="floating">Red Social Principal (opcional)</IonLabel>
                                <IonInput
                                  type="text"
                                  value={redSocial}
                                  onIonChange={e => setRedSocial(e.detail.value!)}
                                  placeholder="ej. https://wa.me/595981234567"
                                />
                              </IonItem>
                            </>
                          )}

                          {userType === 'propietario' && (
                            <>
                              <IonItem>
                                <IonLabel position="floating">Nombre de la Marca/Negocio</IonLabel>
                                <IonInput
                                  type="text"
                                  value={nombreMarca}
                                  onIonChange={e => setNombreMarca(e.detail.value!)}
                                  required
                                />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="floating">Tipo de Producto</IonLabel>
                                <IonInput
                                  type="text"
                                  value={tipoProducto}
                                  onIonChange={e => setTipoProducto(e.detail.value!)}
                                  placeholder="ej. Artesanía, Ropa, Electrónica"
                                  required
                                />
                              </IonItem>
                              <IonItem>
                                <IonLabel position="floating">Dirección de Recogida</IonLabel>
                                <IonInput
                                  type="text"
                                  value={direccionRecogida}
                                  onIonChange={e => setDireccionRecogida(e.detail.value!)}
                                  required
                                />
                              </IonItem>
                            </>
                          )}

                          <IonItem>
                            <IonLabel position="floating">Teléfono</IonLabel>
                            <IonInput
                              type="tel"
                              value={telefono}
                              onIonChange={e => setTelefono(e.detail.value!)}
                            />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="floating">Provincia</IonLabel>
                            <IonInput
                              type="text"
                              value={provincia}
                              onIonChange={e => setProvincia(e.detail.value!)}
                              required
                            />
                          </IonItem>

                          <IonItem>
                            <IonLabel position="floating">Municipio</IonLabel>
                            <IonInput
                              type="text"
                              value={municipio}
                              onIonChange={e => setMunicipio(e.detail.value!)}
                              required
                            />
                          </IonItem>
                        </>
                      )}

                      <IonItem>
                        <IonIcon icon={mailOutline} slot="start" />
                        <IonLabel position="floating">Correo Electrónico</IonLabel>
                        <IonInput
                          type="email"
                          value={email}
                          onIonChange={e => setEmail(e.detail.value!)}
                          required
                        />
                      </IonItem>

                      <IonItem>
                        <IonIcon icon={lockClosedOutline} slot="start" />
                        <IonLabel position="floating">Contraseña</IonLabel>
                        <IonInput
                          type="password"
                          value={password}
                          onIonChange={e => setPassword(e.detail.value!)}
                          required
                        />
                      </IonItem>

                      <IonButton
                        expand="block"
                        type="submit"
                        className="ion-margin-top"
                        disabled={loading}
                      >
                        {loading ? <IonSpinner name="crescent" /> : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                      </IonButton>

                      {isLogin && (
                        <IonButton
                          expand="block"
                          fill="outline"
                          onClick={loadDemoCredentials}
                          className="ion-margin-top"
                        >
                          Usar credenciales de demo
                        </IonButton>
                      )}
                    </form>

                    <div className="toggle-auth ion-text-center ion-margin-top">
                      <IonText>
                        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <a onClick={() => setIsLogin(!isLogin)}>
                          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                        </a>
                      </IonText>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

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

export default Login;
