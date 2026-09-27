import { useEffect,useState } from "react";
import { api } from "../api";
import { Server,Users,MapPin,Building2 } from "lucide-react";

export default function Dashboard(){
 const [s,setS]=useState<any>(null);
 useEffect(()=>{api.get("/services/stats").then(r=>setS(r.data))},[]);
 if(!s)return <div className="text-slate-500">Loading dashboard...</div>;

 const cards=[
  ["Total Services",s.total_services,Server],
  ["Total Customers",s.total_customers,Users],
  ["Hosting Locations",s.hosting.length,MapPin],
  ["Divisions",s.divisions.length,Building2]
 ] as const;

 return <div>
  <div className="mb-7"><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-1 text-sm text-slate-500">Overview of managed services and ownership information.</p></div>
  <div className="grid gap-4 md:grid-cols-4">{cards.map(([l,v,I])=><div className="card p-5" key={l}><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{l}</p><p className="mt-2 text-3xl font-bold">{v}</p></div><div className="rounded-xl bg-brand-50 p-3 text-brand-700"><I size={22}/></div></div></div>)}</div>
  <div className="mt-6 grid gap-6 lg:grid-cols-2">
   <div className="card p-6"><h2 className="mb-4 font-bold">Services by Hosted Location</h2><div className="space-y-3">{s.hosting.map((x:any)=><div key={x.label} className="flex justify-between rounded-lg bg-slate-50 px-4 py-3"><span>{x.label}</span><b>{x.count}</b></div>)}</div></div>
   <div className="card p-6"><h2 className="mb-4 font-bold">Recently Updated</h2><div className="divide-y">{s.recent.map((x:any)=><div key={x.id} className="py-3"><div className="flex justify-between"><b className="text-sm">{x.service_name}</b><span className="text-xs text-slate-400">{new Date(x.updated_at).toLocaleDateString()}</span></div><p className="mt-1 text-xs text-slate-500">{x.code} · {x.updated_by}</p></div>)}</div></div>
  </div>
 </div>
}
