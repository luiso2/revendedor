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
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonNote,
  IonChip,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonText,
  IonBadge,
  IonActionSheet,
  IonAlert,
  IonToggle,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonTextarea
} from '@ionic/react';
import {
  peopleOutline,
  personOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  trendingUpOutline,
  trendingDownOutline,
  cashOutline,
  cartOutline,
  starOutline,
  callOutline,
  mailOutline,
  logoWhatsapp,
  ellipsisVerticalOutline,
  createOutline,
  banOutline,
  chatbubbleOutline,
  statsChartOutline,
  medalOutline,
  timeOutline,
  locationOutline,
  calendarOutline
} from 'ionicons/icons';
import { propietarioService } from '../../services/mockData';
import { GestorVentas, Pedido } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './Gestores.css';

interface GestorStats {
  gestor: GestorVentas;
  ventasDelMes: number;
  pedidosDelMes: number;
  montoTotalVentas: number;
  comisionesPendientes: number;
  pedidosPendientes: Pedido[];
  tasaConversion: number;
  ranking: number;
  isActive: boolean;
}

const Gestores: React.FC = () => {
  const [gestores, setGestores] = useState<GestorStats[]>([]);
  const [filteredGestores, setFilteredGestores] = useState<GestorStats[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'activos' | 'inactivos' | 'destacados'>('todos');
  const [selectedGestor, setSelectedGestor] = useState<GestorStats | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterGestores();
  }, [gestores, searchText, selectedFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gestoresData, pedidosData] = await Promise.all([
        propietarioService.getGestores(),
        propietarioService.getMisPedidos()
      ]);
      
      setPedidos(pedidosData);
      
      // Calcular estadísticas para cada gestor
      const gestoresConStats: GestorStats[] = gestoresData.map((gestor, index) => {
        const pedidosGestor = pedidosData.filter(p => p.gestorId === gestor.id);
        const pedidosDelMes = pedidosGestor.filter(p => {
          const fecha = new Date(p.fechaCreacion);
          const ahora = new Date();
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        });
        
        const ventasDelMes = pedidosDelMes.filter(p => 
          p.estado === 'entregado_pago_recibido' || p.estado === 'cerrado'
        ).length;
        
        const montoTotalVentas = pedidosDelMes
          .filter(p => p.estado === 'entregado_pago_recibido' || p.estado === 'cerrado')
          .reduce((sum, p) => sum + p.precioTotal, 0);
        
        const comisionesPendientes = pedidosGestor
          .filter(p => p.estado === 'entregado_pago_recibido')
          .reduce((sum, p) => sum + p.comisionGestor, 0);
        
        const pedidosPendientes = pedidosGestor.filter(p => 
          p.estado === 'pendiente' || p.estado === 'coordinando' || p.estado === 'en_entrega'
        );
        
        const tasaConversion = gestor.clientesPotenciales > 0 
          ? (gestor.ventasTotales / gestor.clientesPotenciales) * 100 
          : 0;
        
        return {
          gestor,
          ventasDelMes,
          pedidosDelMes: pedidosDelMes.length,
          montoTotalVentas,
          comisionesPendientes,
          pedidosPendientes,
          tasaConversion,
          ranking: index + 1,
          isActive: pedidosDelMes.length > 0
        };
      });
      
      // Ordenar por ventas del mes
      gestoresConStats.sort((a, b) => b.ventasDelMes - a.ventasDelMes);
      
      // Asignar ranking
      gestoresConStats.forEach((g, index) => {
        g.ranking = index + 1;
      });
      
      setGestores(gestoresConStats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setToastMessage('Error al cargar los gestores');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const filterGestores = () => {
    let filtered = gestores;

    if (searchText) {
      filtered = filtered.filter(g =>
        g.gestor.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        g.gestor.email.toLowerCase().includes(searchText.toLowerCase()) ||
        g.gestor.telefono?.includes(searchText)
      );
    }

    switch (selectedFilter) {
      case 'activos':
        filtered = filtered.filter(g => g.isActive);
        break;
      case 'inactivos':
        filtered = filtered.filter(g => !g.isActive);
        break;
      case 'destacados':
        filtered = filtered.filter(g => g.ventasDelMes >= 5 || g.gestor.esPro);
        break;
    }

    setFilteredGestores(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const getRankingIcon = (ranking: number) => {
    if (ranking === 1) return '🥇';
    if (ranking === 2) return '🥈';
    if (ranking === 3) return '🥉';
    return null;
  };

  const getPerformanceColor = (tasaConversion: number) => {
    if (tasaConversion >= 30) return 'success';
    if (tasaConversion >= 15) return 'warning';
    return 'danger';
  };

  const handleCall = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleWhatsApp = (gestor: GestorVentas) => {
    const mensaje = encodeURIComponent(`Hola ${gestor.nombre}, ¿cómo estás? Quería hablar contigo sobre las ventas.`);
    const telefono = gestor.telefono?.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const openActionSheet = (gestorStats: GestorStats) => {
    setSelectedGestor(gestorStats);
    setShowActionSheet(true);
  };

  const openMessageModal = (gestorStats: GestorStats) => {
    setSelectedGestor(gestorStats);
    setMessage('');
    setShowMessageModal(true);
  };

  const handleSendMessage = async () => {
    if (!selectedGestor || !message) return;

    try {
      await propietarioService.enviarMensaje({
        destinatarios: [selectedGestor.gestor.id],
        asunto: 'Mensaje directo',
        contenido: message
      });
      
      setToastMessage('Mensaje enviado exitosamente');
      setShowToast(true);
      setShowMessageModal(false);
    } catch (error) {
      setToastMessage('Error al enviar el mensaje');
      setShowToast(true);
    }
  };

  const handleToggleGestorStatus = async (gestorStats: GestorStats) => {
    // En un caso real, aquí se actualizaría el estado del gestor
    setToastMessage(`Gestor ${gestorStats.isActive ? 'desactivado' : 'activado'} exitosamente`);
    setShowToast(true);
    await loadData();
  };

  const getTotalStats = () => {
    return {
      totalGestores: gestores.length,
      gestoresActivos: gestores.filter(g => g.isActive).length,
      ventasTotalesMes: gestores.reduce((sum, g) => sum + g.ventasDelMes, 0),
      montoTotalMes: gestores.reduce((sum, g) => sum + g.montoTotalVentas, 0)
    };
  };

  const stats = getTotalStats();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mis Gestores</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar gestores..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedFilter}
            onIonChange={e => setSelectedFilter(e.detail.value as any)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos ({stats.totalGestores})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="activos">
              <IonLabel>Activos ({stats.gestoresActivos})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="inactivos">
              <IonLabel>Inactivos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="destacados">
              <IonLabel>Destacados</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {/* Resumen general */}
        <IonCard className="summary-card">
          <IonCardHeader>
            <IonCardTitle>Resumen del Mes</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={peopleOutline} color="primary" />
                    <div>
                      <h3>{stats.totalGestores}</h3>
                      <p>Gestores totales</p>
                    </div>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={checkmarkCircleOutline} color="success" />
                    <div>
                      <h3>{stats.gestoresActivos}</h3>
                      <p>Gestores activos</p>
                    </div>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={cartOutline} color="tertiary" />
                    <div>
                      <h3>{stats.ventasTotalesMes}</h3>
                      <p>Ventas del mes</p>
                    </div>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="summary-item">
                    <IonIcon icon={cashOutline} color="warning" />
                    <div>
                      <h3>{formatCurrency(stats.montoTotalMes)}</h3>
                      <p>Monto total</p>
                    </div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Lista de gestores */}
        {filteredGestores.length === 0 && !loading ? (
          <div className="empty-state">
            <IonIcon icon={peopleOutline} />
            <h2>No hay gestores</h2>
            <p>No se encontraron gestores con los filtros aplicados</p>
          </div>
        ) : (
          <IonList>
            {filteredGestores.map((gestorStats) => (
              <IonCard key={gestorStats.gestor.id} className="gestor-card">
                <IonCardContent>
                  <IonItem lines="none" className="gestor-header">
                    <IonAvatar slot="start">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${gestorStats.gestor.nombre}`} 
                        alt={gestorStats.gestor.nombre} 
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>
                        {getRankingIcon(gestorStats.ranking)} {gestorStats.gestor.nombre}
                      </h2>
                      <p>{gestorStats.gestor.email}</p>
                      {gestorStats.gestor.telefono && (
                        <p><IonIcon icon={callOutline} /> {gestorStats.gestor.telefono}</p>
                      )}
                    </IonLabel>
                    <IonButton
                      fill="clear"
                      slot="end"
                      onClick={() => openActionSheet(gestorStats)}
                    >
                      <IonIcon slot="icon-only" icon={ellipsisVerticalOutline} />
                    </IonButton>
                  </IonItem>

                  <div className="gestor-badges">
                    {gestorStats.gestor.esPro && (
                      <IonChip color="success">
                        <IonIcon icon={medalOutline} />
                        <IonLabel>Gestor Pro</IonLabel>
                      </IonChip>
                    )}
                    <IonChip color={gestorStats.isActive ? 'success' : 'medium'}>
                      <IonIcon icon={gestorStats.isActive ? checkmarkCircleOutline : timeOutline} />
                      <IonLabel>{gestorStats.isActive ? 'Activo' : 'Inactivo'}</IonLabel>
                    </IonChip>
                    <IonChip color={getPerformanceColor(gestorStats.tasaConversion)}>
                      <IonIcon icon={statsChartOutline} />
                      <IonLabel>{gestorStats.tasaConversion.toFixed(1)}% conversión</IonLabel>
                    </IonChip>
                  </div>

                  <IonGrid className="gestor-stats">
                    <IonRow>
                      <IonCol size="6">
                        <div className="stat-box">
                          <IonText color="medium">
                            <p>Ventas del mes</p>
                          </IonText>
                          <h3>{gestorStats.ventasDelMes}</h3>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="stat-box">
                          <IonText color="medium">
                            <p>Pedidos pendientes</p>
                          </IonText>
                          <h3>{gestorStats.pedidosPendientes.length}</h3>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="stat-box">
                          <IonText color="medium">
                            <p>Monto vendido</p>
                          </IonText>
                          <h3>{formatCurrency(gestorStats.montoTotalVentas)}</h3>
                        </div>
                      </IonCol>
                      <IonCol size="6">
                        <div className="stat-box">
                          <IonText color="medium">
                            <p>Comisiones pendientes</p>
                          </IonText>
                          <h3 className="text-warning">{formatCurrency(gestorStats.comisionesPendientes)}</h3>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  <div className="gestor-info">
                    <IonText color="medium">
                      <p><IonIcon icon={locationOutline} /> {gestorStats.gestor.municipio}, {gestorStats.gestor.provincia}</p>
                      <p><IonIcon icon={calendarOutline} /> Registrado {formatDistanceToNow(new Date(gestorStats.gestor.fechaRegistro), { addSuffix: true, locale: es })}</p>
                    </IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

        {/* Modal para enviar mensaje */}
        <IonModal isOpen={showMessageModal} onDidDismiss={() => setShowMessageModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Enviar mensaje a {selectedGestor?.gestor.nombre}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMessageModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="ion-padding">
              <IonItem>
                <IonLabel position="floating">Mensaje</IonLabel>
                <IonTextarea
                  value={message}
                  onIonChange={e => setMessage(e.detail.value!)}
                  rows={6}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSendMessage}
                disabled={!message}
                className="send-button"
              >
                Enviar Mensaje
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header={selectedGestor?.gestor.nombre}
          buttons={[
            {
              text: 'WhatsApp',
              icon: logoWhatsapp,
              handler: () => {
                if (selectedGestor) handleWhatsApp(selectedGestor.gestor);
              }
            },
            {
              text: 'Llamar',
              icon: callOutline,
              handler: () => {
                if (selectedGestor?.gestor.telefono) handleCall(selectedGestor.gestor.telefono);
              }
            },
            {
              text: 'Enviar email',
              icon: mailOutline,
              handler: () => {
                if (selectedGestor) handleEmail(selectedGestor.gestor.email);
              }
            },
            {
              text: 'Enviar mensaje',
              icon: chatbubbleOutline,
              handler: () => {
                if (selectedGestor) openMessageModal(selectedGestor);
              }
            },
            {
              text: selectedGestor?.isActive ? 'Desactivar gestor' : 'Activar gestor',
              icon: selectedGestor?.isActive ? banOutline : checkmarkCircleOutline,
              role: selectedGestor?.isActive ? 'destructive' : undefined,
              handler: () => {
                if (selectedGestor) handleToggleGestorStatus(selectedGestor);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
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

export default Gestores;
