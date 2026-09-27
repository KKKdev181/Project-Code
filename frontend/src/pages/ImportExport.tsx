import { useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import { FileSpreadsheet,Upload,Download } from "lucide-react";

export default function ImportExport(){
 const [file,setFile]=useState<File|null>(null);
 const [preview,setPreview]=useState<any>(null);
 const [busy,setBusy]=useState(false);

 const doPreview=async()=>{
  if(!file)return;
  setBusy(true);
  try{
   const f=new FormData();
   f.append("file",file);
   const r=await api.post("/services/import/preview",f);
   setPreview(r.data);
  }catch(e:any){toast.error(e.response?.data?.message||"Unable to preview file")}
  finally{setBusy(false)}
 };

 const confirm=async()=>{
  setBusy(true);
  try{
   const valid=preview.records.filter((x:any)=>x.errors.length===0);
   const r=await api.post("/services/import/confirm",{records:valid});
   toast.success(`${r.data.imported} services imported`);
   setPreview(null);setFile(null);
  }catch(e:any){toast.error(e.response?.data?.message||"Import failed")}
  finally{setBusy(false)}
 };

 const exportFile=async(all:boolean)=>{
  const r=await api.get("/services/export",{params:{all},responseType:"blob"});
  const url=URL.createObjectURL(r.data);
  const a=document.createElement("a");
  a.href=url;a.download=all?"all-services.xlsx":"services.xlsx";a.click();
  URL.revokeObjectURL(url);
 };

 return <div className="max-w-5xl">
  <div className="mb-6"><h1 className="text-2xl font-bold">Import / Export</h1><p className="mt-1 text-sm text-slate-500">Administratively manage Excel migration and data extraction.</p></div>

  <div className="grid gap-5 lg:grid-cols-2">
   <section className="card p-6">
    <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-700"><Upload/></div>
    <h2 className="text-lg font-bold">Import Excel</h2>
    <p className="mt-1 text-sm text-slate-500">Upload the existing service Excel file. Data is validated before import.</p>
    <input type="file" accept=".xlsx,.xls" className="mt-5 block w-full text-sm" onChange={e=>{setFile(e.target.files?.[0]||null);setPreview(null)}}/>
    <button className="btn-primary mt-5" disabled={!file||busy} onClick={doPreview}>Preview Import</button>
   </section>

   <section className="card p-6">
    <div className="mb-4 inline-flex rounded-xl bg-slate-100 p-3 text-slate-700"><Download/></div>
    <h2 className="text-lg font-bold">Export Services</h2>
    <p className="mt-1 text-sm text-slate-500">Export complete service records to Excel.</p>
    <div className="mt-5 flex gap-3"><button className="btn-secondary" onClick={()=>exportFile(false)}>Export Current Results</button><button className="btn-primary" onClick={()=>exportFile(true)}>Export All Services</button></div>
   </section>
  </div>

  {preview&&<section className="card mt-5 p-6">
   <h2 className="mb-5 flex items-center gap-2 text-lg font-bold"><FileSpreadsheet size={20}/>Import Preview</h2>
   <div className="grid gap-3 md:grid-cols-4">{[["Detected",preview.total],["Valid",preview.valid],["Invalid",preview.invalid],["Duplicate CODEs",preview.duplicates]].map(([l,v])=><div className="rounded-lg bg-slate-50 p-4" key={String(l)}><p className="text-xs uppercase text-slate-400">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div>
   <div className="mt-5 max-h-72 overflow-auto rounded-lg border"><table className="w-full text-sm"><thead className="sticky top-0 bg-slate-50"><tr><th className="p-3 text-left">Row</th><th className="p-3 text-left">Service</th><th className="p-3 text-left">CODE</th><th className="p-3 text-left">Status</th></tr></thead><tbody className="divide-y">{preview.records.map((r:any)=><tr key={r.row}><td className="p-3">{r.row}</td><td className="p-3">{r.data.service_name||"—"}</td><td className="p-3">{r.data.code||"—"}</td><td className="p-3">{r.errors.length?<span className="text-red-600">{r.errors.join(", ")}</span>:<span className="text-brand-700">Valid</span>}</td></tr>)}</tbody></table></div>
   <div className="mt-5 flex justify-end"><button onClick={confirm} disabled={busy||preview.valid===0} className="btn-primary">Confirm Import ({preview.valid})</button></div>
  </section>}
 </div>
}
