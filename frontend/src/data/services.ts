import { 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Shield, 
  Banknote, 
  Calculator,
  type LucideIcon
} from 'lucide-react';

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const services: ServiceData[] = [
  {
    id: 'cuentas',
    name: 'Cuentas',
    description: 'Apertura y gestión de cuentas bancarias',
    icon: PiggyBank,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'tarjetas',
    name: 'Tarjetas',
    description: 'Solicitud y activación de tarjetas',
    icon: CreditCard,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'prestamos',
    name: 'Préstamos',
    description: 'Solicitudes de crédito y préstamos',
    icon: Banknote,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'inversiones',
    name: 'Inversiones',
    description: 'Asesoría en productos de inversión',
    icon: TrendingUp,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    id: 'seguros',
    name: 'Seguros',
    description: 'Cotización y contratación de seguros',
    icon: Shield,
    color: 'bg-teal-500 hover:bg-teal-600',
  },
  {
    id: 'empresas',
    name: 'Empresarial',
    description: 'Servicios para empresas y negocios',
    icon: Calculator,
    color: 'bg-indigo-500 hover:bg-indigo-600',
  },
];