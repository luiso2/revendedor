import { 
  GestorVentas, 
  PropietarioProducto, 
  Producto, 
  Pedido, 
  Cliente,
  EstadisticasGestor,
  EstadisticasPropietario,
  SugerenciaProducto,
  Mensaje,
  UserRole
} from '../types';

// Mock de usuario actual (se puede cambiar para probar diferentes roles)
let currentUser: GestorVentas | PropietarioProducto | null = null;

// Establecer un usuario por defecto para desarrollo
// currentUser = mockGestores[0]; // Descomentar para autologin como gestor

// Datos mock de gestores
const mockGestores: GestorVentas[] = [
  {
    id: 'g1',
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '+5352345678',
    provincia: 'La Habana',
    municipio: 'Plaza de la Revolución',
    rol: 'gestor',
    nombreUsuario: 'juanventas',
    redSocialPrincipal: 'https://wa.me/5352345678',
    esPro: false,
    clientesPotenciales: 15,
    ventasTotales: 45,
    comisionesGanadas: 450,
    fechaRegistro: new Date('2024-01-15')
  },
  {
    id: 'g2',
    nombre: 'María García',
    email: 'maria@email.com',
    telefono: '+5353456789',
    provincia: 'La Habana',
    municipio: 'Vedado',
    rol: 'gestor',
    nombreUsuario: 'mariaventas',
    redSocialPrincipal: 'https://facebook.com/mariaventas',
    esPro: true,
    clientesPotenciales: 25,
    ventasTotales: 78,
    comisionesGanadas: 890,
    fechaRegistro: new Date('2023-11-20')
  }
];

// Datos mock de propietarios
const mockPropietarios: PropietarioProducto[] = [
  {
    id: 'p1',
    nombre: 'Carlos Mendoza',
    email: 'carlos@empresa.com',
    telefono: '+5354567890',
    provincia: 'La Habana',
    municipio: 'Centro Habana',
    rol: 'propietario',
    nombreMarca: 'Alimentos del Caribe',
    tipoProducto: 'Alimentos y Bebidas',
    direccionRecogida: 'Calle 23 #156 entre L y M, Vedado',
    descripcionNegocio: 'Distribuidora de alimentos importados y productos locales de calidad',
    horarioAtencion: 'Lun-Vie 8:00-18:00, Sáb 8:00-14:00',
    logoUrl: '/images/alimentos-caribe.png',
    planSuscripcion: 'basico',
    fechaRegistro: new Date('2023-09-10')
  },
  {
    id: 'p2',
    nombre: 'Ana López',
    email: 'ana@dulces.com',
    telefono: '+5355678901',
    provincia: 'La Habana',
    municipio: 'Playa',
    rol: 'propietario',
    nombreMarca: 'Dulces Habana',
    tipoProducto: 'Dulces y Conservas',
    direccionRecogida: 'Avenida 5ta #2408 esq. 24, Miramar',
    descripcionNegocio: 'Dulces artesanales y conservas cubanas de alta calidad',
    horarioAtencion: 'Lun-Sáb 9:00-19:00',
    logoUrl: '/images/dulces-habana.png',
    planSuscripcion: 'premium',
    fechaRegistro: new Date('2023-08-05')
  }
];

// Datos mock de productos
const mockProductos: Producto[] = [
  {
    id: 'prod1',
    nombre: 'Aceite de Cocina Premium',
    descripcion: 'Aceite vegetal de alta calidad, ideal para cocinar y freír. Botella de 1 litro importado.',
    imagenes: ['/images/aceite1.jpg', '/images/aceite2.jpg'],
    precio: 4.50,
    comision: 20,
    tipoComision: 'porcentaje',
    stock: 25,
    categoria: 'Aceites y Condimentos',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 1.0,
    dimensiones: '8cm x 8cm x 25cm',
    fechaCreacion: new Date('2024-01-10')
  },
  {
    id: 'prod2',
    nombre: 'Arroz Grano Largo',
    descripcion: 'Arroz de grano largo premium, bolsa de 5 libras. Ideal para todo tipo de platos.',
    imagenes: ['/images/arroz1.jpg', '/images/arroz2.jpg'],
    precio: 6.00,
    comision: 25,
    tipoComision: 'porcentaje',
    stock: 40,
    categoria: 'Granos y Cereales',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 2.3,
    fechaCreacion: new Date('2024-01-12')
  },
  {
    id: 'prod3',
    nombre: 'Conserva de Frijoles Negros',
    descripcion: 'Frijoles negros en conserva, listos para servir. Lata de 425g. Producto nacional de calidad.',
    imagenes: ['/images/frijoles1.jpg', '/images/frijoles2.jpg'],
    precio: 2.50,
    comision: 15,
    tipoComision: 'porcentaje',
    stock: 60,
    categoria: 'Conservas',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 0.425,
    fechaCreacion: new Date('2024-01-15')
  },
  {
    id: 'prod4',
    nombre: 'Mermelada de Guayaba',
    descripcion: 'Mermelada artesanal de guayaba cubana. Frasco de 350g. Sin conservantes artificiales.',
    imagenes: ['/images/mermelada1.jpg', '/images/mermelada2.jpg'],
    precio: 3.00,
    comision: 20,
    tipoComision: 'porcentaje',
    stock: 35,
    categoria: 'Dulces y Conservas',
    propietarioId: 'p2',
    propietarioNombre: 'Dulces Habana',
    estado: 'activo',
    peso: 0.350,
    fechaCreacion: new Date('2024-01-18')
  },
  {
    id: 'prod5',
    nombre: 'Pasta Italiana Spaghetti',
    descripcion: 'Pasta italiana importada de alta calidad. Paquete de 500g. Perfecta textura al dente.',
    imagenes: ['/images/pasta1.jpg'],
    precio: 2.00,
    comision: 30,
    tipoComision: 'porcentaje',
    stock: 50,
    categoria: 'Pastas',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 0.5,
    dimensiones: '5cm x 25cm x 3cm',
    fechaCreacion: new Date('2024-01-20')
  },
  {
    id: 'prod6',
    nombre: 'Leche en Polvo',
    descripcion: 'Leche en polvo fortificada. Bolsa de 900g. Rica en vitaminas y minerales.',
    imagenes: ['/images/leche1.jpg'],
    precio: 8.00,
    comision: 20,
    tipoComision: 'porcentaje',
    stock: 30,
    categoria: 'Lácteos',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 0.9,
    fechaCreacion: new Date('2024-01-22')
  },
  {
    id: 'prod7',
    nombre: 'Café Molido Cubano',
    descripcion: 'Café cubano molido de primera calidad. Paquete de 250g. Tostado medio.',
    imagenes: ['/images/cafe1.jpg'],
    precio: 5.00,
    comision: 25,
    tipoComision: 'porcentaje',
    stock: 45,
    categoria: 'Bebidas',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    estado: 'activo',
    peso: 0.25,
    fechaCreacion: new Date('2024-01-23')
  },
  {
    id: 'prod8',
    nombre: 'Dulce de Coco',
    descripcion: 'Dulce de coco rallado artesanal. Paquete de 200g. Receta tradicional cubana.',
    imagenes: ['/images/dulce-coco1.jpg'],
    precio: 2.50,
    comision: 25,
    tipoComision: 'porcentaje',
    stock: 20,
    categoria: 'Dulces y Conservas',
    propietarioId: 'p2',
    propietarioNombre: 'Dulces Habana',
    estado: 'proximamente',
    peso: 0.2,
    fechaCreacion: new Date('2024-01-24')
  }
];

// Datos mock de pedidos
const mockPedidos: Pedido[] = [
  {
    id: 'ped1',
    productoId: 'prod1',
    productoNombre: 'Aceite de Cocina Premium',
    cantidad: 2,
    precioUnitario: 4.50,
    precioTotal: 9.00,
    comisionGestor: 1.80,
    gestorId: 'g1',
    gestorNombre: 'Juan Pérez',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    cliente: {
      nombre: 'Roberto Silva',
      telefono: '+5356789012',
      direccion: 'Calle 70 #4512 entre 45 y 47, Marianao',
      notas: 'Llamar antes de entregar'
    },
    estado: 'pendiente',
    historialEstados: [
      {
        estado: 'pendiente',
        fecha: new Date('2024-01-25T10:00:00'),
        nota: 'Pedido generado'
      }
    ],
    fechaCreacion: new Date('2024-01-25T10:00:00'),
    fechaActualizacion: new Date('2024-01-25T10:00:00')
  },
  {
    id: 'ped2',
    productoId: 'prod3',
    productoNombre: 'Conserva de Frijoles Negros',
    cantidad: 5,
    precioUnitario: 2.50,
    precioTotal: 12.50,
    comisionGestor: 1.88,
    gestorId: 'g2',
    gestorNombre: 'María García',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    cliente: {
      nombre: 'Lucia Martínez',
      telefono: '+5357890123',
      direccion: 'Avenida 23 #1856, Vedado'
    },
    estado: 'en_entrega',
    historialEstados: [
      {
        estado: 'pendiente',
        fecha: new Date('2024-01-24T14:00:00')
      },
      {
        estado: 'coordinando',
        fecha: new Date('2024-01-24T16:00:00')
      },
      {
        estado: 'en_entrega',
        fecha: new Date('2024-01-25T09:00:00'),
        nota: 'Salió para entrega'
      }
    ],
    fechaCreacion: new Date('2024-01-24T14:00:00'),
    fechaActualizacion: new Date('2024-01-25T09:00:00')
  },
  {
    id: 'ped3',
    productoId: 'prod7',
    productoNombre: 'Café Molido Cubano',
    cantidad: 3,
    precioUnitario: 5.00,
    precioTotal: 15.00,
    comisionGestor: 3.75,
    gestorId: 'g1',
    gestorNombre: 'Juan Pérez',
    propietarioId: 'p1',
    propietarioNombre: 'Alimentos del Caribe',
    cliente: {
      nombre: 'Miguel Ángel Rodríguez',
      telefono: '+5358901234',
      direccion: 'Calle 41 #2806, Playa'
    },
    estado: 'entregado_pago_recibido',
    historialEstados: [
      {
        estado: 'pendiente',
        fecha: new Date('2024-01-22T11:00:00')
      },
      {
        estado: 'coordinando',
        fecha: new Date('2024-01-22T15:00:00')
      },
      {
        estado: 'en_entrega',
        fecha: new Date('2024-01-23T10:00:00')
      },
      {
        estado: 'entregado_pago_recibido',
        fecha: new Date('2024-01-23T14:00:00'),
        nota: 'Cliente satisfecho, pagó en efectivo'
      }
    ],
    fechaCreacion: new Date('2024-01-22T11:00:00'),
    fechaActualizacion: new Date('2024-01-23T14:00:00'),
    notasInternas: 'Cliente regular, siempre paga puntual'
  }
];

// Datos mock de clientes
const mockClientes: Cliente[] = [
  {
    id: 'cl1',
    gestorId: 'g1',
    nombre: 'Roberto Silva',
    telefono: '+5356789012',
    email: 'roberto@email.com',
    direccion: 'Calle 70 #4512 entre 45 y 47, Marianao',
    estado: 'cliente',
    notas: 'Prefiere entregas en la mañana. Interesado en productos orgánicos.',
    ultimoContacto: new Date('2024-01-25'),
    fechaCreacion: new Date('2024-01-10'),
    recordatorios: [
      {
        fecha: new Date('2024-02-01'),
        mensaje: 'Mostrar nuevos productos de conservas'
      }
    ]
  },
  {
    id: 'cl2',
    gestorId: 'g1',
    nombre: 'Carmen González',
    telefono: '+5357890123',
    direccion: 'Reparto Siboney, Playa',
    estado: 'potencial',
    notas: 'Contactada por Facebook, interesada en productos lácteos',
    fechaCreacion: new Date('2024-01-20')
  },
  {
    id: 'cl3',
    gestorId: 'g2',
    nombre: 'Lucia Martínez',
    telefono: '+5358901234',
    estado: 'cliente',
    direccion: 'Avenida 23 #1856, Vedado',
    notas: 'Clienta frecuente, compra mensualmente',
    ultimoContacto: new Date('2024-01-24'),
    fechaCreacion: new Date('2023-12-15')
  }
];

// Datos mock de sugerencias
const mockSugerencias: SugerenciaProducto[] = [
  {
    id: 'sug1',
    gestorId: 'g1',
    gestorNombre: 'Juan Pérez',
    titulo: 'Productos enlatados variados',
    descripcion: 'Muchos clientes preguntan por atún, sardinas y otros enlatados. Sería ideal tener más variedad.',
    categoriaRecomendada: 'Conservas',
    demandaEstimada: 'Alta - 10+ consultas por semana',
    fecha: new Date('2024-01-20'),
    estado: 'pendiente'
  },
  {
    id: 'sug2',
    gestorId: 'g2',
    gestorNombre: 'María García',
    titulo: 'Harina de trigo',
    descripcion: 'Hay demanda de harina de trigo para repostería, especialmente en presentaciones de 1kg.',
    categoriaRecomendada: 'Granos y Cereales',
    demandaEstimada: 'Media - 5 consultas por semana',
    fecha: new Date('2024-01-18'),
    estado: 'revisado'
  }
];

// Datos mock de mensajes
const mockMensajes: Mensaje[] = [
  {
    id: 'msg1',
    remitenteId: 'p1',
    remitenteNombre: 'Alimentos del Caribe',
    destinatarios: ['todos'],
    asunto: '¡Nuevos productos lácteos!',
    contenido: 'Estimados gestores, la próxima semana tendremos nueva variedad de productos lácteos importados. Prepárense para ofertas especiales.',
    fecha: new Date('2024-01-23'),
    leido: false,
    tipo: 'anuncio'
  },
  {
    id: 'msg2',
    remitenteId: 'sistema',
    remitenteNombre: 'Sistema VendeMax',
    destinatarios: ['g1'],
    asunto: 'Recordatorio: Pedido pendiente',
    contenido: 'Tienes un pedido pendiente de coordinación. Por favor, contacta al propietario.',
    fecha: new Date('2024-01-25'),
    leido: true,
    tipo: 'sistema'
  }
];

// Funciones de autenticación
export const authService = {
  login: async (email: string, password: string, role: UserRole): Promise<GestorVentas | PropietarioProducto> => {
    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Para demo, aceptar cualquier password
    if (role === 'gestor') {
      const gestor = mockGestores.find(g => g.email === email);
      if (gestor) {
        currentUser = gestor;
        localStorage.setItem('currentUser', JSON.stringify(gestor));
        localStorage.setItem('userRole', 'gestor');
        return gestor;
      }
    } else {
      const propietario = mockPropietarios.find(p => p.email === email);
      if (propietario) {
        currentUser = propietario;
        localStorage.setItem('currentUser', JSON.stringify(propietario));
        localStorage.setItem('userRole', 'propietario');
        return propietario;
      }
    }
    
    throw new Error('Credenciales inválidas');
  },

  register: async (userData: any): Promise<GestorVentas | PropietarioProducto> => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...userData,
      id: 'new-' + Date.now(),
      fechaRegistro: new Date()
    };
    
    if (userData.rol === 'gestor') {
      const gestor: GestorVentas = {
        ...newUser,
        esPro: false,
        clientesPotenciales: 0,
        ventasTotales: 0,
        comisionesGanadas: 0
      };
      mockGestores.push(gestor);
      currentUser = gestor;
      return gestor;
    } else {
      const propietario: PropietarioProducto = {
        ...newUser,
        planSuscripcion: 'gratuito'
      };
      mockPropietarios.push(propietario);
      currentUser = propietario;
      return propietario;
    }
  },

  logout: async (): Promise<void> => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
  },

  getCurrentUser: (): GestorVentas | PropietarioProducto | null => {
    if (!currentUser) {
      // Intentar recuperar de localStorage
      const savedUser = localStorage.getItem('currentUser');
      const savedRole = localStorage.getItem('userRole');
      if (savedUser && savedRole) {
        currentUser = JSON.parse(savedUser);
      }
    }
    return currentUser;
  },

  updateProfile: async (updates: Partial<GestorVentas | PropietarioProducto>): Promise<void> => {
    if (currentUser) {
      Object.assign(currentUser, updates);
    }
  }
};

// Servicios para Gestores
export const gestorService = {
  getEstadisticas: async (): Promise<EstadisticasGestor> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gestorId = currentUser?.id || 'g1';
    const pedidosGestor = mockPedidos.filter(p => p.gestorId === gestorId);
    
    return {
      pedidosPendientes: pedidosGestor.filter(p => p.estado === 'pendiente').length,
      pedidosEnEntrega: pedidosGestor.filter(p => p.estado === 'en_entrega').length,
      gananciasPorCobrar: pedidosGestor
        .filter(p => p.estado === 'entregado_pago_recibido')
        .reduce((sum, p) => sum + p.comisionGestor, 0),
      clientesPotenciales: mockClientes.filter(c => c.gestorId === gestorId && c.estado === 'potencial').length,
      ventasMes: pedidosGestor.length,
      comisionesMes: pedidosGestor.reduce((sum, p) => sum + p.comisionGestor, 0),
      productosVendidos: [
        { productoId: 'prod1', nombre: 'Aceite de Cocina', cantidad: 3 },
        { productoId: 'prod7', nombre: 'Café Molido', cantidad: 2 }
      ]
    };
  },

  getProductos: async (filtros?: any): Promise<Producto[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let productos = [...mockProductos];
    
    if (filtros?.categoria) {
      productos = productos.filter(p => p.categoria === filtros.categoria);
    }
    
    if (filtros?.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      productos = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda)
      );
    }
    
    return productos;
  },

  getMisPedidos: async (): Promise<Pedido[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const gestorId = currentUser?.id || 'g1';
    return mockPedidos.filter(p => p.gestorId === gestorId);
  },

  crearPedido: async (pedidoData: any): Promise<Pedido> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const producto = mockProductos.find(p => p.id === pedidoData.productoId);
    if (!producto) throw new Error('Producto no encontrado');
    
    const nuevoPedido: Pedido = {
      id: 'ped-' + Date.now(),
      productoId: pedidoData.productoId,
      productoNombre: producto.nombre,
      cantidad: pedidoData.cantidad,
      precioUnitario: producto.precio,
      precioTotal: producto.precio * pedidoData.cantidad,
      comisionGestor: producto.tipoComision === 'porcentaje' 
        ? (producto.precio * pedidoData.cantidad * producto.comision / 100)
        : producto.comision * pedidoData.cantidad,
      gestorId: currentUser?.id || 'g1',
      gestorNombre: currentUser?.nombre || 'Gestor',
      propietarioId: producto.propietarioId,
      propietarioNombre: producto.propietarioNombre,
      cliente: pedidoData.cliente,
      estado: 'pendiente',
      historialEstados: [{
        estado: 'pendiente',
        fecha: new Date(),
        nota: 'Pedido generado'
      }],
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };
    
    mockPedidos.push(nuevoPedido);
    return nuevoPedido;
  },

  actualizarEstadoPedido: async (pedidoId: string, nuevoEstado: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pedido = mockPedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.estado = nuevoEstado.estado;
      pedido.historialEstados.push({
        estado: nuevoEstado.estado,
        fecha: new Date(),
        nota: nuevoEstado.nota
      });
      pedido.fechaActualizacion = new Date();
    }
  },

  getMisClientes: async (): Promise<Cliente[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const gestorId = currentUser?.id || 'g1';
    return mockClientes.filter(c => c.gestorId === gestorId);
  },

  crearCliente: async (clienteData: any): Promise<Cliente> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoCliente: Cliente = {
      id: 'cl-' + Date.now(),
      gestorId: currentUser?.id || 'g1',
      ...clienteData,
      fechaCreacion: new Date()
    };
    
    mockClientes.push(nuevoCliente);
    return nuevoCliente;
  },

  actualizarCliente: async (clienteId: string, updates: Partial<Cliente>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cliente = mockClientes.find(c => c.id === clienteId);
    if (cliente) {
      Object.assign(cliente, updates);
    }
  },

  crearSugerencia: async (sugerenciaData: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevaSugerencia: SugerenciaProducto = {
      id: 'sug-' + Date.now(),
      gestorId: currentUser?.id || 'g1',
      gestorNombre: currentUser?.nombre || 'Gestor',
      ...sugerenciaData,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    mockSugerencias.push(nuevaSugerencia);
  },

  getMensajes: async (): Promise<Mensaje[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gestorId = currentUser?.id || 'g1';
    return mockMensajes.filter(m => 
      m.destinatarios.includes('todos') || 
      m.destinatarios.includes(gestorId)
    );
  }
};

// Servicios para Propietarios
export const propietarioService = {
  getEstadisticas: async (): Promise<EstadisticasPropietario> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const propietarioId = currentUser?.id || 'p1';
    const pedidosPropietario = mockPedidos.filter(p => p.propietarioId === propietarioId);
    
    return {
      nuevosPedidos: pedidosPropietario.filter(p => p.estado === 'pendiente').length,
      pedidosEnCoordinacion: pedidosPropietario.filter(p => p.estado === 'coordinando').length,
      montoPendienteRecibir: pedidosPropietario
        .filter(p => p.estado === 'entregado_pago_recibido')
        .reduce((sum, p) => sum + (p.precioTotal - p.comisionGestor), 0),
      productosActivos: mockProductos.filter(p => p.propietarioId === propietarioId && p.estado === 'activo').length,
      gestoresActivos: 2, // Mock
      ventasMes: pedidosPropietario.length,
      productosMasVendidos: [
        { productoId: 'prod1', nombre: 'Aceite de Cocina', cantidad: 5 },
        { productoId: 'prod3', nombre: 'Frijoles Negros', cantidad: 3 }
      ],
      mejoresGestores: [
        { gestorId: 'g1', nombre: 'Juan Pérez', ventas: 8 },
        { gestorId: 'g2', nombre: 'María García', ventas: 6 }
      ]
    };
  },

  getMisProductos: async (): Promise<Producto[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const propietarioId = currentUser?.id || 'p1';
    return mockProductos.filter(p => p.propietarioId === propietarioId);
  },

  crearProducto: async (productoData: any): Promise<Producto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nuevoProducto: Producto = {
      id: 'prod-' + Date.now(),
      propietarioId: currentUser?.id || 'p1',
      propietarioNombre: (currentUser as PropietarioProducto)?.nombreMarca || 'Propietario',
      ...productoData,
      fechaCreacion: new Date()
    };
    
    mockProductos.push(nuevoProducto);
    return nuevoProducto;
  },

  actualizarProducto: async (productoId: string, updates: Partial<Producto>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const producto = mockProductos.find(p => p.id === productoId);
    if (producto) {
      Object.assign(producto, updates);
    }
  },

  getMisPedidos: async (): Promise<Pedido[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const propietarioId = currentUser?.id || 'p1';
    return mockPedidos.filter(p => p.propietarioId === propietarioId);
  },

  actualizarEstadoPedido: async (pedidoId: string, nuevoEstado: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pedido = mockPedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.estado = nuevoEstado.estado;
      pedido.historialEstados.push({
        estado: nuevoEstado.estado,
        fecha: new Date(),
        nota: nuevoEstado.nota
      });
      pedido.fechaActualizacion = new Date();
    }
  },

  getGestores: async (): Promise<GestorVentas[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGestores;
  },

  getCuentasPorGestor: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const propietarioId = currentUser?.id || 'p1';
    const cuentas = mockGestores.map(gestor => {
      const pedidosGestor = mockPedidos.filter(p => 
        p.gestorId === gestor.id && 
        p.propietarioId === propietarioId &&
        p.estado === 'entregado_pago_recibido'
      );
      
      const montoTotal = pedidosGestor.reduce((sum, p) => sum + (p.precioTotal - p.comisionGestor), 0);
      
      return {
        gestor,
        pedidosPendientesPago: pedidosGestor,
        montoTotal
      };
    }).filter(cuenta => cuenta.montoTotal > 0);
    
    return cuentas;
  },

  marcarPagoRecibido: async (gestorId: string, pedidosIds: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    pedidosIds.forEach(pedidoId => {
      const pedido = mockPedidos.find(p => p.id === pedidoId);
      if (pedido) {
        pedido.estado = 'cerrado';
        pedido.historialEstados.push({
          estado: 'cerrado',
          fecha: new Date(),
          nota: 'Pago recibido del gestor'
        });
        pedido.fechaActualizacion = new Date();
      }
    });
  },

  enviarMensaje: async (mensajeData: any): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoMensaje: Mensaje = {
      id: 'msg-' + Date.now(),
      remitenteId: currentUser?.id || 'p1',
      remitenteNombre: (currentUser as PropietarioProducto)?.nombreMarca || 'Propietario',
      ...mensajeData,
      fecha: new Date(),
      leido: false,
      tipo: 'anuncio'
    };
    
    mockMensajes.push(nuevoMensaje);
  },

  getSugerencias: async (): Promise<SugerenciaProducto[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSugerencias;
  }
};

// Servicio general para categorías
export const categoriaService = {
  getCategorias: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ['Aceites y Condimentos', 'Granos y Cereales', 'Conservas', 'Lácteos', 'Carnes y Embutidos', 'Bebidas', 'Dulces y Conservas', 'Pastas', 'Panadería', 'Frutas y Vegetales', 'Congelados', 'Otros'];
  }
};
