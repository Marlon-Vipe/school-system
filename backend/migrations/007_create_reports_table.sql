-- Migration: Create reports table
-- Description: Creates the reports table with all necessary fields and relationships

-- Create enums
CREATE TYPE report_type_enum AS ENUM (
    'financial',
    'student_analysis',
    'payment_summary',
    'enrollment_report',
    'course_performance',
    'cash_flow',
    'purchase_analysis',
    'custom'
);

CREATE TYPE report_status_enum AS ENUM (
    'pending',
    'generating',
    'completed',
    'failed',
    'expired'
);

CREATE TYPE report_format_enum AS ENUM (
    'pdf',
    'excel',
    'csv',
    'json'
);

-- Create reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type report_type_enum NOT NULL,
    format report_format_enum NOT NULL DEFAULT 'pdf',
    status report_status_enum NOT NULL DEFAULT 'pending',
    parameters JSONB,
    filters JSONB,
    start_date DATE,
    end_date DATE,
    file_path VARCHAR(500),
    download_url VARCHAR(500),
    download_count INTEGER NOT NULL DEFAULT 0,
    generated_at TIMESTAMP,
    expires_at TIMESTAMP,
    error_message TEXT,
    notes TEXT,
    requested_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_reports_requested_by 
        FOREIGN KEY (requested_by) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_format ON reports(format);
CREATE INDEX idx_reports_requested_by ON reports(requested_by);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_expires_at ON reports(expires_at);
CREATE INDEX idx_reports_start_date ON reports(start_date);
CREATE INDEX idx_reports_end_date ON reports(end_date);

-- Create composite indexes for common queries
CREATE INDEX idx_reports_type_status ON reports(type, status);
CREATE INDEX idx_reports_requested_by_status ON reports(requested_by, status);
CREATE INDEX idx_reports_date_range ON reports(start_date, end_date);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reports_updated_at
    BEFORE UPDATE ON reports
    FOR EACH ROW
    EXECUTE FUNCTION update_reports_updated_at();

-- Add comments for documentation
COMMENT ON TABLE reports IS 'Stores generated reports and their metadata';
COMMENT ON COLUMN reports.id IS 'Unique identifier for the report';
COMMENT ON COLUMN reports.title IS 'Title of the report';
COMMENT ON COLUMN reports.description IS 'Description of what the report contains';
COMMENT ON COLUMN reports.type IS 'Type of report (financial, student_analysis, etc.)';
COMMENT ON COLUMN reports.format IS 'Output format of the report (pdf, excel, csv, json)';
COMMENT ON COLUMN reports.status IS 'Current status of the report generation';
COMMENT ON COLUMN reports.parameters IS 'JSON parameters used to generate the report';
COMMENT ON COLUMN reports.filters IS 'JSON filters applied to the report data';
COMMENT ON COLUMN reports.start_date IS 'Start date for date range reports';
COMMENT ON COLUMN reports.end_date IS 'End date for date range reports';
COMMENT ON COLUMN reports.file_path IS 'Path to the generated report file';
COMMENT ON COLUMN reports.download_url IS 'URL for downloading the report';
COMMENT ON COLUMN reports.download_count IS 'Number of times the report has been downloaded';
COMMENT ON COLUMN reports.generated_at IS 'Timestamp when the report was generated';
COMMENT ON COLUMN reports.expires_at IS 'Timestamp when the report expires';
COMMENT ON COLUMN reports.error_message IS 'Error message if report generation failed';
COMMENT ON COLUMN reports.notes IS 'Additional notes about the report';
COMMENT ON COLUMN reports.requested_by IS 'User who requested the report';
COMMENT ON COLUMN reports.created_at IS 'Timestamp when the report was created';
COMMENT ON COLUMN reports.updated_at IS 'Timestamp when the report was last updated';
