import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { api } from "../api";
import type { Service } from "../types";
import { ArrowLeft,Copy,Edit3 } from "lucide-react";
import toast from "react-hot-toast";

const Row=({label,value,email=false,copy=false}:{label:string,value:any,email?:boolean,copy?:boolean})=>
<div className="border-b border-slate-100 py-3 last:border-0">
 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
 <div className="mt-1 flex items-center gap-2 text-sm font-medium">
  {email&&value?<a className="text-brand-700 hover:underline" href={"mailto:"+value}>{value}</a>:<span>{value||"—"}</span>}
  {copy&&value&&<button onClick={()=>{navigator.clipboard.writeText(value);toast.success("Copied")}} className="text-slate-400 hover:text-brand-700"><Copy size={14}/></button>}
 </div>
</div>;

export default function ServiceDetails(){
 const {id}=useParams();
 const [s,setS]=useState<Service|null>(null);
 useEffect(()=>{api.get("/services/"+id).then(r=>setS(r.data))},[id]);
 if(!s)return <div>Loading service...</div>;

 const cards=[
  ["Overview",[["Service Name",s.service_name],["HPSM English Name",s.hpsm_name_en],["HPSM Arabic Name",s.hpsm_name_ar],["CODE",s.code,false,true],["Customer",s.customer_name]]],
  ["Organization",[["Group",s.group_name],["Division",s.division],["Department",s.department],["Unit",s.unit]]],
  ["Ownership",[["Project Manager",s.project_manager],["Project Manager Email",s.project_manager_email,true,true],["Technical Lead",s.technical_lead],["Technical Manager Email",s.technical_manager_email,true,true]]],
  ["Support",[["Support Department",s.support_department],["Support SPOC",s.support_spoc],["Support SPOC Email",s.support_spoc_email,true,true]]],
  ["Infrastructure",[["Budget Code",s.budget_code],["Hosted Location",s.hosted_location]]]
 ] as any[];

 return <div>
  <div className="mb-6 flex items-start justify-between">
   <div>
    <Link to="/services" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700"><ArrowLeft size={15}/>Back to Services</Link>
    <h1 className="text-3xl font-bold">{s.service_name}</h1>
    <p className="mt-2 text-sm text-slate-500">CODE: <b>{s.code}</b> · Customer: <b>{s.customer_name||"—"}</b></p>
   </div>
   <Link to={`/services/${id}/edit`} className="btn-primary"><Edit3 size={16}/>Edit Service</Link>
  </div>

  <div className="grid gap-5 lg:grid-cols-2">
   {cards.map(([title,rows])=><section className="card p-6" key={title}><h2 className="mb-2 font-bold">{title}</h2>{rows.map((r:any)=><Row key={r[0]} label={r[0]} value={r[1]} email={r[2]} copy={r[3]}/>)}</section>)}
  </div>

  <section className="card mt-5 p-6">
   <h2 className="mb-5 font-bold">Service Description</h2>
   <div className="grid gap-6 lg:grid-cols-2">
    <div><p className="mb-2 text-xs font-medium uppercase text-slate-400">English Description</p><p className="whitespace-pre-wrap text-sm leading-7">{s.project_info_en||"—"}</p></div>
    <div dir="rtl"><p className="mb-2 text-xs font-medium text-slate-400">الوصف العربي</p><p className="whitespace-pre-wrap text-sm leading-7">{s.project_info_ar||"—"}</p></div>
   </div>
  </section>

  <section className="card mt-5 p-6">
   <h2 className="mb-2 font-bold">Audit Information</h2>
   <div className="grid gap-6 md:grid-cols-3">
    <Row label="Created Date" value={s.created_at?new Date(s.created_at).toLocaleString():"—"}/>
    <Row label="Last Updated" value={s.updated_at?new Date(s.updated_at).toLocaleString():"—"}/>
    <Row label="Updated By" value={s.updated_by}/>
   </div>
  </section>
 </div>
}
