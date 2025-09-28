-- Fix the trigger function to use the correct column name
CREATE OR REPLACE FUNCTION update_cash_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
