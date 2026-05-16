const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } });
    if (adminCount === 0) {
      await User.create({
        name: 'Julius Admin',
        email: process.env.ADMIN_EMAIL || 'admin@ridesbyjulius.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@Julius2024!',
        role: 'super_admin'
      });
      console.log('✅ Admin account created. Email:', process.env.ADMIN_EMAIL);
      console.log('⚠️  Please change the admin password after first login!');
    }
  } catch (error) {
    console.error('Seeder error:', error.message);
  }
};

module.exports = { seedAdmin };
