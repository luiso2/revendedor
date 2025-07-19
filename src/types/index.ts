// Tipos de usuario
export type UserRole = 'gestor' | 'propietario';

// Usuario base
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  provincia: string;
  municipio: string;
  rol: UserRole;
  fechaRegistro: Date;
}

// Gestor de Ventas
export interface GestorVentas extends User {
  rol: 'gestor';
  nombreUsuario: string;
  redSocialPrincipal?: string;
  esPro: boolean;
  clientesPotenciales: number;
  ventasTotales: number;
  comisionesGanadas: number;
}

// Propietario de Producto
export interface PropietarioProducto extends User {
  rol: 'propietario';
  nombreMarca: string;
  tipoProducto: string;
  direccionRecogida: string;
  descripcionNegocio?: string;
  horarioAtencion?: string;
  logoUrl?: string;
  planSuscripcion: 'gratuito' | 'basico' | 'premium';
}

// Producto
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  imagenes: string[];
  precio: number;
  comision: number; // Porcentaje o monto fijo
  tipoComision: 'porcentaje' | 'fijo';
  stock: number;
  categoria: string;
  propietarioId: string;
  propietarioNombre: string;
  estado: 'activo' | 'inactivo' | 'proximamente';
  peso?: number;
  dimensiones?: string;
  fechaCreacion: Date;
}

// Estados del pedido
export type EstadoPedido = 
  | 'pendiente' 
  | 'coordinando' 
  | 'listo_entrega'
  | 'en_entrega' 
  | 'entregado_pago_recibido' 
  | 'cerrado'
  | 'cancelado';

// Pedido
export interface Pedido {
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  comisionGestor: number;
  gestorId: string;
  gestorNombre: string;
  propietarioId: string;
  propietarioNombre: string;
  cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
    notas?: string;
  };
  estado: EstadoPedido;
  historialEstados: {
    estado: EstadoPedido;
    fecha: Date;
    nota?: string;
  }[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  notasInternas?: string;
}

// Cliente (para CRM del gestor)
export interface Cliente {
  id: string;
  gestorId: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  estado: 'potencial' | 'contactado' | 'cliente' | 'no_interesado';
  notas?: string;
  ultimoContacto?: Date;
  fechaCreacion: Date;
  recordatorios?: {
    fecha: Date;
    mensaje: string;
  }[];
}

// Sugerencia de producto
export interface SugerenciaProducto {
  id: string;
  gestorId: string;
  gestorNombre: string;
  titulo: string;
  descripcion: string;
  categoriaRecomendada?: string;
  demandaEstimada?: string;
  fecha: Date;
  estado: 'pendiente' | 'revisado' | 'implementado' | 'rechazado';
}

// Mensaje/Anuncio
export interface Mensaje {
  id: string;
  remitenteId: string;
  remitenteNombre: string;
  destinatarios: string[]; // IDs de usuarios o 'todos'
  asunto: string;
  contenido: string;
  fecha: Date;
  leido: boolean;
  tipo: 'anuncio' | 'directo' | 'sistema';
}

// Estadísticas del dashboard
export interface EstadisticasGestor {
  pedidosPendientes: number;
  pedidosEnEntrega: number;
  gananciasPorCobrar: number;
  clientesPotenciales: number;
  ventasMes: number;
  comisionesMes: number;
  productosVendidos: {
    productoId: string;
    nombre: string;
    cantidad: number;
  }[];
}

export interface EstadisticasPropietario {
  nuevosPedidos: number;
  pedidosEnCoordinacion: number;
  montoPendienteRecibir: number;
  productosActivos: number;
  gestoresActivos: number;
  ventasMes: number;
  productosMasVendidos: {
    productoId: string;
    nombre: string;
    cantidad: number;
  }[];
  mejoresGestores: {
    gestorId: string;
    nombre: string;
    ventas: number;
  }[];
}
