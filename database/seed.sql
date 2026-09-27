INSERT INTO services (
 service_date, service_name, hpsm_name_en, hpsm_name_ar, code, customer_name,
 budget_code, group_name, division, department, unit,
 project_manager, project_manager_email, technical_lead, technical_manager_email,
 support_department, support_spoc, support_spoc_email, hosted_location,
 project_info_en, project_info_ar, updated_by
) VALUES
('2026-09-01','Digital Identity Gateway','Digital Identity Gateway','بوابة الهوية الرقمية','DIG-001','Internal','INF-1001','Technology','Digital Platforms','Application Services','Platform Enablement','Sara Ahmed','sara.ahmed@example.com','Omar Khalid','omar.khalid@example.com','Application Operations','Fahad Ali','fahad.ali@example.com','OpenShift','Gateway for internal identity integrations.','بوابة للتكاملات الداخلية الخاصة بالهوية الرقمية.','Seed Admin'),
('2026-08-18','Vehicle Inspection Portal','Vehicle Inspection Portal','بوابة الفحص الفني','VIP-002','Vehicle Sector','INF-1002','Business Solutions','Mobility','Digital Products','Vehicle Services','Noura Saleh','noura.saleh@example.com','Ahmed Saad','ahmed.saad@example.com','Production Support','Lina Omar','lina.omar@example.com','GCP','Portal supporting vehicle inspection services.','بوابة تدعم خدمات الفحص الفني للمركبات.','Seed Admin'),
('2026-07-22','Corporate Request Hub','Corporate Request Hub','مركز الطلبات الداخلية','CRH-003','Internal','INF-1003','Corporate','Shared Services','Technology Services','Internal Products','Khalid Mansour','khalid.mansour@example.com','Yousef Adel','yousef.adel@example.com','Service Desk','Reem Fahad','reem.fahad@example.com','Elm Data Center','Central hub for employee technology requests.','منصة مركزية لطلبات التقنية للموظفين.','Seed Admin')
ON CONFLICT (code) DO NOTHING;
