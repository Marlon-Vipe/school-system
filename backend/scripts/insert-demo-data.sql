-- Insert demo user for cash entries
-- This user will be used for demo endpoints that don't require authentication

INSERT INTO users (id, name, lastName, email, password, role, status, createdAt, updatedAt)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo',
  'User',
  'demo@vipeschool.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8Kz2', -- password: demo123
  'admin',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Insert some sample cash entries for testing
INSERT INTO cash_entries (id, type, category, amount, description, transaction_date, user_id, status, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'income',
    'tuition_payment',
    500000,
    'Pago de matrícula - Estudiante Juan Pérez',
    CURRENT_DATE,
    '00000000-0000-0000-0000-000000000001',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'income',
    'enrollment_fee',
    100000,
    'Cuota de inscripción - María García',
    CURRENT_DATE,
    '00000000-0000-0000-0000-000000000001',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'expense',
    'salaries',
    2000000,
    'Pago de salarios - Personal docente',
    CURRENT_DATE,
    '00000000-0000-0000-0000-000000000001',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'expense',
    'utilities',
    300000,
    'Servicios públicos - Electricidad',
    CURRENT_DATE,
    '00000000-0000-0000-0000-000000000001',
    'pending',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'income',
    'material_fee',
    75000,
    'Cuota de materiales - Curso de Matemáticas',
    CURRENT_DATE - INTERVAL '1 day',
    '00000000-0000-0000-0000-000000000001',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    gen_random_uuid(),
    'expense',
    'maintenance',
    150000,
    'Mantenimiento de equipos de cómputo',
    CURRENT_DATE - INTERVAL '2 days',
    '00000000-0000-0000-0000-000000000001',
    'confirmed',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT (id) DO NOTHING;
