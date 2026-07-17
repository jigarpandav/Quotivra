import "./QuotationInvoice.css";
import React from "react";
import { useParams } from "react-router-dom";
import api from "../../axios";
import formatDate from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import toWords from "../../utils/nubertoWord"
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import { FaWhatsapp } from "react-icons/fa";
import { TbDownloadFilled } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { BiPrinter } from "react-icons/bi";
// import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa";
import { useRef } from "react";

const getPublicQuotationUrl = (quotationId) => {
  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin;
  return `${siteUrl.replace(/\/$/, "")}/send-quotation-invoice/${quotationId}`;
};


const QuotationInvoice = () => {

    const {id} = useParams();
    const Adminid = localStorage.getItem("admin_id");
    const navigate = useNavigate();
    const [quotations, setQuotation] = React.useState({});
    const [company, setCompany] = React.useState({});
    const[quotationItems, setQuotationItems] = React.useState([]);
    const [admin, setAdmin] = React.useState({});
    const printRef = useRef();

    const BASE_URL = import.meta.env.VITE_LOGO_URL;


    const handleGetQuotation = () => {
        api.post("quotation/id",{
            quotation_id: id,
        }).then((res) => {
            if(res.status ===200){
                const json = res.data
                const Quotation = json.data
                setQuotation(Quotation)
                setQuotationItems(json.items)

            }

        })
    }

    const handlegetCompanySettings = () => {
        api.post("/company-settings",{
            admin_id: Adminid
    }).then((res) => {
        if(res.status === 200){
            const json = res.data
            const companySettings = json.data
           setCompany(companySettings)
        }
    })
}

const handleAdmin = () => {
    api.post("/admin", {
        admin_id: Adminid
    }).then((res) => {
        if(res.status === 200){
            const json = res.data
            const admin = json.data
            setAdmin(admin)
          
        }
    })
}
    React.useEffect(() => {
        handleGetQuotation();
        handlegetCompanySettings();
        handleAdmin();
    }, []);

const quotation = {
  company: {
    person_name: admin.name,
    email: admin.email,
    name: company.company_name,
    logo: `${BASE_URL}${company.company_logo}`,
    address: company.company_address,
    phone: company.contact,
    alternative_contact: company.alternative_contact,
    gst: company.GST, // or company.gst
    city: company.city,
    state: company.state,
    signature: company.signature,
    website: company.website,
    terms_conditions: company.terms_conditions,
  },

  customer: {
    person_name: quotations.customer_name,
    contact: quotations.customer_contact,
  },

  // Correct String Interpolation
  quotationNo: `QTN-${quotations.quotationNo}`,

  date: formatDate(quotations.createdAt),

  // Correct Array Mapping
  items: quotationItems.map((item) => ({
    name: item.product_name,
    quantity: item.quantity,
    price: item.price,
    total: item.total,
  })),

  terms: company.terms_conditions,


};

// Calculate Sub Total
const subTotal = quotation.items.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);

// Calculate Total Quantity
const totalQty = quotation.items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

function handleCancel() {
    navigate("/quotations/view")
}


const handleDownloadPDF = () => {
  const element = document.getElementById("quotation-pdf");

  if (!element) {
    toast.error("PDF section not found");
    return;
  }

  const options = {
    margin: 5,
    filename: `${quotations.customer_name || "quotation"}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(options).from(element).save();
};


const handleSendWhatsApp = () => {
  const phone = quotation.customer.contact; // 10 digit number
  const pdfUrl = getPublicQuotationUrl(id);

  const message = `Hello ${quotation.customer.person_name}, your quotation is ready.

Quotation No: ${quotation.quotationNo}
Amount: ${formatCurrency(subTotal)}

Download PDF:
${pdfUrl}`;

  const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
};



function handlePrint() {
  window.print();
}

  return (
    <div className="view-quotation-page page">
      <div className="container">
        <div className="view-quotation-actions">
          <div>
            <h1 className="page-title">View Quotation</h1>
            <p className="page-subtitle">Preview quotation details before PDF export.</p>
          </div>

          

          <div className="invoice-action-buttons flex flex-wrap items-center gap-9">

  {/* Download PDF */}
  <button
    className="flex items-center justify-center gap-2 h-11 w-44  px-5 rounded-lg
    !bg-blue-600 text-white border border-blue-600
    hover:bg-blue-700 hover:border-blue-700
    hover:shadow-lg hover:shadow-blue-500/20
    active:scale-95 transition-all duration-200"
    onClick={handleDownloadPDF}
  >
    <TbDownloadFilled className="text-xl w-8 bg-blue-600  " />
    <span className="font-medium">Download PDF</span>
  </button>

  {/* WhatsApp */}
  <button
    className="flex items-center justify-center gap-2 h-11 w-44 px-5 rounded-lg
    !bg-green-600  border border-green-600
    hover:bg-green-700 hover:border-green-700
    hover:shadow-lg hover:shadow-green-500/20
    active:scale-95 transition-all duration-200"
    onClick={handleSendWhatsApp}
  >
    <FaWhatsapp  className="text-lg h-14 w-6  text-white  py-3" />
    <span className="font-medium">Send WhatsApp</span>
  </button>
<button
  className="btn btn-primary quotation-pdf"
  onClick={handlePrint}
>
  <FaPrint /> Print
</button>

  {/* Cancel */}
  <button
    className="flex items-center justify-center gap-2 h-11 w-33 px-5 rounded-lg
    border border-red-500/40 !bg-red-500 text-red-400
    hover:bg-red-500 hover:text-white hover:border-red-500
    hover:shadow-lg hover:shadow-red-500/20
    active:scale-95 transition-all duration-200"
    onClick={handleCancel}
  >
    <MdCancel className="text-lg h-11 w-6" />
    <span className="font-medium">Cancel</span>
  </button>

</div>
        </div>

        <div id="quotation-pdf" className="quotation-sheet" ref={printRef}>
          <div className="quotation-top">
            <div className="quotation-logo-box">
              <img src={quotation.company.logo} alt="Company Logo" />
            </div>

            <div className="quotation-company-info">
              <h2>{quotation.company.name}</h2>
              <p>{quotation.company.address}</p>
              <p>
                Phone no.: {quotation.company.phone}
              </p>
              <p> Email:{" "}
                {quotation.company.email}</p>
              <p>GSTIN: {quotation.company.gst}</p>
            </div>
          </div>

          <div className="quotation-section-grid">
            <div className="quotation-box">
              <div className="quotation-box-title">Quotation To</div>
              <div className="quotation-box-body">
              
                <p>Name: {quotation.customer.person_name}</p>
                <p>Contact: {quotation.customer.contact}</p>
            
              </div>
            </div>

            <div className="quotation-box text-right">
              <div className="quotation-box-title">Quotation Details</div>
              <div className="quotation-box-body">
                <p>
                  <strong>Quotation No.:</strong> {quotation.quotationNo}
                </p>
                <p>
                  <strong>Date:</strong> {quotation.date}
                </p>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="quotation-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item name</th>
                  <th>Quantity</th>
                  <th>Price/Unit</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {quotation.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.quantity * item.price)}</td>
                  </tr>
                ))}

                <tr className="quotation-total-row">
                  
                  <td colSpan="2">Total</td>
                  <td>{totalQty}</td>
                  <td></td>
                  <td className="quotation-total-amount text-">{formatCurrency(subTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="quotation-items-mobile">
            {quotation.items.map((item, index) => (
              <article className="quotation-item-card" key={index}>
                <div className="quotation-item-card-header">
                  <span>#{index + 1}</span>
                  <strong>{formatCurrency(item.quantity * item.price)}</strong>
                </div>

                <h3>{item.name}</h3>

                <div className="quotation-item-card-grid">
                  <div>
                    <span>Quantity</span>
                    <strong>{item.quantity}</strong>
                  </div>

                  <div>
                    <span>Price/Unit</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>
                </div>
              </article>
            ))}

            <div className="quotation-item-card quotation-item-total-card">
              <div>
                <span>Total Quantity</span>
                <strong>{totalQty}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong>{formatCurrency(subTotal)}</strong>
              </div>
            </div>
          </div>

          <div className="quotation-amount-grid">
            <div>
              <div className="quotation-box-title">Quotation Amount In Words</div>
              <div className="quotation-amount-words">
                {toWords.convert(subTotal, { currency: true })}
              </div>
            </div>

            <div>
              <div className="quotation-box-title">Amounts</div>
              <div className="quotation-summary-row">
                <span>Sub Total</span>
                <strong>{formatCurrency(subTotal)}</strong>
              </div>
              <div className="quotation-summary-row total">
                <span>Total</span>
                <strong>{formatCurrency(subTotal)}</strong>
              </div>
            </div>
          </div>

          <div className="quotation-bottom-grid">
            <div>
              <div className="quotation-box-title">Company Details</div>
              <div className="quotation-bottom-body">
                <p>
                  <strong>Name:</strong> {quotation.company.name}
                </p>
                <p>
                  <strong>Contact:</strong> {quotation.company.phone}
                </p>
                <p>
                  <strong>Email:</strong> {quotation.company.email}
                </p>
                                <p>
                  <strong>Website:</strong> {quotation.company.website}
                </p>
              </div>
            </div>

            <div>
              <div className="quotation-box-title">Terms and conditions</div>
              <div className="quotation-bottom-body">
                <p>{quotation.terms}</p>
              </div>
            </div>

            <div className="quotation-sign-box">
              <p className="font-extrabold"><small className="font-medium">For: </small> {quotation.company.name}</p>
              <h6 className="signature">{quotation?.company?.person_name || quotation?.company?.name}</h6>
              <strong>Authorized Signatory</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default QuotationInvoice;
