import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Create departments
    const departments = await Promise.all([
      prisma.department.create({
        data: {
          name: 'Cardiology',
          description: 'Heart and cardiovascular system specialists'
        }
      }),
      prisma.department.create({
        data: {
          name: 'Radiology',
          description: 'Medical imaging and diagnosis'
        }
      }),
      prisma.department.create({
        data: {
          name: 'Pediatrics',
          description: 'Child healthcare specialists'
        }
      })
    ]);

    console.log('Departments created:', departments.map(d => d.name));

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@medichain.com',
        name: 'System Administrator',
        password: await bcrypt.hash('admin123', 12),
        role: 'ADMIN',
        did: 'did:hedera:testnet:0.0.123456_admin',
        publicKey: 'admin_public_key'
      }
    });

    await prisma.admin.create({
      data: {
        userId: adminUser.id,
        level: 'SYSTEM'
      }
    });

    console.log('Admin user created:', adminUser.email);

    // Create sample doctors
    const doctors = await Promise.all([
      prisma.user.create({
        data: {
          email: 'dr.smith@hospital.com',
          name: 'Dr. John Smith',
          password: await bcrypt.hash('doctor123', 12),
          role: 'DOCTOR',
          did: 'did:hedera:testnet:0.0.123457_doctor',
          publicKey: 'doctor1_public_key',
          doctor: {
            create: {
              licenseNumber: 'MED123456',
              specialization: 'Cardiologist',
              departmentId: departments[0].id,
              isVerified: true
            }
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.johnson@hospital.com',
          name: 'Dr. Sarah Johnson',
          password: await bcrypt.hash('doctor123', 12),
          role: 'DOCTOR',
          did: 'did:hedera:testnet:0.0.123458_doctor',
          publicKey: 'doctor2_public_key',
          doctor: {
            create: {
              licenseNumber: 'MED123457',
              specialization: 'Radiologist',
              departmentId: departments[1].id,
              isVerified: true
            }
          }
        }
      })
    ]);

    console.log('Sample doctors created:', doctors.map(d => d.email));

    // Create sample patients
    const patients = await Promise.all([
      prisma.user.create({
        data: {
          email: 'patient1@example.com',
          name: 'Alice Johnson',
          password: await bcrypt.hash('patient123', 12),
          role: 'PATIENT',
          did: 'did:hedera:testnet:0.0.123459_patient',
          publicKey: 'patient1_public_key',
          patient: {
            create: {
              dateOfBirth: new Date('1985-05-15'),
              bloodType: 'A+',
              allergies: 'Penicillin, Peanuts'
            }
          }
        }
      }),
      prisma.user.create({
        data: {
          email: 'patient2@example.com',
          name: 'Bob Smith',
          password: await bcrypt.hash('patient123', 12),
          role: 'PATIENT',
          did: 'did:hedera:testnet:0.0.123460_patient',
          publicKey: 'patient2_public_key',
          patient: {
            create: {
              dateOfBirth: new Date('1978-12-20'),
              bloodType: 'O-',
              allergies: 'None'
            }
          }
        }
      })
    ]);

    console.log('Sample patients created:', patients.map(p => p.email));

    console.log('\n✅ Database seeding completed!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@medichain.com / admin123');
    console.log('Doctor: dr.smith@hospital.com / doctor123');
    console.log('Patient: patient1@example.com / patient123');

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();