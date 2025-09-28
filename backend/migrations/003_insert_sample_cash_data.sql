-- Insert sample cash entries data
INSERT INTO cash_entries (type, category, amount, description, "transactionDate", "userId", status) VALUES
('income', 'tuition_payment', 500000, 'Pago de matrícula - Estudiante Juan Pérez', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('income', 'enrollment_fee', 100000, 'Cuota de inscripción - Estudiante María García', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'salaries', 2000000, 'Pago de salarios - Personal docente', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'utilities', 300000, 'Servicios públicos - Electricidad', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'pending'),
('income', 'material_fee', 50000, 'Cuota de materiales - Estudiante Carlos López', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed')
ON CONFLICT DO NOTHING;
