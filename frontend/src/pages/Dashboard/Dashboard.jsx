import { Link } from "react-router-dom";
import React from "react";
import {
  FaFileInvoice,
  FaClock,
  FaCheckCircle,
  FaWhatsapp,
  FaPlus,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import api from "../../axios";
import formatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/formatDate";
import "./Dashboard.css";

const Dashboard = () => {


  const Adminid = localStorage.getItem("admin_id");
  const [dashboardData, setDashboardData] = React.useState({});
  const [recentQuotations, setRecentQuotations] = React.useState([]);

  const getDashboardData = React.useCallback(()  => {
    api.post("/dashboard",{
      admin_id:Adminid}).then((res) => {
        if(res.status === 200){
          const data = res.data.data;
          setDashboardData(data);
          setRecentQuotations(data.recentQuotations);
        }
      })
  }, [Adminid])
   
  React.useEffect(() => {
    getDashboardData();
  },[getDashboardData])

  const stats = {
    totalQuotations: dashboardData.totalQuotations || 0,
    draftQuotations: dashboardData.totalDraftQuotations || 0,
    approvedQuotations: dashboardData.totalApprovedQuotations || 0,
    rejectedQuotations: dashboardData.totalRejectedQuotations || 0,
    totalRevenue: formatCurrency(dashboardData.totalRevenue) || 0,
  };

  const statusTotal =
    stats.approvedQuotations + stats.draftQuotations + stats.rejectedQuotations;
  const otherQuotations = Math.max(stats.totalQuotations - statusTotal, 0);
  const chartTotal = stats.totalQuotations || statusTotal;

  const approvedPercent = chartTotal
    ? (stats.approvedQuotations / chartTotal) * 100
    : 0;
  const draftPercent = chartTotal
    ? (stats.draftQuotations / chartTotal) * 100
    : 0;
  const rejectedPercent = chartTotal
    ? (stats.rejectedQuotations / chartTotal) * 100
    : 0;

  const statusChartStyle = chartTotal
    ? {
        background: `conic-gradient(
          var(--success) 0 ${approvedPercent}%,
          var(--warning) ${approvedPercent}% ${approvedPercent + draftPercent}%,
          var(--danger) ${approvedPercent + draftPercent}% ${approvedPercent + draftPercent + rejectedPercent}%,
          var(--border) ${approvedPercent + draftPercent + rejectedPercent}% 100%
        )`,
      }
    : undefined;



 

  return (
    <div className="dashboard-page page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, manage your quotations easily.
            </p>
          </div>

          <Link to="/quotations/add" className="btn dashboard-create-btn">
            <FaPlus /> Create Quotation
          </Link>
        </div>

        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card card">
            <div className="dashboard-stat-icon blue">
              <FaFileInvoice />
            </div>
            <div>
              <p>Total Quotations</p>
              <h2>{stats.totalQuotations}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card card">
            <div className="dashboard-stat-icon orange">
              <FaClock />
            </div>
            <div>
              <p>Draft Quotations</p>
              <h2>{stats.draftQuotations}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card card">
            <div className="dashboard-stat-icon green">
              <FaCheckCircle />
            </div>
            <div>
              <p>Approved Quotations</p>
              <h2>{stats.approvedQuotations}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card card">
            <div className="dashboard-stat-icon whatsapp">
              <FaIndianRupeeSign />
            </div>
            <div>
              <p> Total Revenue</p>
              <h2>{stats.totalRevenue}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="dashboard-card card">
            <h3>Monthly Quotations</h3>

<div className="dashboard-chart">
  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
    (month, index) => {
      const monthData = dashboardData.monthlyRevenue?.find(
        (item) => item._id.month === index + 1
      );

      const revenue = monthData?.revenue || 0;

      return (
        <div className="chart-item" key={month}>
          <div
            className="chart-bar"
            style={{
              height: `${Math.max(revenue / 100, 5)}px`,
            }}
            title={formatCurrency(revenue)}
          ></div>
          <span>{month}</span>
        </div>
      );
    }
  )}
</div>
          </div>

          <div className="dashboard-card card">
            <h3>Quotation Status</h3>

            <div className="status-box">
              <div className="status-circle" style={statusChartStyle}>
                <span>{stats.totalQuotations}</span>
                <small className="!text-white text-stone-100">Total</small>
              </div>

              <div className="status-list">
                <p><span className="dot approved"></span> Approved: <strong>{stats.approvedQuotations}</strong></p>
                <p><span className="dot draft"></span> Draft: <strong>{stats.draftQuotations}</strong></p>
                <p><span className="dot rejected"></span> Rejected: <strong>{stats.rejectedQuotations}</strong></p>
                {otherQuotations > 0 && (
                  <p><span className="dot other"></span> Other: <strong>{otherQuotations}</strong></p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card card">
          <div className="dashboard-table-header">
            <h3>Recent Quotations</h3>
            <Link to="/quotations/view">View All</Link>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Quotation No</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentQuotations.map((quotation) => (
                  <tr key={quotation._id}>
                    <td>{"QTN-"}{quotation.quotationNo}</td>
                    <td>{quotation.customer_name}</td>
                    <td>{formatDate(quotation.createdAt)}</td>
                    <td>{formatCurrency(quotation.total_amount)}</td>
                    <td>
                      <span className={`status-badge ${quotation.status}`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td>
                      <div className="dashboard-actions ">
                        <Link className="view-quotations-action view" to={`/quotations/invoice/${quotation._id}`}>
                          <FaEye />
                        </Link>
                        <Link className="view-quotations-action edit" to={`/update-quotation/${quotation._id}`}>
                          <FaEdit />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
