const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to NeonDB via Prisma');
  } catch (error) {
    console.error('Failed to connect to database', error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during Prisma disconnect', error);
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
};

