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
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonCard,
  IonCardContent,
  IonText,
  IonBadge,
  IonActionSheet,
  IonAlert,
  IonDatetime,
  IonPopover,
  IonItemSliding,
  IonItemOptions,
  IonItemOption
} from '@ionic/react';
import {
  addOutline,
  personOutline,
  callOutline,
  mailOutline,
  locationOutline,
  createOutline,
  trashOutline,
  calendarOutline,
  notificationsOutline,
  logoWhatsapp,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
  ellipsisVerticalOutline,
  peopleOutline,
  personAddOutline,
  starOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { gestorService } from '../../services/mockData';
import { Cliente } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './Clientes.css';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<'todos' | Cliente['estado']>('todos');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form fields
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState<Cliente['estado']>('potencial');
  const [notas, setNotas] = useState('');

  // Reminder fields
  const [reminderDate, setReminderDate] = useState<string>('');
  const [reminderMessage, setReminderMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [clientes, searchText, selectedEstado]);

  const loadData = async () => {
    setLoading(true);
    try {
      const clientesData = await gestorService.getMisClientes();
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setToastMessage('Error al cargar los clientes');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const filterClientes = () => {
    let filtered = clientes;

    if (searchText) {
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        c.telefono?.includes(searchText) ||
        c.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedEstado !== 'todos') {
      filtered = filtered.filter(c => c.estado === selectedEstado);
    }

    // Ordenar por última actividad
    filtered.sort((a, b) => {
      const dateA = a.ultimoContacto || a.fechaCreacion;
      const dateB = b.ultimoContacto || b.fechaCreacion;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    setFilteredClientes(filtered);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadData();
    event.detail.complete();
  };

  const getEstadoColor = (estado: Cliente['estado']) => {
    switch (estado) {
      case 'cliente':
        return 'success';
      case 'potencial':
        return 'primary';
      case 'contactado':
        return 'warning';
      case 'no_interesado':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getEstadoIcon = (estado: Cliente['estado']) => {
    switch (estado) {
      case 'cliente':
        return checkmarkCircleOutline;
      case 'potencial':
        return starOutline;
      case 'contactado':
        return timeOutline;
      case 'no_interesado':
        return closeCircleOutline;
      default:
        return personOutline;
    }
  };

  const getEstadoLabel = (estado: Cliente['estado']) => {
    switch (estado) {
      case 'cliente':
        return 'Cliente activo';
      case 'potencial':
        return 'Cliente potencial';
      case 'contactado':
        return 'Contactado';
      case 'no_interesado':
        return 'No interesado';
      default:
        return estado;
    }
  };

  const openClienteModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingCliente(cliente);
      setNombre(cliente.nombre);
      setTelefono(cliente.telefono);
      setEmail(cliente.email || '');
      setDireccion(cliente.direccion || '');
      setEstado(cliente.estado);
      setNotas(cliente.notas || '');
    } else {
      setEditingCliente(null);
      resetForm();
    }
    setShowClienteModal(true);
  };

  const resetForm = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setDireccion('');
    setEstado('potencial');
    setNotas('');
  };

  const handleSaveCliente = async () => {
    try {
      const clienteData = {
        nombre,
        telefono,
        email: email || undefined,
        direccion: direccion || undefined,
        estado,
        notas: notas || undefined,
        ultimoContacto: new Date()
      };

      if (editingCliente) {
        await gestorService.actualizarCliente(editingCliente.id, clienteData);
        setToastMessage('Cliente actualizado exitosamente');
      } else {
        await gestorService.crearCliente(clienteData);
        setToastMessage('Cliente creado exitosamente');
      }

      setShowToast(true);
      setShowClienteModal(false);
      await loadData();
    } catch (error) {
      setToastMessage('Error al guardar el cliente');
      setShowToast(true);
    }
  };

  const handleDeleteCliente = async () => {
    if (!selectedCliente) return;

    try {
      await gestorService.actualizarCliente(selectedCliente.id, { estado: 'no_interesado' });
      setToastMessage('Cliente marcado como no interesado');
      setShowToast(true);
      setShowDeleteAlert(false);
      await loadData();
    } catch (error) {
      setToastMessage('Error al actualizar el cliente');
      setShowToast(true);
    }
  };

  const handleWhatsApp = (cliente: Cliente) => {
    const mensaje = encodeURIComponent(`Hola ${cliente.nombre}, ¿cómo estás? Me gustaría mostrarte algunos productos que podrían interesarte.`);
    const telefono = cliente.telefono.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
    
    // Actualizar último contacto
    gestorService.actualizarCliente(cliente.id, { ultimoContacto: new Date() });
  };

  const handleCall = (telefono: string) => {
    window.location.href = `tel:${telefono}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const openActionSheet = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowActionSheet(true);
  };

  const openReminderModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setReminderDate(new Date().toISOString());
    setReminderMessage('');
    setShowReminderModal(true);
  };

  const handleSaveReminder = async () => {
    if (!selectedCliente || !reminderDate || !reminderMessage) return;

    try {
      const recordatorio = {
        fecha: new Date(reminderDate),
        mensaje: reminderMessage
      };

      const recordatorios = selectedCliente.recordatorios || [];
      recordatorios.push(recordatorio);

      await gestorService.actualizarCliente(selectedCliente.id, { recordatorios });
      setToastMessage('Recordatorio creado exitosamente');
      setShowToast(true);
      setShowReminderModal(false);
      await loadData();
    } catch (error) {
      setToastMessage('Error al crear el recordatorio');
      setShowToast(true);
    }
  };

  const getClienteStats = () => {
    const stats = {
      total: clientes.length,
      activos: clientes.filter(c => c.estado === 'cliente').length,
      potenciales: clientes.filter(c => c.estado === 'potencial').length,
      contactados: clientes.filter(c => c.estado === 'contactado').length
    };
    return stats;
  };

  const stats = getClienteStats();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Mis Clientes</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => openClienteModal()}>
              <IonIcon slot="icon-only" icon={personAddOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Buscar clientes..."
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            scrollable
            value={selectedEstado}
            onIonChange={e => setSelectedEstado(e.detail.value as any)}
          >
            <IonSegmentButton value="todos">
              <IonLabel>Todos ({stats.total})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cliente">
              <IonLabel>Activos ({stats.activos})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="potencial">
              <IonLabel>Potenciales ({stats.potenciales})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="contactado">
              <IonLabel>Contactados ({stats.contactados})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="no_interesado">
              <IonLabel>No interesados</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {/* Resumen de estadísticas */}
        <IonCard className="stats-card">
          <IonCardContent>
            <div className="stats-grid">
              <div className="stat-item">
                <IonIcon icon={peopleOutline} color="primary" />
                <h3>{stats.total}</h3>
                <p>Total clientes</p>
              </div>
              <div className="stat-item">
                <IonIcon icon={checkmarkCircleOutline} color="success" />
                <h3>{stats.activos}</h3>
                <p>Clientes activos</p>
              </div>
              <div className="stat-item">
                <IonIcon icon={starOutline} color="warning" />
                <h3>{stats.potenciales}</h3>
                <p>Potenciales</p>
              </div>
              <div className="stat-item">
                <IonIcon icon={timeOutline} color="tertiary" />
                <h3>{stats.contactados}</h3>
                <p>Contactados</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {filteredClientes.length === 0 && !loading ? (
          <div className="empty-state">
            <IonIcon icon={peopleOutline} />
            <h2>No hay clientes</h2>
            <p>Agrega tu primer cliente para comenzar</p>
            <IonButton onClick={() => openClienteModal()}>
              <IonIcon slot="start" icon={personAddOutline} />
              Agregar Cliente
            </IonButton>
          </div>
        ) : (
          <IonList>
            {filteredClientes.map((cliente) => (
              <IonItemSliding key={cliente.id}>
                <IonItem button onClick={() => openActionSheet(cliente)}>
                  <IonAvatar slot="start" className="cliente-avatar">
                    <div className={`avatar-placeholder ${cliente.estado}`}>
                      {cliente.nombre.charAt(0).toUpperCase()}
                    </div>
                  </IonAvatar>
                  <IonLabel>
                    <h2>{cliente.nombre}</h2>
                    <p>
                      <IonIcon icon={callOutline} /> {cliente.telefono}
                      {cliente.email && (
                        <>
                          {' • '}
                          <IonIcon icon={mailOutline} /> {cliente.email}
                        </>
                      )}
                    </p>
                    {cliente.direccion && (
                      <p>
                        <IonIcon icon={locationOutline} /> {cliente.direccion}
                      </p>
                    )}
                    {cliente.notas && (
                      <p className="cliente-notas">{cliente.notas}</p>
                    )}
                  </IonLabel>
                  <IonNote slot="end" className="cliente-meta">
                    <IonChip color={getEstadoColor(cliente.estado)}>
                      <IonIcon icon={getEstadoIcon(cliente.estado)} />
                      <IonLabel>{getEstadoLabel(cliente.estado)}</IonLabel>
                    </IonChip>
                    {cliente.ultimoContacto && (
                      <p className="ultimo-contacto">
                        Último contacto: {formatDistanceToNow(new Date(cliente.ultimoContacto), { 
                          addSuffix: true,
                          locale: es 
                        })}
                      </p>
                    )}
                    {cliente.recordatorios && cliente.recordatorios.length > 0 && (
                      <IonBadge color="danger">
                        <IonIcon icon={notificationsOutline} />
                        {cliente.recordatorios.length}
                      </IonBadge>
                    )}
                  </IonNote>
                </IonItem>
                
                <IonItemOptions side="end">
                  <IonItemOption color="success" onClick={() => handleWhatsApp(cliente)}>
                    <IonIcon slot="icon-only" icon={logoWhatsapp} />
                  </IonItemOption>
                  <IonItemOption color="primary" onClick={() => handleCall(cliente.telefono)}>
                    <IonIcon slot="icon-only" icon={callOutline} />
                  </IonItemOption>
                  {cliente.email && (
                    <IonItemOption color="tertiary" onClick={() => handleEmail(cliente.email!)}>
                      <IonIcon slot="icon-only" icon={mailOutline} />
                    </IonItemOption>
                  )}
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        {/* FAB para agregar cliente */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => openClienteModal()}>
            <IonIcon icon={personAddOutline} />
          </IonFabButton>
        </IonFab>

        {/* Modal para crear/editar cliente */}
        <IonModal isOpen={showClienteModal} onDidDismiss={() => setShowClienteModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowClienteModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="ion-padding">
              <IonItem>
                <IonLabel position="floating">Nombre completo *</IonLabel>
                <IonInput
                  value={nombre}
                  onIonChange={e => setNombre(e.detail.value!)}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Teléfono *</IonLabel>
                <IonInput
                  type="tel"
                  value={telefono}
                  onIonChange={e => setTelefono(e.detail.value!)}
                  placeholder="0981234567"
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={e => setEmail(e.detail.value!)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Dirección</IonLabel>
                <IonTextarea
                  value={direccion}
                  onIonChange={e => setDireccion(e.detail.value!)}
                  rows={2}
                />
              </IonItem>

              <IonItem>
                <IonLabel>Estado del cliente</IonLabel>
                <IonSelect
                  value={estado}
                  onIonChange={e => setEstado(e.detail.value)}
                >
                  <IonSelectOption value="potencial">Cliente potencial</IonSelectOption>
                  <IonSelectOption value="contactado">Contactado</IonSelectOption>
                  <IonSelectOption value="cliente">Cliente activo</IonSelectOption>
                  <IonSelectOption value="no_interesado">No interesado</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Notas</IonLabel>
                <IonTextarea
                  value={notas}
                  onIonChange={e => setNotas(e.detail.value!)}
                  rows={4}
                  placeholder="Preferencias, observaciones, etc."
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSaveCliente}
                disabled={!nombre || !telefono}
                className="save-button"
              >
                {editingCliente ? 'Actualizar Cliente' : 'Crear Cliente'}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Modal para recordatorios */}
        <IonModal isOpen={showReminderModal} onDidDismiss={() => setShowReminderModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Recordatorio</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowReminderModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="ion-padding">
              <IonItem>
                <IonLabel position="stacked">Fecha y hora *</IonLabel>
                <IonDatetime
                  value={reminderDate}
                  onIonChange={e => setReminderDate(e.detail.value!)}
                  min={new Date().toISOString()}
                  preferWheel={true}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Mensaje del recordatorio *</IonLabel>
                <IonTextarea
                  value={reminderMessage}
                  onIonChange={e => setReminderMessage(e.detail.value!)}
                  rows={4}
                  placeholder="Ej: Mostrar nuevos productos, hacer seguimiento, etc."
                  required
                />
              </IonItem>

              <IonButton
                expand="block"
                onClick={handleSaveReminder}
                disabled={!reminderDate || !reminderMessage}
                className="save-button"
              >
                Crear Recordatorio
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Action Sheet */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header={selectedCliente?.nombre}
          buttons={[
            {
              text: 'WhatsApp',
              icon: logoWhatsapp,
              handler: () => {
                if (selectedCliente) handleWhatsApp(selectedCliente);
              }
            },
            {
              text: 'Llamar',
              icon: callOutline,
              handler: () => {
                if (selectedCliente) handleCall(selectedCliente.telefono);
              }
            },
            {
              text: 'Editar',
              icon: createOutline,
              handler: () => {
                if (selectedCliente) openClienteModal(selectedCliente);
              }
            },
            {
              text: 'Agregar recordatorio',
              icon: notificationsOutline,
              handler: () => {
                if (selectedCliente) openReminderModal(selectedCliente);
              }
            },
            {
              text: 'Marcar como no interesado',
              role: 'destructive',
              icon: trashOutline,
              handler: () => {
                setShowDeleteAlert(true);
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            }
          ]}
        />

        {/* Alert de confirmación */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={'Confirmar acción'}
          message={`¿Estás seguro de marcar a "${selectedCliente?.nombre}" como no interesado?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Confirmar',
              role: 'destructive',
              handler: handleDeleteCliente
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

export default Clientes;
