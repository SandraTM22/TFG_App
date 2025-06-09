# Sistema De Gestión De Expedientes Judiciales
En el ámbito de la gestión de expedientes judiciales, es fundamental contar con herramientas que permitan la organización eficiente de la información, la actualización de estados y la generación de informes detallados. Con este proyecto propongo el desarrollo de una plataforma web que facilite el seguimiento de expedientes judiciales, optimice la consulta de información y permita la elaboración de informes personalizados. La carencia de un sistema automatizado genera retrasos, errores y dificultades para localizar expedientes específicos en situaciones críticas, como cambios de jurisprudencia o la sustitución de procuradores. La solución que propongo, busca gestionar estas deficiencias y proporcionar una herramienta eficiente para el equipo de trabajo. El objetivo principal de este proyecto es desarrollar una plataforma web que permita:

- Gestionar y seguir el estado de los expedientes y costas judiciales.
- Actualizar la información de cada expediente y las costas de forma sencilla y ágil.
- Generar informes personalizados mediante filtros específicos.
- Mejorar la organización interna del equipo de trabajo y facilitar la toma de decisiones frente a cambios legales o imprevistos.

## 🛠️ Requisitos Previos

- **Variables de entorno:** Edita `.env.local` y ajusta la variable `DATABASE_URL` con tus credenciales locales (usuario, contraseña, host, puerto, base de datos).
- **Docker** y **Docker Compose** instalados en tu sistema.
- **Angular CLI**, **Node.js** y **npm** (para el front-end).
- **Composer** (para dependencias PHP).
- **Lexit** y sus _pair keys_ (no incluidas en el repositorio). Configura tu `.env.local` con las variables de Lexit antes de levantar la aplicación.

---

## 🚀 Instalación y Puesta en Marcha

1. **Clona el repositorio**  
   ```bash
   git clone <git@github.com:SandraTM22/TFG_App.git>
   ```

2. **Instala dependencias**  

    ### Backend (Symfony)
     ```bash
    composer install
    ```

    #### Frontend (Angular)
     ```bash
    npm install
    ```

3. **Instala Faker** (necesario para poblar datos de prueba)
    ```bash
    composer require fakerphp/faker --dev
    ```

4. **Levanta los contenedores** (desde tu carpeta raiz)
    ```bash
    docker compose up -d
    ```

5. **Inicializa la base de datos y datos de prueba**(desde tu carpeta raiz)
    ```bash
    # DROP y CREATE
    docker compose exec backend php bin/console doctrine:database:drop --force
    docker compose exec backend php bin/console doctrine:database:create

    # Migraciones
    docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction

    # Crear usuario admin (solo la primera vez)
    docker compose exec backend php bin/console app:create-default-users

    # Poblar con datos de prueba (usuarios, clientes, expedientes, etc.)
    docker compose exec backend php bin/console app:populate-db
    ```

## 🔐 Usuarios de Prueba

Tras ejecutar `app:create-admin-user` y `app:populate-db`, se crean tres usuarios fijos para tus pruebas:

| Rol              | Email               | Contraseña    |
|------------------|---------------------|---------------|
| Super Admin      | admin@example.com   | admin123     |
| Usuario Estándar | standard@example.com| userpass      |
| Usuario Limitado | limited@example.com | limitedpass   |


---

## 📚 Tecnologías Utilizadas

- **Backend:** Symfony 6, Doctrine ORM, PHP 8
- **Frontend:** Angular, Tailwind CSS
- **Autenticación:** JWT (LexikJWTAuthenticationBundle)
- **Base de datos:** PostgreSQL
- **Contenedores:** Docker, Docker Compose
