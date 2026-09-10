# GarageSync
GarageSync is a robust, multi-tenant Point of Sale (POS) and management solution tailored for automotive repair shops. This application provides a centralized platform to streamline all aspects of your garage operations, from tracking daily activities to handling bookings, managing employees, and generating invoices. GarageSync simplifies complex tasks, empowering garage owners to focus on delivering exceptional service to their customers while maintaining efficient control over their business.

## INSTALLATION
## PREREQUISITES
- Node.js
- PostgreSQL

## Setup
### Clone the repository:

```sh
git clone https://github.com/iqtier/garageSync.git
cd garageSync
```

### Install dependencies:

```sh
npm install
```
Setup environment variables: Create a .env file in the root directory and add the following:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_API_URL=your_api_url
```
Run database migrations:

```sh
npx prisma migrate dev --name init
```
Start the development server:

```sh
npm run dev
```

## Usage
Open your browser and navigate to http://localhost:3000 to see the application in action.

## Features
- Multi-Tenant Architecture: GarageSync is designed to support multiple independent businesses (tenants) on a single platform, ensuring data isolation and security for each garage.

- Role-Based Access Control: Granular control over user permissions based on roles. Restrict access to specific features and data based on user roles within the garage (e.g., Admin, Technician)..

- Dashboard: Get an overview of your garage's current and previous activities at a glance. Track key metrics and stay informed about what's happening in your shop.

- Booking System: Say goodbye to forgotten appointments! Manage your upcoming bookings efficiently and prevent scheduling conflicts, also able to complete drive thru services.

- Employee Management:

    -- Track employee clock-in and clock-out times using secure PINs.

    -- Easily create and manage employee schedules.

- Client Management: Store important information about your clients and their vehicles in one central location. Maintain a comprehensive record of customer details.

- Inventory Management:

    -- Keep track of all the parts and materials in your garage's inventory.

    -- Monitor inventory usage to optimize stock levels.

    -- Receive low stock alerts to prevent running out of essential items.

- Invoice Generation: Automatically generate invoices from booking details when services are completed. Simplify your billing process and ensure accurate record-keeping.

## Planned Features
While GarageSync already offers a robust set of features, these are the plans for future enhancements:

- Reporting and Analytics: Gain insights into your business performance with detailed reports and analytics.

- Notifications: Send automatic reminders for upcoming appointments and service milestones.

- Integration with Third-Party Software: Seamlessly connect GarageSync with your accounting software for streamlined financial management and automated inventory ordering.

## Technologies
- Next.js: React framework for server-side rendering and generating static websites.

- TypeScript: Typed superset of JavaScript that compiles to plain JavaScript.

- React: JavaScript library for building user interfaces.

- Prisma: Next-generation ORM for Node.jsand TypeScript.

- PostgreSQL: Open-source relational database.

- TailwindCSS: CSS library for styling.
  
- nexAuth: auth library for user authentication and session management

## License
This project is licensed under the MIT License. See the LICENSE file for details.
