CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_date DATE,
  service_name VARCHAR(255) NOT NULL,
  hpsm_name_en VARCHAR(255),
  hpsm_name_ar VARCHAR(255),
  code VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(255),
  budget_code VARCHAR(100),
  group_name VARCHAR(255),
  division VARCHAR(255),
  department VARCHAR(255),
  unit VARCHAR(255),
  project_manager VARCHAR(255),
  project_manager_email VARCHAR(255),
  technical_lead VARCHAR(255),
  technical_manager_email VARCHAR(255),
  support_department VARCHAR(255),
  support_spoc VARCHAR(255),
  support_spoc_email VARCHAR(255),
  hosted_location VARCHAR(100),
  project_info_ar TEXT,
  project_info_en TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by VARCHAR(255) NOT NULL DEFAULT 'System'
);

CREATE INDEX IF NOT EXISTS idx_services_search ON services
USING gin (to_tsvector('simple',
  coalesce(service_name,'') || ' ' ||
  coalesce(hpsm_name_en,'') || ' ' ||
  coalesce(hpsm_name_ar,'') || ' ' ||
  coalesce(code,'') || ' ' ||
  coalesce(customer_name,'') || ' ' ||
  coalesce(project_manager,'') || ' ' ||
  coalesce(technical_lead,'')
));

CREATE INDEX IF NOT EXISTS idx_services_division ON services(division);
CREATE INDEX IF NOT EXISTS idx_services_department ON services(department);
CREATE INDEX IF NOT EXISTS idx_services_hosted_location ON services(hosted_location);
