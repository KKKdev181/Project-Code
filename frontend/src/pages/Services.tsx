import { useEffect,useMemo,useState } from "react";
import { Link } from "react-router-dom";
import { Search,SlidersHorizontal,ChevronLeft,ChevronRight,ArrowUpDown } from "lucide-react";
import { api } from "../api";
import type { Service } from "../types";

export default function Services(){
 const [rows,setRows]=useState<Service[]>([]);
 const [total,setTotal]=useState(0);
 const [loading,setLoading]=useState(true);
 const [search,setSearch]=useState("");
 const [page,setPage]=useState(1);
 const [showFilters,setShowFilters]=useState(false);
 const [sort,setSort]=useState("updated_at");
 const [order,setOrder]=useState("desc");
 const [filters,setFilters]=useState<Record<string,string>>({});
 const [options,setOptions]=useState<any>({});

 const qs=useMemo(()=>({search,page,limit:10,sort,order,...filters}),[search,page,sort,order,filters]);

 useEffect(()=>{api.get("/services/options").then(r=>setOptions(r.data))},[]);
 useEffect(()=>{
   const timer=setTimeout(()=>{
     setLoading(true);
     api.get("/services",{params:qs}).then(r=>{setRows(r.data.data);setTotal(r.data.total)}).finally(()=>setLoading(false));
   },250);
   return()=>clearTimeout(timer);
 },[qs]);

 const sortable=(key:string)=>{setSort(key);setOrder(sort===key&&order==="asc"?"desc":"asc")};
 const cols=[["service_name","Service Name"],["code","CODE"],["customer_name","Customer"],["division","Division"],["department","Department"],["project_manager","Project Manager"],["technical_lead","Technical Lead"],["support_department","Support"],["hosted_location","Hosted"],["updated_at","Last Updated"]];
 const filterDefs=[["group","Group","group_name"],["division","Division","division"],["department","Department","department"],["unit","Unit","unit"],["customer","Customer","customer_name"],["project_manager","Project Manager","project_manager"],["support_department","Support Department","support_department"],["hosted_location","Hosted Location","hosted_location"]];

 return <div>
  <div className="mb-6 flex items-end justify-between">
    <div><h1 className="text-2xl font-bold">Services</h1><p className="mt-1 text-sm text-slate-500">{total} Services Found</p></div>
    <Link to="/services/new" className="btn-primary">+ Add Service</Link>
  </div>

  <div className="card mb-5 p-4">
   <div className="flex gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
      <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Search by service name, code, customer, project manager..." className="input pl-10"/>
    </div>
    <button onClick={()=>setShowFilters(v=>!v)} className="btn-secondary"><SlidersHorizontal size={17}/>Filters</button>
   </div>
   {showFilters&&<div className="mt-4 border-t pt-4">
    <div className="grid gap-3 md:grid-cols-4">
      {filterDefs.map(([key,label,opt])=><label key={key}><span className="label">{label}</span><select className="input" value={filters[key]||""} onChange={e=>{setFilters(f=>({...f,[key]:e.target.value}));setPage(1)}}><option value="">All</option>{(options[opt]||[]).map((x:string)=><option key={x}>{x}</option>)}</select></label>)}
    </div>
    <button className="mt-3 text-sm font-semibold text-brand-700" onClick={()=>setFilters({})}>Clear Filters</button>
   </div>}
  </div>

  <div className="card overflow-hidden">
   <div className="overflow-x-auto"><table className="w-full min-w-[1150px] text-left text-sm">
    <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{cols.map(([k,l])=><th key={k} className="px-4 py-3"><button onClick={()=>sortable(k)} className="inline-flex items-center gap-1 font-semibold">{l}<ArrowUpDown size={12}/></button></th>)}</tr></thead>
    <tbody className="divide-y divide-slate-100">
      {loading?<tr><td colSpan={10} className="p-10 text-center text-slate-400">Loading services...</td></tr>:
       rows.length===0?<tr><td colSpan={10} className="p-10 text-center text-slate-400">No services match your search.</td></tr>:
       rows.map(r=><tr key={r.id} className="hover:bg-slate-50">{cols.map(([k])=><td key={k} className="whitespace-nowrap px-4 py-3">
         {k==="service_name"?<Link to={`/services/${r.id}`} className="font-semibold text-brand-700 hover:underline">{r.service_name}</Link>:
          k==="hosted_location"?<span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">{r.hosted_location||"—"}</span>:
          k==="updated_at"&&r.updated_at?new Date(r.updated_at).toLocaleDateString():(r as any)[k]||"—"}
       </td>)}</tr>)}
    </tbody>
   </table></div>
   <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
    <span>Page {page} of {Math.max(1,Math.ceil(total/10))}</span>
    <div className="flex gap-2">
      <button className="btn-secondary px-3 py-2" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={16}/></button>
      <button className="btn-secondary px-3 py-2" disabled={page>=Math.ceil(total/10)} onClick={()=>setPage(p=>p+1)}><ChevronRight size={16}/></button>
    </div>
   </div>
  </div>
 </div>
}
