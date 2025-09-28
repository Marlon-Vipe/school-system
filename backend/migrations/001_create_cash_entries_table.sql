-- Migration: Create cash_entries table
-- Description: Creates the cash_entries table for managing income and expense transactions

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
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
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
CREATE INDEX IF NOT EXISTS idx_cash_entries_payment_id ON cash_entries(payment_id);
CREATE INDEX IF NOT EXISTS idx_cash_entries_created_at ON cash_entries(created_at);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_cash_entries_type_status_date ON cash_entries(type, status, transaction_date);

-- Add comments to the table and columns
COMMENT ON TABLE cash_entries IS 'Table for managing cash flow transactions (income and expenses)';
COMMENT ON COLUMN cash_entries.type IS 'Type of transaction: income or expense';
COMMENT ON COLUMN cash_entries.category IS 'Category of the transaction (tuition, salaries, etc.)';
COMMENT ON COLUMN cash_entries.amount IS 'Transaction amount in local currency';
COMMENT ON COLUMN cash_entries.description IS 'Description of the transaction';
COMMENT ON COLUMN cash_entries.reference IS 'Reference number or identifier';
COMMENT ON COLUMN cash_entries.notes IS 'Additional notes or comments';
COMMENT ON COLUMN cash_entries.status IS 'Transaction status: pending, confirmed, or cancelled';
COMMENT ON COLUMN cash_entries.transaction_date IS 'Date when the transaction occurred';
COMMENT ON COLUMN cash_entries.user_id IS 'User who created the transaction';
COMMENT ON COLUMN cash_entries.payment_id IS 'Related payment ID (for income transactions)';
COMMENT ON COLUMN cash_entries.receipt_number IS 'Receipt or invoice number';
COMMENT ON COLUMN cash_entries.attachments IS 'URLs or paths to attached files';

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_cash_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cash_entries_updated_at
    BEFORE UPDATE ON cash_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_cash_entries_updated_at();

-- Insert some sample data for testing (optional)
INSERT INTO cash_entries (type, category, amount, description, transaction_date, user_id, status) VALUES
('income', 'tuition_payment', 500000, 'Pago de matrícula - Estudiante Juan Pérez', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('income', 'enrollment_fee', 100000, 'Cuota de inscripción - María García', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'salaries', 2000000, 'Pago de salarios - Personal docente', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'confirmed'),
('expense', 'utilities', 300000, 'Servicios públicos - Electricidad', CURRENT_DATE, (SELECT id FROM users LIMIT 1), 'pending')
ON CONFLICT DO NOTHING;
