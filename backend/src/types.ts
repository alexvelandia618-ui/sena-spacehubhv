export type RolUsuario = 'Aprendiz' | 'Instructor' | 'Administrador';

export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
  password: string;
  role: RolUsuario;
}

export interface UsuarioPublico {
  id: number;
  nombreCompleto: string;
  email: string;
  role: RolUsuario;
}

export interface Equipo {
  id: number;
  placaSena: string;
  marcaModelo: string;
  ram: string;
  ambiente: string;
  estado: 'Operativo' | 'En Mantenimiento';
}

export interface JwtPayload {
  sub: number;
  name: string;
  email: string;
  role: RolUsuario;
}
