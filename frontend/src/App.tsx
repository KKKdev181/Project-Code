import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceEdit from "./pages/ServiceEdit";
import ServiceDetails from "./pages/ServiceDetails";
import ImportExport from "./pages/ImportExport";
import type { Lang } from "./i18n";

export default function App(){
  const [lang,setLang]=useState<Lang>("en");
  return <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      <Route element={<Layout lang={lang} setLang={setLang}/>}>
        <Route index element={<Dashboard/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/services/new" element={<ServiceEdit mode="new"/>}/>
        <Route path="/services/:id" element={<ServiceDetails/>}/>
        <Route path="/services/:id/edit" element={<ServiceEdit mode="edit"/>}/>
        <Route path="/import-export" element={<ImportExport/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
}
