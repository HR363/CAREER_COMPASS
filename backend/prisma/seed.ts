import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password for all test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@careercompass.com' },
    update: {},
    create: {
      email: 'admin@careercompass.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      profile: {
        create: {
          education: 'Master in Computer Science',
          skills: 'Platform Management, System Administration',
          interests: 'Technology, Education',
          goals: 'Manage and improve the platform',
        },
      },
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create Mentor User
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@careercompass.com' },
    update: {},
    create: {
      email: 'mentor@careercompass.com',
      password: hashedPassword,
      name: 'John Mentor',
      role: 'MENTOR',
      profile: {
        create: {
          education: 'PhD in Software Engineering',
          skills: 'Software Development, AI/ML, System Design, Career Counseling',
          interests: 'Mentoring, Technology Innovation, Teaching',
          goals: 'Help students achieve their career goals',
        },
      },
    },
  });
  console.log('✅ Created mentor user:', mentor.email);

  // Create Student User
  const student = await prisma.user.upsert({
    where: { email: 'student@careercompass.com' },
    update: {},
    create: {
      email: 'student@careercompass.com',
      password: hashedPassword,
      name: 'Jane Student',
      role: 'STUDENT',
      profile: {
        create: {
          education: 'Bachelor in Computer Science (3rd Year)',
          skills: 'JavaScript, Python, React, Node.js',
          interests: 'Web Development, Mobile Apps, AI',
          goals: 'Become a Full Stack Developer',
        },
      },
    },
  });
  console.log('✅ Created student user:', student.email);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('═══════════════════════════════════════');
  console.log('👤 Admin:');
  console.log('   Email: admin@careercompass.com');
  console.log('   Password: password123');
  console.log('');
  console.log('👨‍🏫 Mentor:');
  console.log('   Email: mentor@careercompass.com');
  console.log('   Password: password123');
  console.log('');
  console.log('👩‍🎓 Student:');
  console.log('   Email: student@careercompass.com');
  console.log('   Password: password123');
  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
