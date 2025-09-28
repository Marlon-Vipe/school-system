-- Migration: Create cash_entries table
-- Description: Creates the cash_entries table for managing income and expense entries

CREATE TABLE IF NOT EXISTS cash_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'tuition_payment', 'enrollment_fee', 'material_fee', 'other_income',
        'salaries', 'utilities', 'maintenance', 'supplies', 'marketing', 'other_expense'
    )),
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255) NOT NULL,
    reference VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    transaction_date DATE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id UUID,
    receipt_number VARCHAR(255),
    attachments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cash_entries_type ON cash_entries(type);
CREATE INDEX IF NOT EXISTS idx_cash_entries_category ON cash_entries(category);
CREATE INDEX IF NOT EXISTS idx_cash_entries_status ON cash_entries(status);
CREATE INDEX IF NOT EXISTS idx_cash_entries_transaction_date ON cash_entries(transaction_date);
CREATE INDEX IF NOT EXISTS idx_cash_entries_user_id ON cash_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_entries_created_at ON cash_entries(created_at);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_cash_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cash_entries_updated_at
    BEFORE UPDATE ON cash_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_cash_entries_updated_at();

-- Insert some sample data for testing
INSERT INTO cash_entries (type, category, amount, description, transaction_date, user_id, status) VALUES
('income', 'tuition_payment', 500000, 'Pago de matrícula - Estudiante Juan Pérez', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('income', 'enrollment_fee', 100000, 'Cuota de inscripción - Estudiante María García', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'salaries', 2000000, 'Pago de salarios - Personal docente', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'utilities', 300000, 'Servicios públicos - Electricidad', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'pending'),
('income', 'material_fee', 50000, 'Cuota de materiales - Estudiante Carlos López', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed')
ON CONFLICT DO NOTHING;
