import { useState } from "react";
import type { Service } from "../types";

const Field=({label,name,value,onChange,type="text",required=false,dir}:{label:string,name:string,value:any,onChange:any,type?:string,required?:boolean,dir?:string})=>
<label><span className="label">{label}{required&&" *"}</span><input dir={dir} type={type} name={name} value={value??""} onChange={onChange} required={required} className="input"/></label>;

const Text=({label,name,value,onChange,dir}:{label:string,name:string,value:any,onChange:any,dir?:string})=>
<label className="md:col-span-2"><span className="label">{label}</span><textarea dir={dir} name={name} value={value??""} onChange={onChange} rows={4} className="input resize-y"/></label>;

export default function ServiceForm({initial,onSubmit,onCancel,saving=false}:{initial:Service,onSubmit:(s:Service)=>void,onCancel:()=>void,saving?:boolean}){
 const [s,setS]=useState(initial);
 const change=(e:any)=>setS(v=>({...v,[e.target.name]:e.target.value}));
 return <form onSubmit={e=>{e.preventDefault();onSubmit(s)}} className="space-y-5">
  <section className="card p-6"><h2 className="mb-5 font-bold">General Information</h2><div className="grid gap-4 md:grid-cols-2">
   <Field label="Service Name" name="service_name" value={s.service_name} onChange={change} required/>
   <Field label="CODE" name="code" value={s.code} onChange={change} required/>
   <Field label="HPSM Name – English" name="hpsm_name_en" value={s.hpsm_name_en} onChange={change}/>
   <Field label="HPSM Name – Arabic" name="hpsm_name_ar" value={s.hpsm_name_ar} onChange={change} dir="rtl"/>
   <Field label="Customer Name" name="customer_name" value={s.customer_name} onChange={change}/>
   <Field label="Date" name="service_date" value={s.service_date?.slice(0,10)} onChange={change} type="date"/>
  </div></section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Organization</h2><div className="grid gap-4 md:grid-cols-2">
   <Field label="Group" name="group_name" value={s.group_name} onChange={change}/>
   <Field label="Division" name="division" value={s.division} onChange={change}/>
   <Field label="Department" name="department" value={s.department} onChange={change}/>
   <Field label="Unit" name="unit" value={s.unit} onChange={change}/>
  </div></section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Financial</h2>
   <Field label="Budget Code (Infrastructure)" name="budget_code" value={s.budget_code} onChange={change}/>
  </section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Project Ownership</h2><div className="grid gap-4 md:grid-cols-2">
   <Field label="Project Manager" name="project_manager" value={s.project_manager} onChange={change}/>
   <Field label="Project Manager Email" name="project_manager_email" value={s.project_manager_email} onChange={change} type="email"/>
  </div></section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Technical Ownership</h2><div className="grid gap-4 md:grid-cols-2">
   <Field label="Technical Lead" name="technical_lead" value={s.technical_lead} onChange={change}/>
   <Field label="Technical Manager Email" name="technical_manager_email" value={s.technical_manager_email} onChange={change} type="email"/>
  </div></section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Support</h2><div className="grid gap-4 md:grid-cols-2">
   <Field label="Support Department" name="support_department" value={s.support_department} onChange={change}/>
   <Field label="Support Department SPOC" name="support_spoc" value={s.support_spoc} onChange={change}/>
   <Field label="Support SPOC Email" name="support_spoc_email" value={s.support_spoc_email} onChange={change} type="email"/>
  </div></section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Hosting</h2>
   <select className="input" name="hosted_location" value={s.hosted_location??""} onChange={change}>
    <option value="">Select</option>
    {["Elm Data Center","GCP","OpenShift","External Hosting","Other"].map(x=><option key={x}>{x}</option>)}
   </select>
  </section>

  <section className="card p-6"><h2 className="mb-5 font-bold">Service Description</h2><div className="grid gap-4 md:grid-cols-2">
   <Text label="Project / Service Information – English" name="project_info_en" value={s.project_info_en} onChange={change}/>
   <Text label="Project / Service Information – Arabic" name="project_info_ar" value={s.project_info_ar} onChange={change} dir="rtl"/>
  </div></section>

  <div className="flex justify-end gap-3">
   <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
   <button disabled={saving} className="btn-primary">{saving?"Saving...":"Save Service"}</button>
  </div>
 </form>
}
