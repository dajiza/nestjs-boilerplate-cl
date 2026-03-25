import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'nestjs',
  entities: [__dirname + '/../../../src/**/*.entity{.ts,.js}'],
  synchronize: false,
});

interface BoulevardStaff {
  id: string;
  active: boolean;
  avatar?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  name: string;
  hexColor?: string | null;
  pronoun?: string | null;
  role?: { name: string } | null;
  suspended?: boolean | null;
  isMe?: boolean;
}

async function importStaff() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: npx ts-node -r tsconfig-paths/register scripts/import/staff/import.ts <json-file-path>');
    console.error('Example: npx ts-node -r tsconfig-paths/register scripts/import/staff/import.ts /Users/cs/Downloads/staff.json');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading file: ${filePath}`);

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const staffList: BoulevardStaff[] = JSON.parse(rawData);

  console.log(`Found ${staffList.length} staff to import`);

  await AppDataSource.initialize();
  console.log('Database connected');

  // Dynamic import after DataSource initialization
  const { StaffEntity } = await import(
    '../../../src/staff/infrastructure/persistence/relational/entities/staff.entity'
  );

  type StaffEntityType = InstanceType<typeof StaffEntity>;
  const repository = AppDataSource.getRepository<StaffEntityType>(StaffEntity);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of staffList) {
    try {
      // Check if staff already exists
      const existing = await repository.findOne({ where: { id: item.id } });
      if (existing) {
        skipped++;
        continue;
      }

      const staff = repository.create({
        // Required fields
        id: item.id,
        name: item.name,
        active: item.active,
        // Default values for required fields not in Boulevard data
        email: `${item.id}@placeholder.local`,
        mobilePhone: '',
        // Optional fields
        firstName: item.firstName ?? null,
        lastName: item.lastName ?? null,
        avatar: item.avatar ?? null,
        suspended: item.suspended ?? false,
        nickname: item.pronoun ?? null,
        role: item.role ?? null,
      });

      await repository.save(staff);
      imported++;
    } catch (error) {
      console.error(`Failed to import staff ${item.id}:`, error);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Import completed!`);
  console.log(`========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped (already exists): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`========================================`);

  await AppDataSource.destroy();
}

importStaff().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
