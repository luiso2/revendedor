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
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonModal,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  IonText,
  IonBadge,
  IonFab,
  IonFabButton,
  IonFabList,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonImg,
  IonThumbnail
} from '@ionic/react';
import {
  rocketOutline,
  shareOutline,
  downloadOutline,
  copyOutline,
  imagesOutline,
  documentTextOutline,
  qrCodeOutline,
  logoWhatsapp,
  logoFacebook,
  logoInstagram,
  pricetagOutline,
  megaphoneOutline,
  brushOutline,
  calculatorOutline,
  checkmarkCircleOutline,
  timeOutline,
  trendingUpOutline,
  starOutline,
  peopleOutline,
  createOutline,
  colorPaletteOutline,
  textOutline,
  imageOutline
} from 'ionicons/icons';
import { gestorService } from '../../services/mockData';
import { Producto } from '../../types';
import { formatCurrency } from '../../utils/currency';
import './Herramientas.css';

interface PlantillaMensaje {
  id: string;
  titulo: string;
  contenido: string;
  categoria: 'saludo' | 'oferta' | 'seguimiento' | 'cierre';
  icono: string;
}

interface MaterialPromocional {
  id: string;
  tipo: 'imagen' | 'story' | 'flyer';
  nombre: string;
  descripcion: string;
  miniatura: string;
  plantilla: string;
}

const Herramientas: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'mensajes' | 'material' | 'calculadora' | 'qr'>('mensajes');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showMensajeModal, setShowMensajeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCalculadoraModal, setShowCalculadoraModal] = useState(false);
  
  // Estados para plantillas de mensajes
  const [selectedPlantilla, setSelectedPlantilla] = useState<PlantillaMensaje | null>(null);
  const [mensajePersonalizado, setMensajePersonalizado] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [productoNombre, setProductoNombre] = useState('');
  const [precio, setPrecio] = useState('');
  
  // Estados para material promocional
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPromocional | null>(null);
  const [tituloPromo, setTituloPromo] = useState('');
  const [descripcionPromo, setDescripcionPromo] = useState('');
  
  // Estados para calculadora
  const [costoProducto, setCostoProducto] = useState('');
  const [porcentajeGanancia, setPorcentajeGanancia] = useState('20');
  const [precioVenta, setPrecioVenta] = useState('');
  const [ganancia, setGanancia] = useState('');

  const plantillasMensajes: PlantillaMensaje[] = [
    {
      id: '1',
      titulo: 'Saludo inicial',
      contenido: '¡Hola {cliente}! 👋 Soy {tu_nombre}, espero que estés teniendo un excelente día. Me gustaría mostrarte algunos productos increíbles que podrían interesarte.',
      categoria: 'saludo',
      icono: peopleOutline
    },
    {
      id: '2',
      titulo: 'Presentación de producto',
      contenido: '🎯 {producto}\n💰 Precio especial: {precio}\n✨ {descripcion}\n\n¿Te gustaría más información o fotos adicionales?',
      categoria: 'oferta',
      icono: pricetagOutline
    },
    {
      id: '3',
      titulo: 'Oferta limitada',
      contenido: '⏰ ¡OFERTA POR TIEMPO LIMITADO! ⏰\n\n🔥 {producto}\n💸 Precio regular: {precio_regular}\n✅ Precio especial HOY: {precio_oferta}\n\n📱 Escríbeme YA para asegurar tu pedido!',
      categoria: 'oferta',
      icono: timeOutline
    },
    {
      id: '4',
      titulo: 'Seguimiento',
      contenido: 'Hola {cliente} 😊\n\n¿Pudiste revisar la información sobre {producto} que te envié? Me encantaría saber qué te pareció y si tienes alguna pregunta.',
      categoria: 'seguimiento',
      icono: checkmarkCircleOutline
    },
    {
      id: '5',
      titulo: 'Cierre de venta',
      contenido: '¡Excelente elección {cliente}! 🎉\n\n📦 Producto: {producto}\n💰 Total: {precio}\n🚚 Entrega: {direccion}\n\n¿Confirmo tu pedido?',
      categoria: 'cierre',
      icono: trendingUpOutline
    },
    {
      id: '6',
      titulo: 'Beneficios del producto',
      contenido: '✨ {producto} ✨\n\n✅ Beneficio 1\n✅ Beneficio 2\n✅ Beneficio 3\n\n🎁 Además, con tu compra hoy recibes {bonus}\n\n¡No te quedes sin el tuyo!',
      categoria: 'oferta',
      icono: starOutline
    }
  ];

  const materialesPromocionales: MaterialPromocional[] = [
    {
      id: '1',
      tipo: 'imagen',
      nombre: 'Post cuadrado - Oferta',
      descripcion: 'Ideal para Instagram y Facebook',
      miniatura: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=OFERTA',
      plantilla: 'oferta-cuadrada'
    },
    {
      id: '2',
      tipo: 'story',
      nombre: 'Story - Nuevo producto',
      descripcion: 'Perfecto para Instagram y WhatsApp Status',
      miniatura: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=NUEVO',
      plantilla: 'story-nuevo'
    },
    {
      id: '3',
      tipo: 'flyer',
      nombre: 'Flyer promocional',
      descripcion: 'Para compartir en grupos',
      miniatura: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=PROMO',
      plantilla: 'flyer-promo'
    },
    {
      id: '4',
      tipo: 'imagen',
      nombre: 'Catálogo de productos',
      descripcion: 'Muestra varios productos',
      miniatura: 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=CATALOGO',
      plantilla: 'catalogo'
    }
  ];

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    event.detail.complete();
  };

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setToastMessage('Texto copiado al portapapeles');
    setShowToast(true);
  };

  const personalizarMensaje = (plantilla: PlantillaMensaje) => {
    let mensaje = plantilla.contenido;
    
    // Reemplazar variables
    mensaje = mensaje.replace('{cliente}', clienteNombre || '[Nombre del cliente]');
    mensaje = mensaje.replace('{tu_nombre}', 'Tu nombre');
    mensaje = mensaje.replace('{producto}', productoNombre || '[Nombre del producto]');
    mensaje = mensaje.replace('{precio}', precio ? formatCurrency(parseFloat(precio)) : '[Precio]');
    mensaje = mensaje.replace('{precio_regular}', precio ? formatCurrency(parseFloat(precio) * 1.2) : '[Precio regular]');
    mensaje = mensaje.replace('{precio_oferta}', precio ? formatCurrency(parseFloat(precio)) : '[Precio oferta]');
    mensaje = mensaje.replace('{descripcion}', '[Descripción del producto]');
    mensaje = mensaje.replace('{direccion}', '[Dirección de entrega]');
    mensaje = mensaje.replace('{bonus}', '[Regalo o beneficio adicional]');
    
    setMensajePersonalizado(mensaje);
  };

  const compartirMensaje = async (mensaje: string, plataforma: 'whatsapp' | 'facebook' | 'general') => {
    if (plataforma === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
    } else if (plataforma === 'facebook') {
      // Facebook no permite pre-llenar mensajes, solo abrir Messenger
      window.open('https://www.facebook.com/messages/new/', '_blank');
      copiarTexto(mensaje);
      setToastMessage('Mensaje copiado. Pégalo en Facebook Messenger');
      setShowToast(true);
    } else {
      if (navigator.share) {
        try {
          await navigator.share({
            text: mensaje
          });
        } catch (err) {
          copiarTexto(mensaje);
        }
      } else {
        copiarTexto(mensaje);
      }
    }
  };

  const calcularPrecioVenta = () => {
    if (!costoProducto) return;
    
    const costo = parseFloat(costoProducto);
    const porcentaje = parseFloat(porcentajeGanancia) / 100;
    const gananciaCalculada = costo * porcentaje;
    const precioVentaCalculado = costo + gananciaCalculada;
    
    setGanancia(gananciaCalculada.toFixed(0));
    setPrecioVenta(precioVentaCalculado.toFixed(0));
  };

  const calcularGanancia = () => {
    if (!costoProducto || !precioVenta) return;
    
    const costo = parseFloat(costoProducto);
    const venta = parseFloat(precioVenta);
    const gananciaCalculada = venta - costo;
    const porcentajeCalculado = (gananciaCalculada / costo) * 100;
    
    setGanancia(gananciaCalculada.toFixed(0));
    setPorcentajeGanancia(porcentajeCalculado.toFixed(1));
  };

  const generarQR = (texto: string) => {
    // En una implementación real, aquí se generaría un código QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(texto)}`;
    window.open(qrUrl, '_blank');
  };

  const descargarMaterial = (material: MaterialPromocional) => {
    // Simulación de descarga
    setToastMessage(`Descargando ${material.nombre}...`);
    setShowToast(true);
    
    // En una implementación real, aquí se generaría y descargaría el material
    setTimeout(() => {
      setToastMessage('Material descargado exitosamente');
      setShowToast(true);
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Herramientas de Venta</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={selectedTool} onIonChange={e => setSelectedTool(e.detail.value as any)}>
            <IonSegmentButton value="mensajes">
              <IonLabel>Mensajes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="material">
              <IonLabel>Material</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="calculadora">
              <IonLabel>Calculadora</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="qr">
              <IonLabel>QR</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonProgressBar type="indeterminate" />}

        {/* Plantillas de Mensajes */}
        {selectedTool === 'mensajes' && (
          <>
            <div className="section-header">
              <h2>Plantillas de Mensajes</h2>
              <p>Mensajes prediseñados para diferentes situaciones de venta</p>
            </div>

            <IonGrid>
              <IonRow>
                {plantillasMensajes.map((plantilla) => (
                  <IonCol size="12" sizeMd="6" key={plantilla.id}>
                    <IonCard 
                      className="plantilla-card" 
                      button 
                      onClick={() => {
                        setSelectedPlantilla(plantilla);
                        personalizarMensaje(plantilla);
                        setShowMensajeModal(true);
                      }}
                    >
                      <IonCardHeader>
                        <div className="plantilla-header">
                          <IonIcon icon={plantilla.icono} className="plantilla-icon" />
                          <div>
                            <IonCardTitle>{plantilla.titulo}</IonCardTitle>
                            <IonChip color={
                              plantilla.categoria === 'saludo' ? 'primary' :
                              plantilla.categoria === 'oferta' ? 'success' :
                              plantilla.categoria === 'seguimiento' ? 'warning' :
                              'secondary'
                            }>
                              <IonLabel>{plantilla.categoria}</IonLabel>
                            </IonChip>
                          </div>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <p className="mensaje-preview">{plantilla.contenido}</p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </>
        )}

        {/* Material Promocional */}
        {selectedTool === 'material' && (
          <>
            <div className="section-header">
              <h2>Material Promocional</h2>
              <p>Diseños listos para personalizar y compartir</p>
            </div>

            <IonGrid>
              <IonRow>
                {materialesPromocionales.map((material) => (
                  <IonCol size="6" sizeMd="3" key={material.id}>
                    <IonCard 
                      className="material-card"
                      button
                      onClick={() => {
                        setSelectedMaterial(material);
                        setShowMaterialModal(true);
                      }}
                    >
                      <div className="material-thumbnail">
                        <img src={material.miniatura} alt={material.nombre} />
                        <IonChip className="material-type" color={
                          material.tipo === 'imagen' ? 'primary' :
                          material.tipo === 'story' ? 'secondary' :
                          'tertiary'
                        }>
                          <IonLabel>{material.tipo}</IonLabel>
                        </IonChip>
                      </div>
                      <IonCardContent>
                        <h3>{material.nombre}</h3>
                        <p>{material.descripcion}</p>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </>
        )}

        {/* Calculadora de Precios */}
        {selectedTool === 'calculadora' && (
          <>
            <div className="section-header">
              <h2>Calculadora de Precios</h2>
              <p>Calcula el precio de venta ideal para tus productos</p>
            </div>

            <IonCard className="calculadora-card">
              <IonCardContent>
                <IonItem>
                  <IonLabel position="floating">Costo del producto ($)</IonLabel>
                  <IonInput
                    type="number"
                    value={costoProducto}
                    onIonChange={e => setCostoProducto(e.detail.value!)}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Porcentaje de ganancia (%)</IonLabel>
                  <IonInput
                    type="number"
                    value={porcentajeGanancia}
                    onIonChange={e => setPorcentajeGanancia(e.detail.value!)}
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  onClick={calcularPrecioVenta}
                  className="calculate-button"
                >
                  <IonIcon slot="start" icon={calculatorOutline} />
                  Calcular Precio de Venta
                </IonButton>

                <div className="separator">O</div>

                <IonItem>
                  <IonLabel position="floating">Precio de venta deseado ($)</IonLabel>
                  <IonInput
                    type="number"
                    value={precioVenta}
                    onIonChange={e => setPrecioVenta(e.detail.value!)}
                  />
                </IonItem>

                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={calcularGanancia}
                  className="calculate-button"
                >
                  <IonIcon slot="start" icon={calculatorOutline} />
                  Calcular Ganancia
                </IonButton>

                {ganancia && (
                  <div className="resultado-calculo">
                    <h3>Resultado:</h3>
                    <IonGrid>
                      <IonRow>
                        <IonCol>
                          <div className="resultado-item">
                            <p>Costo</p>
                            <h4>{formatCurrency(parseFloat(costoProducto))}</h4>
                          </div>
                        </IonCol>
                        <IonCol>
                          <div className="resultado-item">
                            <p>Ganancia</p>
                            <h4 className="text-success">{formatCurrency(parseFloat(ganancia))}</h4>
                          </div>
                        </IonCol>
                        <IonCol>
                          <div className="resultado-item">
                            <p>Precio Venta</p>
                            <h4 className="text-primary">{formatCurrency(parseFloat(precioVenta))}</h4>
                          </div>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                    <IonChip color="success" className="porcentaje-chip">
                      <IonLabel>{porcentajeGanancia}% de ganancia</IonLabel>
                    </IonChip>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* Generador de QR */}
        {selectedTool === 'qr' && (
          <>
            <div className="section-header">
              <h2>Generador de Códigos QR</h2>
              <p>Crea códigos QR para compartir información rápidamente</p>
            </div>

            <IonCard className="qr-card">
              <IonCardContent>
                <div className="qr-options">
                  <IonButton
                    expand="block"
                    onClick={() => {
                      const whatsappUrl = 'https://wa.me/53';
                      generarQR(whatsappUrl);
                    }}
                  >
                    <IonIcon slot="start" icon={logoWhatsapp} />
                    QR para WhatsApp
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => {
                      const catalogoUrl = 'https://mi-catalogo.com';
                      generarQR(catalogoUrl);
                    }}
                  >
                    <IonIcon slot="start" icon={imagesOutline} />
                    QR para Catálogo
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => {
                      const contacto = 'BEGIN:VCARD\nVERSION:3.0\nFN:Tu Nombre\nTEL:+53\nEND:VCARD';
                      generarQR(contacto);
                    }}
                  >
                    <IonIcon slot="start" icon={peopleOutline} />
                    QR de Contacto
                  </IonButton>
                </div>

                <div className="qr-custom">
                  <h3>Texto personalizado</h3>
                  <IonItem>
                    <IonLabel position="floating">Ingresa el texto o URL</IonLabel>
                    <IonTextarea
                      rows={3}
                      placeholder="https://mi-sitio.com o cualquier texto"
                      onIonChange={e => {
                        const texto = e.detail.value!;
                        if (texto) {
                          setToastMessage('Texto guardado. Usa el botón para generar QR');
                          setShowToast(true);
                        }
                      }}
                    />
                  </IonItem>
                  <IonButton
                    expand="block"
                    fill="solid"
                    color="secondary"
                    onClick={() => {
                      const input = document.querySelector('ion-textarea') as any;
                      if (input && input.value) {
                        generarQR(input.value);
                      }
                    }}
                  >
                    <IonIcon slot="start" icon={qrCodeOutline} />
                    Generar QR Personalizado
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </>
        )}

        {/* Modal para personalizar mensaje */}
        <IonModal isOpen={showMensajeModal} onDidDismiss={() => setShowMensajeModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Personalizar Mensaje</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMensajeModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{selectedPlantilla?.titulo}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                  <IonLabel position="floating">Nombre del cliente</IonLabel>
                  <IonInput
                    value={clienteNombre}
                    onIonChange={e => {
                      setClienteNombre(e.detail.value!);
                      if (selectedPlantilla) personalizarMensaje(selectedPlantilla);
                    }}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Nombre del producto</IonLabel>
                  <IonInput
                    value={productoNombre}
                    onIonChange={e => {
                      setProductoNombre(e.detail.value!);
                      if (selectedPlantilla) personalizarMensaje(selectedPlantilla);
                    }}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Precio ($)</IonLabel>
                  <IonInput
                    type="number"
                    value={precio}
                    onIonChange={e => {
                      setPrecio(e.detail.value!);
                      if (selectedPlantilla) personalizarMensaje(selectedPlantilla);
                    }}
                  />
                </IonItem>

                <div className="mensaje-preview-box">
                  <h3>Vista previa:</h3>
                  <p>{mensajePersonalizado}</p>
                </div>

                <div className="share-buttons">
                  <IonButton
                    expand="block"
                    color="success"
                    onClick={() => compartirMensaje(mensajePersonalizado, 'whatsapp')}
                  >
                    <IonIcon slot="start" icon={logoWhatsapp} />
                    Enviar por WhatsApp
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => copiarTexto(mensajePersonalizado)}
                  >
                    <IonIcon slot="start" icon={copyOutline} />
                    Copiar Mensaje
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => compartirMensaje(mensajePersonalizado, 'general')}
                  >
                    <IonIcon slot="start" icon={shareOutline} />
                    Compartir
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        {/* Modal para material promocional */}
        <IonModal isOpen={showMaterialModal} onDidDismiss={() => setShowMaterialModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Personalizar Material</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowMaterialModal(false)}>Cerrar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedMaterial && (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{selectedMaterial.nombre}</IonCardTitle>
                  <IonCardSubtitle>{selectedMaterial.descripcion}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="material-preview">
                    <img src={selectedMaterial.miniatura} alt={selectedMaterial.nombre} />
                  </div>

                  <IonItem>
                    <IonLabel position="floating">Título principal</IonLabel>
                    <IonInput
                      value={tituloPromo}
                      onIonChange={e => setTituloPromo(e.detail.value!)}
                      placeholder="Ej: OFERTA ESPECIAL"
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="floating">Descripción</IonLabel>
                    <IonTextarea
                      value={descripcionPromo}
                      onIonChange={e => setDescripcionPromo(e.detail.value!)}
                      rows={3}
                      placeholder="Describe tu promoción..."
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Colores</IonLabel>
                    <IonButton slot="end" fill="clear">
                      <IonIcon icon={colorPaletteOutline} />
                    </IonButton>
                  </IonItem>

                  <IonButton
                    expand="block"
                    onClick={() => descargarMaterial(selectedMaterial)}
                  >
                    <IonIcon slot="start" icon={downloadOutline} />
                    Descargar Material
                  </IonButton>

                  <IonButton
                    expand="block"
                    fill="outline"
                    onClick={() => {
                      setToastMessage('Abriendo editor...');
                      setShowToast(true);
                    }}
                  >
                    <IonIcon slot="start" icon={brushOutline} />
                    Editar en Canva
                  </IonButton>
                </IonCardContent>
              </IonCard>
            )}
          </IonContent>
        </IonModal>

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

export default Herramientas;
