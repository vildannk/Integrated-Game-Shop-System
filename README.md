# Game & Gear – Integrated Game Shop System

Web application for product browsing, cart checkout, console rentals, and admin management. Built with PHP (FlightPHP), MySQL, and a vanilla HTML/CSS/JS frontend.

## Features
- Product catalog with categories and product detail view
- Cart management and checkout with shipping/payment validation
- Console rental request workflow with admin approval/decline
- Admin panel for product and console management
- Notifications for orders, rentals, and contact messages (read/unread)
- Contact form sending messages to admin notifications

## Tech Stack
- Frontend: HTML, CSS, JavaScript, jQuery, Bootstrap
- Backend: PHP (FlightPHP)
- Database: MySQL
- Local dev: XAMPP (Apache + PHP + MySQL)

## Project Structure
```
backend/              PHP API, services, DAOs, routes
frontend/             Views, CSS, JS utilities
admin-panel.html      Standalone admin UI
index.html            Main SPA entry point
```

## Setup (Local with XAMPP)
1. Copy the project to `C:\xampp\htdocs\diplomski`
2. Start Apache and MySQL in XAMPP
3. Create a MySQL database named `webprojekat`
4. Import the database schema and seed data (see `backend/data/db_init.sql`)
5. Open in browser:
   - User app: `http://localhost/diplomski/index.html`
   - Admin panel: `http://localhost/diplomski/admin-panel.html`

## Configuration
Database settings are defined in `backend/config/Config.php`. Update it if your MySQL credentials differ from the defaults.

## Default Accounts (seed data)
- Admin: `admin@example.com` / password hash in DB
- User: `user@example.com` / password hash in DB

## Key Pages
- `#home` – Home
- `#products` – Full catalog
- `#product` – Product detail
- `#cart` – Cart and checkout
- `#console-rental` – Console rental request
- `#contact` – Contact form
- `#notifications` – User notifications
- `#admin-notifications` – Admin notifications
- `#admin-panel` – Admin dashboard (via `admin-panel.html`)

## API Overview (Backend)
Main routes (see `backend/openapi.json` for full list):
- `GET /cart`, `POST /cart/items`, `DELETE /cart/items/{id}`, `POST /cart/checkout`
- `GET /rentals/catalog`, `POST /rentals`, `PATCH /rentals/{id}`
- `GET /notifications`, `GET /notifications/me`, `PATCH /notifications/{id}/read`
- `POST /contact/messages`

## Notes
- Checkout validates shipping + payment inputs client‑side.
- Rental requests are created as `pending` until admin decision.
- Notifications are separated into read/unread filters.

## License
Academic project (undergraduate). Add licensing details if needed.
