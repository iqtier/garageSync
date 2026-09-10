import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.usedInventory.deleteMany({});
  await prisma.inventoryTransaction.deleteMany({});
  await prisma.serviceIdQty.deleteMany({});
  await prisma.bookingTechnician.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.inventoryFields.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.serviceFields.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.employeeSchedule.deleteMany({});
  await prisma.clockInOut.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.business.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Creating realistic Canadian business...');
  const business = await prisma.business.create({
    data: {
      name: 'Northern Motors & Service',
      phone: '416-555-0199',
      email: 'contact@northernmotors.ca',
      address: { street: '123 Automotive Way', city: 'Toronto', province: 'ON', postalCode: 'M4B 1B3', country: 'Canada' },
      logo: Buffer.from([]),
      taxRate: 0.13, // Ontario HST
    }
  });

  console.log('Creating users (2 Admins, 8 Technicians)...');
  const userData = [
    { name: 'John Smith', role: 'admin' },
    { name: 'Sarah Connor', role: 'admin' },
    { name: 'Mike Johnson', role: 'technician' },
    { name: 'David Lee', role: 'technician' },
    { name: 'Chris Wong', role: 'technician' },
    { name: 'Alex Tremblay', role: 'technician' },
    { name: 'Ben Carter', role: 'technician' },
    { name: 'Tom Wilson', role: 'technician' },
    { name: 'Steve Davis', role: 'technician' },
    { name: 'Kevin Miller', role: 'technician' },
  ];
  const users = [];
  for (let i = 0; i < userData.length; i++) {
    const u = await prisma.user.create({
      data: {
        name: userData[i].name,
        email: `${userData[i].name.split(' ')[0].toLowerCase()}@northernmotors.ca`,
        password: hashedPassword,
        role: userData[i].role,
        pin: `${1000 + i}`,
        business: { connect: { id: business.id } },
      }
    });
    users.push(u);
  }

  // Customers
  console.log('Creating customers and vehicles...');
  const customerNames = ["Emily Chen", "Michael Scott", "Jessica Taylor", "Ryan Reynolds", "Rachel McAdams", "Drake Graham", "Celine Dion", "Keanu Reeves", "Jim Carrey", "Elliot Page"];
  const vehiclesData = [
    { make: 'Toyota', model: 'Camry', year: '2019' },
    { make: 'Honda', model: 'Civic', year: '2021' },
    { make: 'Ford', model: 'F-150', year: '2018' },
    { make: 'Dodge', model: 'Ram 1500', year: '2020' },
    { make: 'Hyundai', model: 'Elantra', year: '2022' },
    { make: 'Mazda', model: '3', year: '2017' },
    { make: 'Subaru', model: 'Outback', year: '2021' },
    { make: 'Volkswagen', model: 'Golf', year: '2016' },
    { make: 'Chevrolet', model: 'Silverado', year: '2019' },
    { make: 'Kia', model: 'Sorento', year: '2023' }
  ];
  const customers = [];
  for (let i = 0; i < 10; i++) {
    const c = await prisma.customer.create({
      data: {
        name: customerNames[i],
        email: `${customerNames[i].split(' ')[0].toLowerCase()}@example.com`,
        phone: `416-555-200${i}`,
        business: { connect: { id: business.id } },
        vehicles: {
          create: [vehiclesData[i]]
        }
      },
      include: { vehicles: true }
    });
    customers.push(c);
  }

  // Services
  console.log('Creating services...');
  const serviceData = [
    { name: "Synthetic Oil Change", price: 89.99 },
    { name: "Tire Rotation & Balance", price: 49.99 },
    { name: "Brake Pad Replacement", price: 199.99 },
    { name: "Wheel Alignment", price: 109.99 },
    { name: "Battery Replacement", price: 149.99 },
    { name: "Transmission Fluid Flush", price: 129.99 },
    { name: "AC Recharge", price: 139.99 },
    { name: "Engine Diagnostic", price: 99.99 },
    { name: "Coolant Flush", price: 89.99 },
    { name: "Spark Plug Replacement", price: 119.99 }
  ];
  const services = [];
  for (const s of serviceData) {
    services.push(await prisma.service.create({
      data: { ...s, business: { connect: { id: business.id } } }
    }));
  }

  // Categories
  console.log('Creating categories...');
  const categoryNames = ["Fluids", "Brakes", "Tires", "Engine", "Suspension", "Electrical", "Filters", "Exhaust", "Transmission", "Accessories"];
  const categories = [];
  for (const cat of categoryNames) {
    categories.push(await prisma.category.create({
      data: { name: cat, description: `Auto parts for ${cat}`, business: { connect: { id: business.id } }, fields: [] }
    }));
  }

  // Suppliers
  console.log('Creating suppliers...');
  const supplierNames = ["Canadian Auto Parts", "NAPA Auto Parts", "Benson Auto Parts", "Carquest", "Lordco", "PartSource", "UAP Inc", "Mevotech", "Magna", "Linamar"];
  const suppliers = [];
  for (let i = 0; i < 10; i++) {
    suppliers.push(await prisma.supplier.create({
      data: {
        name: supplierNames[i],
        business: { connect: { id: business.id } },
        contact: {
          create: {
            phone: `1-800-555-800${i}`,
            email: `sales@${supplierNames[i].replace(/\s/g, '').toLowerCase()}.ca`,
            address: `${100 + i} Industrial Pkwy, Mississauga, ON`
          }
        }
      }
    }));
  }

  // Inventory
  console.log('Creating inventory...');
  const inventoryData = [
    { name: "5W-30 Synthetic Motor Oil", cat: "Fluids", cost: 25.00, retail: 45.00 },
    { name: "Ceramic Brake Pads", cat: "Brakes", cost: 45.00, retail: 89.99 },
    { name: "All-Season Tire 205/55R16", cat: "Tires", cost: 85.00, retail: 125.00 },
    { name: "Oil Filter - Standard", cat: "Filters", cost: 5.00, retail: 12.99 },
    { name: "Air Filter", cat: "Filters", cost: 12.00, retail: 24.99 },
    { name: "12V Car Battery", cat: "Electrical", cost: 95.00, retail: 159.99 },
    { name: "Spark Plug - Iridium", cat: "Engine", cost: 8.00, retail: 18.99 },
    { name: "Windshield Wiper Blades 22 inch", cat: "Accessories", cost: 14.00, retail: 29.99 },
    { name: "Brake Rotor", cat: "Brakes", cost: 55.00, retail: 95.00 },
    { name: "Engine Coolant/Antifreeze", cat: "Fluids", cost: 18.00, retail: 34.99 },
  ];
  const inventories = [];
  for (let i = 0; i < 10; i++) {
    const cat = categories.find(c => c.name === inventoryData[i].cat);
    inventories.push(await prisma.inventory.create({
      data: {
        name: inventoryData[i].name,
        sku: `PRT-${1000 + i}`,
        brand: 'AutoPro',
        category: { connect: { id: cat!.id } },
        unitCost: inventoryData[i].cost,
        retailPrice: inventoryData[i].retail,
        measure_of_unit: 'pcs',
        quantityOnHand: 50,
        compatibleVehicles: JSON.stringify([{ make: 'Universal', model: 'All', year: 'All' }]),
        business: { connect: { id: business.id } },
      }
    }));
  }

  // Bookings (No overlaps)
  console.log('Creating non-overlapping bookings...');
  const ramps = ["Ramp 1", "Ramp 2", "Ramp 3", "Ramp 4"];
  const times = ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM"];
  
  // Generate unique slots
  let slots = [];
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  for (let d = 1; d <= 5; d++) {
    let bookingDate = new Date(currentDate);
    bookingDate.setDate(bookingDate.getDate() + d);
    for (const ramp of ramps) {
      for (const time of times) {
        slots.push({ date: bookingDate, ramp, time });
      }
    }
  }
  
  // Shuffle array
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  // Select first 10 for the bookings to guarantee uniqueness
  const selectedSlots = slots.slice(0, 10);
  
  for (let i = 0; i < 10; i++) {
    const slot = selectedSlots[i];
    
    // Calculate start/finish times
    const [hourStr, minStr, ampm] = slot.time.split(/[: ]/);
    let hour = parseInt(hourStr);
    if (ampm === "PM" && hour !== 12) hour += 12;
    
    const start = new Date(slot.date);
    start.setHours(hour, parseInt(minStr), 0, 0);
    
    const finish = new Date(start);
    finish.setHours(hour + 2); // 2 hour service block

    await prisma.booking.create({
      data: {
        date: slot.date,
        start: start,
        finish: finish,
        time: slot.time,
        ramp: slot.ramp,
        booking_type: 'repair',
        status: 'pending',
        customer: { connect: { id: customers[i].id } },
        vehicle: { connect: { id: customers[i].vehicles[0].id } },
        business: { connect: { id: business.id } },
        technicians: {
          create: [
            { technicianId: users[2 + (i % 8)].id } // assign evenly to the 8 technicians
          ]
        },
        services: {
          create: [
            { serviceId: services[i].id, qty: "1" }
          ]
        },
        UsedInventory: {
          create: [
            {
              inventoryId: inventories[i].id,
              quantity: 1,
              transactionType: 'sale',
              includedWithService: true
            }
          ]
        }
      }
    });
  }

  console.log('Seed completed successfully! Database has realistic Canadian data.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
