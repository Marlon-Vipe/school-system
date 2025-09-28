CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for purchases
DO $$ BEGIN
    CREATE TYPE purchase_status_enum AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE purchase_category_enum AS ENUM (
        'office_supplies', 'educational_materials', 'technology', 
        'maintenance', 'cleaning_supplies', 'food_services', 
        'transportation', 'other'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('cash', 'bank_transfer', 'check', 'credit_card', 'other');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category purchase_category_enum NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    supplier VARCHAR(100),
    "invoiceNumber" VARCHAR(100),
    "paymentMethod" payment_method_enum NOT NULL DEFAULT 'cash',
    status purchase_status_enum NOT NULL DEFAULT 'pending',
    "purchaseDate" DATE NOT NULL,
    "expectedDeliveryDate" DATE,
    "actualDeliveryDate" DATE,
    notes TEXT,
    "rejectionReason" TEXT,
    attachments VARCHAR(255),
    "requestedBy" UUID NOT NULL,
    "approvedBy" UUID,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Foreign key constraints
    CONSTRAINT fk_purchase_requested_by
        FOREIGN KEY ("requestedBy")
        REFERENCES users(id)
        ON DELETE RESTRICT,
        
    CONSTRAINT fk_purchase_approved_by
        FOREIGN KEY ("approvedBy")
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases (status);
CREATE INDEX IF NOT EXISTS idx_purchases_category ON purchases (category);
CREATE INDEX IF NOT EXISTS idx_purchases_requested_by ON purchases ("requestedBy");
CREATE INDEX IF NOT EXISTS idx_purchases_approved_by ON purchases ("approvedBy");
CREATE INDEX IF NOT EXISTS idx_purchases_purchase_date ON purchases ("purchaseDate");
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases ("createdAt");

-- Create trigger for updatedAt
CREATE OR REPLACE FUNCTION update_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_purchases_updated_at_trigger
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_purchases_updated_at();
