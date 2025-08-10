
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("data.json")
  .then(res => res.json())
  .then(invoices => {
    const invoice = invoices.find(item => item.id === id);
    if (invoice) {
      document.getElementById("controlUnitInvoiceNumber").textContent = invoice.controlUnitInvoiceNumber;
      document.getElementById("traderSystemInvoiceNo").textContent = invoice.traderSystemInvoiceNo;
      document.getElementById("invoiceDate").textContent = invoice.invoiceDate;
      document.getElementById("totalTaxableAmount").textContent = invoice.totalTaxableAmount;
      document.getElementById("totalTaxAmount").textContent = invoice.totalTaxAmount;
      document.getElementById("totalInvoiceAmount").textContent = invoice.totalInvoiceAmount;
      document.getElementById("supplierName").textContent = invoice.supplierName;
    } else {
      document.querySelector(".container").innerHTML = "<h2>Invoice Not Found</h2>";
    }
  })
  .catch(err => {
    document.querySelector(".container").innerHTML = "<h2>Error loading invoice data</h2>";
  });
