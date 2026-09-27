import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, List, PlusCircle, ArrowUpDown, Languages } from "lucide-react";
import type { Lang } from "../i18n";
import { t } from "../i18n";

export default function Layout({lang,setLang}:{lang:Lang,setLang:(l:Lang)=>void}){
  const x=t[lang];
  const nav=[
    ["/",x.dashboard,LayoutDashboard],
    ["/services",x.services,List],
    ["/services/new",x.add,PlusCircle],
    ["/import-export",x.importExport,ArrowUpDown]
  ] as const;
  return <div dir={lang==="ar"?"rtl":"ltr"} className="min-h-screen bg-slate-50">
    <aside className="fixed inset-y-0 z-20 w-64 border-e border-slate-200 bg-white p-5">
      <div className="mb-8">
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-bold text-white">SI</div>
        <h1 className="text-lg font-bold text-slate-900">{x.title}</h1>
        <p className="mt-1 text-xs text-slate-500">Technology Service Management</p>
      </div>
      <nav className="space-y-1">
        {nav.map(([to,label,Icon])=>
          <NavLink key={to} end={to==="/"} to={to}
            className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive?"bg-brand-50 text-brand-700":"text-slate-600 hover:bg-slate-50"}`}>
            <Icon size={18}/>{label}
          </NavLink>
        )}
      </nav>
    </aside>
    <div className={lang==="ar"?"mr-64":"ml-64"}>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
        <button onClick={()=>setLang(lang==="en"?"ar":"en")} className="btn-secondary"><Languages size={17}/>{lang==="en"?"عربي":"EN"}</button>
      </header>
      <main className="p-8"><Outlet/></main>
    </div>
  </div>
}
