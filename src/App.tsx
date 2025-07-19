import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Pages */
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Catalogo from './pages/Catalogo';
import Ventas from './pages/Ventas';
import Pedidos from './pages/Pedidos';
import Ganancias from './pages/Ganancias';
import Cuentas from './pages/Cuentas';
import Inventario from './pages/Inventario';
import Clientes from './pages/Clientes';
import Gestores from './pages/Gestores';
import Perfil from './pages/Perfil';
import Herramientas from './pages/Herramientas';
import {
  Novedades,
  TiendaPro,
  Comunicacion,
  Estadisticas,
  Suscripcion
} from './pages/PlaceholderPages';

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';

setupIonicReact();

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <IonReactRouter>
      <IonSplitPane contentId="main">
        {user && <Menu />}
        <IonRouterOutlet id="main">
          <Route path="/login" exact={true}>
            {user ? <Redirect to="/dashboard" /> : <Login />}
          </Route>
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" exact={true}>
            {user ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
          
          {/* Rutas para Gestor */}
          <Route path="/catalogo" exact={true}>
            {user?.rol === 'gestor' ? <Catalogo /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/ventas" exact={true}>
            {user?.rol === 'gestor' ? <Ventas /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/ganancias" exact={true}>
            {user?.rol === 'gestor' ? <Ganancias /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/clientes" exact={true}>
            {user?.rol === 'gestor' ? <Clientes /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/herramientas" exact={true}>
            {user?.rol === 'gestor' ? <Herramientas /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/novedades" exact={true}>
            {user?.rol === 'gestor' ? <Novedades /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/tienda-pro" exact={true}>
            {user?.rol === 'gestor' ? <TiendaPro /> : <Redirect to="/dashboard" />}
          </Route>
          
          {/* Rutas para Propietario */}
          <Route path="/inventario" exact={true}>
            {user?.rol === 'propietario' ? <Inventario /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/pedidos" exact={true}>
            {user?.rol === 'propietario' ? <Pedidos /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/cuentas" exact={true}>
            {user?.rol === 'propietario' ? <Cuentas /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/gestores" exact={true}>
            {user?.rol === 'propietario' ? <Gestores /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/comunicacion" exact={true}>
            {user?.rol === 'propietario' ? <Comunicacion /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/estadisticas" exact={true}>
            {user?.rol === 'propietario' ? <Estadisticas /> : <Redirect to="/dashboard" />}
          </Route>
          <Route path="/suscripcion" exact={true}>
            {user?.rol === 'propietario' ? <Suscripcion /> : <Redirect to="/dashboard" />}
          </Route>
          
          {/* Rutas comunes */}
          <Route path="/perfil" exact={true}>
            {user ? <Perfil /> : <Redirect to="/login" />}
          </Route>
          
          <Route path="/" exact={true}>
            <Redirect to={user ? "/dashboard" : "/login"} />
          </Route>
          
          {/* Fallback para rutas antiguas */}
          <Route path="/folder/:name" exact={true}>
            <Page />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </IonApp>
  );
};

export default App;
