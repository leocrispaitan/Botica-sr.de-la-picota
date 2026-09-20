# Componentes de Almacenero

Esta carpeta contiene los componentes específicos para el rol de **Almacenero**.

## Estado Actual

Por ahora, el almacenero comparte la misma interfaz del administrador (`Dashboard.tsx` redirige a `admin/Dashboard.tsx`), pero con permisos restringidos según su rol. El sistema de permisos controla qué módulos puede ver y usar.

## Módulos Accesibles

El almacenero típicamente tiene acceso a:
- ✅ Gestión de Productos
- ✅ Gestión de Lotes
- ✅ Control de Stock Crítico
- ✅ Registro de Compras
- ✅ Historial de Compras
- ✅ Reportes de Inventario

## Desarrollo Futuro

Cuando se requiera personalizar la experiencia del almacenero, puedes crear componentes específicos aquí:

```
almacenero/
├── Dashboard.tsx              # Vista principal personalizada
├── ProductsManagement.tsx     # Gestión de productos simplificada
├── LotesManagement.tsx        # Control de lotes
├── StockCriticoManagement.tsx # Alertas de stock bajo
├── NewPurchase.tsx            # Nueva compra
├── PurchaseHistory.tsx        # Historial de compras
└── ReportesInventario.tsx     # Reportes de inventario
```

## Notas de Desarrollo

- Los permisos se gestionan a través del hook `usePermissions()`
- Para crear vistas personalizadas, importa los componentes de admin y adáptalos
- Mantén la coherencia con el diseño general del sistema
