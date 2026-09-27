import express from "express";
import cors from "cors";
import multer from "multer";
import XLSX from "xlsx";
import "dotenv/config";
import { pool } from "./db.js";
import { attachUser, requireRole } from "./auth.js";
import type { AuthRequest } from "./types.js";
import { allowedSorts, serviceSchema } from "./validation.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(attachUser);

const fields = [
  "service_date","service_name","hpsm_name_en","hpsm_name_ar","code","customer_name",
  "budget_code","group_name","division","department","unit","project_manager",
  "project_manager_email","technical_lead","technical_manager_email","support_department",
  "support_spoc","support_spoc_email","hosted_location","project_info_ar","project_info_en"
];

const excelMap: Record<string,string> = {
  "Date":"service_date","Service Name":"service_name",
  "Service Name on HPSM – English":"hpsm_name_en","Service Name on HPSM - English":"hpsm_name_en",
  "Service Name on HPSM – Arabic":"hpsm_name_ar","Service Name on HPSM - Arabic":"hpsm_name_ar",
  "CODE":"code","Customer Name":"customer_name","Budget Code (Infrastructure)":"budget_code",
  "Group":"group_name","Division":"division","Department":"department","Unit":"unit",
  "Project Manager":"project_manager","Project Manager Email":"project_manager_email",
  "Technical Lead":"technical_lead","Technical Manager Email":"technical_manager_email",
  "Support Department":"support_department","Support Department SPOC":"support_spoc",
  "Support Department SPOC Email":"support_spoc_email","Hosted Location":"hosted_location",
  "Project / Service Information – Arabic":"project_info_ar","Project / Service Information - Arabic":"project_info_ar",
  "Project / Service Information – English":"project_info_en","Project / Service Information - English":"project_info_en"
};

function whereFrom(q: any) {
  const values: any[] = [];
  const parts: string[] = [];
  const add = (sql:string, value:any) => { values.push(value); parts.push(sql.replace("?", "$"+values.length)); };

  if (q.search) {
    add(`(service_name ILIKE ? OR hpsm_name_en ILIKE ? OR hpsm_name_ar ILIKE ? OR code ILIKE ? OR customer_name ILIKE ? OR project_manager ILIKE ? OR technical_lead ILIKE ?)`, `%${q.search}%`);
    const v = values.pop();
    for (let i=0;i<7;i++) values.push(v);
    const base = values.length - 6;
    parts[parts.length-1] = `(service_name ILIKE $${base} OR hpsm_name_en ILIKE $${base+1} OR hpsm_name_ar ILIKE $${base+2} OR code ILIKE $${base+3} OR customer_name ILIKE $${base+4} OR project_manager ILIKE $${base+5} OR technical_lead ILIKE $${base+6})`;
  }
  const filters: Record<string,string> = {
    group:"group_name", division:"division", department:"department", unit:"unit",
    customer:"customer_name", project_manager:"project_manager",
    support_department:"support_department", hosted_location:"hosted_location"
  };
  for (const [key,col] of Object.entries(filters)) if (q[key]) add(`${col} = ?`, q[key]);
  return { clause: parts.length ? "WHERE "+parts.join(" AND ") : "", values };
}

app.get("/api/health", async (_req,res) => {
  await pool.query("SELECT 1");
  res.json({ ok:true });
});

app.get("/api/services/stats", async (_req,res) => {
  const [totals, hosting, divisions, recent] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int total_services, COUNT(DISTINCT customer_name)::int total_customers FROM services`),
    pool.query(`SELECT COALESCE(hosted_location,'Unknown') label, COUNT(*)::int count FROM services GROUP BY hosted_location ORDER BY count DESC`),
    pool.query(`SELECT COALESCE(division,'Unknown') label, COUNT(*)::int count FROM services GROUP BY division ORDER BY count DESC`),
    pool.query(`SELECT id, service_name, code, updated_at, updated_by FROM services ORDER BY updated_at DESC LIMIT 5`)
  ]);
  res.json({ ...totals.rows[0], hosting:hosting.rows, divisions:divisions.rows, recent:recent.rows });
});

app.get("/api/services/options", async (_req,res) => {
  const cols = ["group_name","division","department","unit","customer_name","project_manager","support_department","hosted_location"];
  const result: Record<string,string[]> = {};
  for (const col of cols) {
    const r = await pool.query(`SELECT DISTINCT ${col} v FROM services WHERE ${col} IS NOT NULL AND ${col} <> '' ORDER BY v`);
    result[col] = r.rows.map(x=>x.v);
  }
  res.json(result);
});

app.get("/api/services", async (req,res) => {
  const page = Math.max(1, Number(req.query.page)||1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit)||20));
  const sort = allowedSorts.has(String(req.query.sort)) ? String(req.query.sort) : "updated_at";
  const order = String(req.query.order).toLowerCase()==="asc" ? "ASC" : "DESC";
  const {clause,values} = whereFrom(req.query);
  const count = await pool.query(`SELECT COUNT(*)::int count FROM services ${clause}`, values);
  const offset = (page-1)*limit;
  const rows = await pool.query(
    `SELECT * FROM services ${clause} ORDER BY ${sort} ${order} LIMIT $${values.length+1} OFFSET $${values.length+2}`,
    [...values, limit, offset]
  );
  res.json({ data:rows.rows, total:count.rows[0].count, page, limit });
});

app.get("/api/services/export", requireRole("admin"), async (req,res) => {
  const all = String(req.query.all)==="true";
  const {clause,values} = all ? {clause:"",values:[]} : whereFrom(req.query);
  const r = await pool.query(`SELECT * FROM services ${clause} ORDER BY service_name`, values);
  const ws = XLSX.utils.json_to_sheet(r.rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Services");
  const buffer = XLSX.write(wb,{bookType:"xlsx",type:"buffer"});
  res.setHeader("Content-Disposition", 'attachment; filename="services.xlsx"');
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet").send(buffer);
});

app.get("/api/services/:id", async (req,res) => {
  const r = await pool.query("SELECT * FROM services WHERE id=$1",[req.params.id]);
  if (!r.rowCount) return res.status(404).json({message:"Service not found"});
  res.json(r.rows[0]);
});

app.post("/api/services", requireRole("editor","admin"), async (req:AuthRequest,res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({message:"Validation failed",errors:parsed.error.flatten()});
  const d:any = parsed.data;
  const values = fields.map(f=>d[f] ?? null);
  try {
    const r = await pool.query(
      `INSERT INTO services (${fields.join(",")},updated_by) VALUES (${fields.map((_,i)=>"$"+(i+1)).join(",")},$${fields.length+1}) RETURNING *`,
      [...values,req.user!.name]
    );
    res.status(201).json(r.rows[0]);
  } catch(e:any) {
    if (e.code==="23505") return res.status(409).json({message:"A service with this CODE already exists."});
    throw e;
  }
});

app.put("/api/services/:id", requireRole("editor","admin"), async (req:AuthRequest,res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({message:"Validation failed",errors:parsed.error.flatten()});
  const d:any=parsed.data;
  const values=fields.map(f=>d[f]??null);
  try {
    const sets=fields.map((f,i)=>`${f}=$${i+1}`).join(",");
    const r=await pool.query(
      `UPDATE services SET ${sets},updated_at=NOW(),updated_by=$${fields.length+1} WHERE id=$${fields.length+2} RETURNING *`,
      [...values,req.user!.name,req.params.id]
    );
    if(!r.rowCount) return res.status(404).json({message:"Service not found"});
    res.json(r.rows[0]);
  } catch(e:any) {
    if (e.code==="23505") return res.status(409).json({message:"A service with this CODE already exists."});
    throw e;
  }
});

app.delete("/api/services/:id", requireRole("admin"), async (req,res) => {
  const r=await pool.query("DELETE FROM services WHERE id=$1 RETURNING id",[req.params.id]);
  if(!r.rowCount) return res.status(404).json({message:"Service not found"});
  res.status(204).send();
});

function normalizeExcel(rows:any[]) {
  return rows.map(row => {
    const obj:any={};
    for(const [k,v] of Object.entries(row)) {
      const target=excelMap[k] || fields.find(f=>f===k);
      if(target) obj[target]=v===""?null:String(v);
    }
    return obj;
  });
}

app.post("/api/services/import/preview", requireRole("admin"), upload.single("file"), async (req,res) => {
  if(!req.file) return res.status(400).json({message:"Excel file is required"});
  const wb=XLSX.read(req.file.buffer,{type:"buffer"});
  const raw=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:""});
  const rows=normalizeExcel(raw);
  const codes=rows.map(r=>r.code).filter(Boolean);
  const existing=codes.length ? await pool.query("SELECT code FROM services WHERE code = ANY($1)",[codes]) : {rows:[]};
  const existingCodes=new Set(existing.rows.map((r:any)=>r.code));
  const seen=new Set<string>();
  const preview=rows.map((r,index)=>{
    const errors:string[]=[];
    if(!r.service_name) errors.push("Missing Service Name");
    if(!r.code) errors.push("Missing CODE");
    if(r.code && (seen.has(r.code)||existingCodes.has(r.code))) errors.push("Duplicate CODE");
    if(r.code) seen.add(r.code);
    const valid=serviceSchema.safeParse(r);
    if(!valid.success) errors.push("Validation error");
    return {row:index+2,data:r,errors};
  });
  res.json({
    total:preview.length,
    valid:preview.filter(x=>x.errors.length===0).length,
    invalid:preview.filter(x=>x.errors.length>0).length,
    duplicates:preview.filter(x=>x.errors.includes("Duplicate CODE")).length,
    records:preview
  });
});

app.post("/api/services/import/confirm", requireRole("admin"), async (req:AuthRequest,res) => {
  const rows=Array.isArray(req.body.records)?req.body.records:[];
  let imported=0; const errors:any[]=[];
  for(const item of rows) {
    const data=item.data ?? item;
    const parsed=serviceSchema.safeParse(data);
    if(!parsed.success){ errors.push({code:data.code,error:"Validation failed"}); continue; }
    const d:any=parsed.data; const values=fields.map(f=>d[f]??null);
    try {
      await pool.query(
        `INSERT INTO services (${fields.join(",")},updated_by) VALUES (${fields.map((_,i)=>"$"+(i+1)).join(",")},$${fields.length+1})`,
        [...values,req.user!.name]
      ); imported++;
    } catch(e:any) { errors.push({code:d.code,error:e.code==="23505"?"Duplicate CODE":"Import failed"}); }
  }
  res.json({imported,errors});
});

app.use((err:any,_req:any,res:any,_next:any)=>{
  console.error(err);
  res.status(500).json({message:"Unexpected server error"});
});

app.listen(Number(process.env.PORT)||4000,()=>console.log("API running on http://localhost:"+(process.env.PORT||4000)));
