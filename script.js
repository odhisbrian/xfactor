
(function(){
  function norm(s){return (s||"").replace(/\s+/g," ").replace(/[:：]\s*$/,"").trim().toLowerCase();}
  const FIELDS=[
    {k:"controlUnitInvoiceNumber", l:["control unit invoice number","cu invoice number","c.u. invoice number"]},
    {k:"traderSystemInvoiceNo",   l:["trader system invoice no","trader system invoice number","ts invoice no"]},
    {k:"invoiceDate",             l:["invoice date","date"]},
    {k:"totalTaxableAmount",      l:["total taxable amount","taxable amount"]},
    {k:"totalTaxAmount",          l:["total tax amount","tax amount","tax"]},
    {k:"totalInvoiceAmount",      l:["total invoice amount","invoice total","amount due"]},
    {k:"supplierName",            l:["supplier name","supplier","seller","vendor name"]},
  ];
  const Q = (sel,root=document)=>Array.from(root.querySelectorAll(sel));

  function placeNearLabel(labelEl, val){
    if (!labelEl) return false;
    if (labelEl.nextElementSibling){ labelEl.nextElementSibling.textContent=val; return true; }
    const p=labelEl.parentElement;
    if (p && p.children && p.children.length>=2){
      for (const c of p.children){ if (c!==labelEl){ c.textContent=val; return true; } }
    }
    const t=labelEl.textContent;
    if (/:/.test(t)){ labelEl.textContent=t.replace(/:.*/,": "+val); return true; }
    const span=document.createElement("span"); span.textContent=" "+val;
    if (labelEl.parentElement){ labelEl.parentElement.insertBefore(span,labelEl.nextSibling); return true; }
    return false;
  }

  function findLabels(){
    const cands=Q("td,th,label,span,div,p,b,strong,em");
    const buckets={}; FIELDS.forEach(f=>buckets[f.k]=[]);
    for (const el of cands){
      const t=norm(el.textContent);
      if (!t) continue;
      for (const f of FIELDS){
        if (f.l.some(L=>t===L || t.startsWith(L+" "))) { buckets[f.k].push(el); break; }
      }
    }
    return buckets;
  }

  const params=new URLSearchParams(window.location.search);
  const id=params.get("id");

  fetch("data.json").then(r=>r.json()).then(arr=>{
    const inv=(arr||[]).find(x=>String(x.id)===String(id));
    if (!inv){ console.warn("Invoice not found", id); return; }

    // Explicit placeholders if present
    const explicit={
      controlUnitInvoiceNumber: document.getElementById("controlUnitInvoiceNumber"),
      traderSystemInvoiceNo: document.getElementById("traderSystemInvoiceNo"),
      invoiceDate: document.getElementById("invoiceDate"),
      totalTaxableAmount: document.getElementById("totalTaxableAmount"),
      totalTaxAmount: document.getElementById("totalTaxAmount"),
      totalInvoiceAmount: document.getElementById("totalInvoiceAmount"),
      supplierName: document.getElementById("supplierName")
    };
    const filled={};
    for (const k in explicit){ if (explicit[k]){ explicit[k].textContent=inv[k]??""; filled[k]=true; } }

    const buckets=findLabels();
    for (const f of FIELDS){
      if (filled[f.k]) continue;
      const v=inv[f.k]??"";
      if (!v) continue;
      const els=buckets[f.k]||[];
      for (const el of els){ if (placeNearLabel(el, v)) break; }
    }
  }).catch(e=>console.error("data.json error", e));
})();