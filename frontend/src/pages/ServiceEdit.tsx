import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ServiceForm from "../components/ServiceForm";
import { api } from "../api";
import { emptyService } from "../types";
import type { Service } from "../types";

export default function ServiceEdit({mode}:{mode:"new"|"edit"}){
 const {id}=useParams();
 const nav=useNavigate();
 const [initial,setInitial]=useState<Service|null>(mode==="new"?emptyService:null);
 const [saving,setSaving]=useState(false);

 useEffect(()=>{if(mode==="edit"&&id)api.get("/services/"+id).then(r=>setInitial(r.data))},[id,mode]);

 if(!initial)return <div>Loading service...</div>;

 const submit=async(s:Service)=>{
  setSaving(true);
  try{
   if(mode==="new"){
    const r=await api.post("/services",s);
    toast.success("Service created");
    nav("/services/"+r.data.id);
   }else{
    await api.put("/services/"+id,s);
    toast.success("Service updated");
    nav("/services/"+id);
   }
  }catch(e:any){
   toast.error(e.response?.data?.message||"Unable to save service");
  }finally{setSaving(false)}
 };

 return <div className="mx-auto max-w-5xl">
  <div className="mb-6"><h1 className="text-2xl font-bold">{mode==="new"?"Add New Service":"Edit Service"}</h1><p className="mt-1 text-sm text-slate-500">Audit information is captured automatically.</p></div>
  <ServiceForm initial={initial} onSubmit={submit} onCancel={()=>nav(-1)} saving={saving}/>
 </div>
}
