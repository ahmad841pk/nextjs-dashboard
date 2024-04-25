const { PrismaClient } = require('@prisma/client');
const {
    invoices,
    customers,
    revenue,
    users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');


async function seedUsers(client) {
    try {

        // Insert data into the "users" table
        const insertedUsers = await Promise.all(
            users.map(async (single_user) => {
                const hashedPassword = await bcrypt.hash(single_user.password, 10);
                return await client.user.create({
                    data: {
                        id: single_user.id,
                        email: single_user.email,
                        name: single_user.name,
                        password: hashedPassword
                    },
                })
            }),
        );

        console.log(`Seeded ${insertedUsers.length} users`);

        return {
            users: insertedUsers,
        };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
}

async function seedInvoices(client) {

    try {
        // Insert data into the "invoices" table
        const insertedInvoices = await Promise.all(
            invoices.map(
                async (single) => {
                    return await client.invoice.create({
                        data: {
                            customer_id: single.customer_id,
                            amount: single.amount,
                            status: single.status,
                            date: single.date
                        },
                    })
                }),
        );

        console.log(`Seeded ${insertedInvoices.length} invoices`);

        return {
            invoices: insertedInvoices,
        };
    } catch (error) {
        console.error('Error seeding invoices:', error);
        throw error;
    }
}

async function seedCustomers(client) {
    try {
        // Insert data into the "customers" table
        const insertedCustomers = await Promise.all(
            customers.map(
                async (single) => await client.customer.create({
                    data: {
                        id: single.id,
                        name: single.name,
                        email: single.email,
                        image_url: single.image_url
                    },
                })
            ),
        );

        console.log(`Seeded ${insertedCustomers.length} customers`);

        return {
            customers: insertedCustomers,
        };
    } catch (error) {
        console.error('Error seeding customers:', error);
        throw error;
    }
}

async function seedRevenue(client) {
    try {

        // Insert data into the "revenue" table
        const insertedRevenue = await Promise.all(
            revenue.map(
                async (single) => await client.revenue.create({
                    data: {
                        month: single.month,
                        revenue: single.revenue,

                    },
                })
            ),
        );

        console.log(`Seeded ${insertedRevenue.length} revenue`);

        return {
            revenue: insertedRevenue,
        };
    } catch (error) {
        console.error('Error seeding revenue:', error);
        throw error;
    }
}


async function main() {

    const prisma = new PrismaClient()
    await seedUsers(prisma);
    await seedCustomers(prisma);
    await seedInvoices(prisma);
    await seedRevenue(prisma);


}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});
