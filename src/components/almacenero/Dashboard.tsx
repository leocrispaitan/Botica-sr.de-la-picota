/**
 * Dashboard para el rol de Almacenero
 * 
 * Por ahora, el almacenero comparte la misma interfaz del administrador
 * pero solo tiene acceso a módulos específicos según sus permisos.
 * 
 * En el futuro, este componente puede personalizarse con vistas
 * específicas para las operaciones de almacén.
 */

import AdminDashboard from '../admin/Dashboard';

export default function AlmaceneroDashboard({ onLogout }: { onLogout?: () => void }) {
  return <AdminDashboard onLogout={onLogout} />;
}
