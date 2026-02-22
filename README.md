# MpAngular - Ejemplo de Integración SSO

Este proyecto es una aplicación de ejemplo diseñada para demostrar la integración y uso de la librería de autenticación `mma-sso-session-guard`.

## Ejecución Local

Para ejecutar la aplicación en modo de desarrollo con HMR y SSL habilitado, utiliza el siguiente comando en PowerShell:

```powershell
$env:NODE_NO_WARNINGS="1" ; cls ; ng serve --host=127.0.0.1 --ssl --port 4203 
```

## Gestión de la Librería Local (mma-sso-session-guard)

Esta aplicación utiliza la librería `mma-sso-session-guard`, la cual se distribuye y consume localmente como un archivo empaquetado (`.tgz`). A continuación se detallan las instrucciones para su gestión.

### Instalación

Para instalar la librería por primera vez desde el archivo local `mma-sso-session-guard-1.0.0.tgz` ubicado en la raíz (o ajusta la ruta según corresponda):

```bash
npm install ./mma-sso-session-guard-1.0.0.tgz
```

### Actualización

Si has generado una nueva versión del paquete `.tgz` y necesitas actualizarla en este proyecto, es recomendable seguir estos pasos para asegurar que se tome la nueva versión correctamente:

1.  **Desinstalar la versión actual:**
    ```bash
    npm uninstall mma-sso-session-guard
    ```

2.  **Limpiar caché (opcional pero recomendado si hay problemas):**
    ```bash
    npm cache clean --force
    ```

3.  **Instalar la nueva versión:**
    ```bash
    npm install ./mma-sso-session-guard-1.0.0.tgz
    ```

### Desinstalación

Para eliminar completamente la librería del proyecto:

```bash
npm uninstall mma-sso-session-guard
```