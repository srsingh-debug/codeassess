import { connectDatabase } from '../config/database';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import mongoose from 'mongoose';

type UserRole = 'admin' | 'candidate' | 'recruiter' | 'hr' | 'interviewer' | 'hiring-manager';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isEmailVerified?: boolean;
}

const seedUsers: SeedUser[] = [
  {
    email: 'admin@example.com',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    email: 'candidate@example.com',
    password: 'Candidate@123',
    name: 'Candidate User',
    role: 'candidate',
    isEmailVerified: true,
  },
  {
    email: 'recruiter@example.com',
    password: 'Recruiter@123',
    name: 'Recruiter User',
    role: 'recruiter',
    isEmailVerified: true,
  },
  {
    email: 'hr@example.com',
    password: 'Hr@123',
    name: 'HR User',
    role: 'hr',
    isEmailVerified: true,
  },
  {
    email: 'interviewer@example.com',
    password: 'Interviewer@123',
    name: 'Interviewer User',
    role: 'interviewer',
    isEmailVerified: true,
  },
  {
    email: 'hiring-manager@example.com',
    password: 'HiringManager@123',
    name: 'Hiring Manager User',
    role: 'hiring-manager',
    isEmailVerified: true,
  },
];

export const clearUsers = async (): Promise<void> => {
  try {
    console.log('🗑️  Clearing existing users and refresh tokens...');
    
    // Delete all users
    const deletedUsers = await User.deleteMany({});
    console.log(`   - Deleted ${deletedUsers.deletedCount} users`);
    
    // Delete all refresh tokens
    const deletedTokens = await RefreshToken.deleteMany({});
    console.log(`   - Deleted ${deletedTokens.deletedCount} refresh tokens`);
    
    console.log('✅ Database cleared successfully!');
  } catch (error: unknown) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

export const seedDatabase = async (clearExisting: boolean = false): Promise<void> => {
  try {
    // Clear existing data if requested
    if (clearExisting) {
      await clearUsers();
    } else {
      // Check if database is already seeded
      const existingUsers = await User.countDocuments();
      
      if (existingUsers > 0) {
        console.log('✅ Database already seeded. Skipping seed operation.');
        console.log('   💡 To reseed, use: npm run seed:reset');
        return;
      }
    }

    console.log('🌱 Starting database seeding...');

    // Create users
    const createdUsers = await User.insertMany(seedUsers);

    console.log(`✅ Successfully seeded ${createdUsers.length} users:`);
    createdUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('✅ Database seeding completed successfully!');
  } catch (error: unknown) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// If running as standalone script
if (require.main === module) {
  const runSeed = async () => {
    try {
      await connectDatabase();
      
      // Check if --reset flag is passed
      const shouldReset = process.argv.includes('--reset') || process.argv.includes('-r');
      
      await seedDatabase(shouldReset);
      await mongoose.connection.close();
      console.log('✅ Seed script completed. Database connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    }
  };

  runSeed();
}


