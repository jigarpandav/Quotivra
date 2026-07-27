import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaSearch,
  FaUndo,
  FaEye,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoice,
} from "react-icons/fa";

import { toast } from "react-toastify";

import api from "../../axios";
import formatDate from "../../utils/formatDate";
import formatCurrency from "../../utils/formatCurrency";

import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Loader from "../../components/Loader/Loader";

import "./ViewQuotation.css";

const ViewQuotation = () => {
  const navigate = useNavigate();

  // Use the same key that you save after login.
  const adminId = localStorage.getItem("admin_id")

  const limit = 5;

  const [quotations, setQuotations] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] =
    useState(null);

  /* =========================
     SEARCH DEBOUNCE
  ========================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* =========================
     FETCH QUOTATIONS
  ========================= */

  const handleGetQuotations = useCallback(async () => {
    if (!adminId) {
      setError("Admin ID not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/quotations", {
        admin_id: adminId,
        limit,
        page: currentPage,
        search: debouncedSearch,
        status,
        period,
      });

      const responseData = response.data;

      setQuotations(responseData?.data || []);

      setTotalPages(
        responseData?.pagination?.totalPages || 0
      );

      setTotalItems(
        responseData?.pagination?.totalItems || 0
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load quotations";

      setError(message);
      setQuotations([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [
    adminId,
    currentPage,
    debouncedSearch,
    status,
    period,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGetQuotations();
    }, 0);

    return () => clearTimeout(timer);
  }, [handleGetQuotations]);

  /* =========================
     FILTER HANDLERS
  ========================= */

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatus("");
    setPeriod("");
    setCurrentPage(1);
  };

  /* =========================
     NAVIGATION
  ========================= */

  const handleInvoiceView = (id) => {
    navigate(`/quotations/invoice/${id}`);
  };

  const handleEditQuotation = (id) => {
    navigate(`/update-quotation/${id}`);
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id) => {
    setSelectedQuotationId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setIsModalOpen(false);
    setSelectedQuotationId(null);
  };

  const confirmDelete = async () => {
    if (!selectedQuotationId) return;

    try {
      setDeleteLoading(true);

      const response = await api.post(
        "/quotation/delete",
        {
          quotation_id: selectedQuotationId,
        }
      );

      toast.success(
        response.data?.message ||
        "Quotation deleted successfully"
      );

      setIsModalOpen(false);
      setSelectedQuotationId(null);

      /*
        If the final item on the current page is deleted,
        move back one page. Otherwise refetch the same page.
      */
      if (quotations.length === 1 && currentPage > 1) {
        setCurrentPage((previousPage) => previousPage - 1);
      } else {
        await handleGetQuotations();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to delete quotation";

      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  /* =========================
     PAGINATION
  ========================= */

  const goToPreviousPage = () => {
    setCurrentPage((previousPage) =>
      Math.max(previousPage - 1, 1)
    );
  };

  const goToNextPage = () => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage + 1, totalPages)
    );
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    const maximumButtons = 5;

    if (totalPages <= maximumButtons) {
      for (let page = 1; page <= totalPages; page += 1) {
        visiblePages.push(page);
      }

      return visiblePages;
    }

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + maximumButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maximumButtons + 1;
    }

    for (
      let page = startPage;
      page <= endPage;
      page += 1
    ) {
      visiblePages.push(page);
    }

    return visiblePages;
  };

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
        loading={deleteLoading}
      />

      <main className="view-quotations-page page">
        <div className="container">
          <header className="view-quotations-header">
            <div>
              <h1 className="page-title">
                View All Quotations
              </h1>

              <div className="view-quotations-breadcrumb">
                <Link to="/dashboard">Dashboard</Link>
                <span aria-hidden="true">&gt;</span>
                <p>Quotations</p>
              </div>
            </div>

            <Link
              to="/quotations"
              className="view-quotations-add-btn"
            >
              <FaPlus />
              Add Quotation
            </Link>
          </header>

          <section className="view-quotations-filter-card card">
            <div className="view-quotations-search-box">
              <FaSearch />

              <input
                type="search"
                placeholder="Search customer, contact or QTN number..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                aria-label="Search quotations"
              />
            </div>

            <div className="view-quotations-filter-group">
              <label htmlFor="quotation-status">
                Status
              </label>

              <select
                id="quotation-status"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="">All Status</option>
                <option value="approved">
                  Approved
                </option>
                <option value="draft">Draft</option>
                <option value="rejected">
                  Rejected
                </option>
              </select>
            </div>

            <div className="view-quotations-filter-group">
              <label htmlFor="quotation-period">
                Period
              </label>

              <select
                id="quotation-period"
                value={period}
                onChange={handlePeriodChange}
              >
                <option value="">All Time</option>
                <option value="this-month">
                  This Month
                </option>
                <option value="last-month">
                  Last Month
                </option>
                <option value="this-year">
                  This Year
                </option>
                <option value="last-year">
                  Last Year
                </option>
              </select>
            </div>

            <button
              type="button"
              className="view-quotations-reset-btn"
              onClick={handleResetFilters}
              disabled={
                !searchQuery && !status && !period
              }
            >
              <FaUndo />
              Reset
            </button>
          </section>

          {error && (
            <div className="view-quotations-error">
              {error}

              <button
                type="button"
                onClick={handleGetQuotations}
              >
                Try Again
              </button>
            </div>
          )}

          <section className="view-quotations-table-card card">
            <div className="view-quotations-table-heading">
              <div>
                <h2>Quotations</h2>

                <p>
                  {totalItems} quotation
                  {totalItems === 1 ? "" : "s"} found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="view-quotations-loader">
                <Loader />
              </div>
            ) : (
              <>
                <div className="view-quotations-table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Quotation No</th>
                        <th>Customer Name</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {quotations.length > 0 ? (
                        quotations.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <span className="quotation-number">
                                QTN-
                                {String(
                                  item.quotationNo
                                ).padStart(4, "0")}
                              </span>
                            </td>

                            <td>
                              <span className="quotation-customer">
                                {item.customer_name}
                              </span>
                            </td>

                            <td>
                              {item.customer_contact}
                            </td>

                            <td>
                              {formatDate(
                                item.quotation_date ||
                                  item.createdAt
                              )}
                            </td>

                            <td>
                              <strong className="quotation-amount">
                                {formatCurrency(
                                  item.total_amount || 0
                                )}
                              </strong>
                            </td>

                            <td>
                              <span
                                className={`view-quotations-status ${
                                  item.status || "draft"
                                }`}
                              >
                                {item.status || "draft"}
                              </span>
                            </td>

                            <td>
                              <div className="view-quotations-actions">
                                <button
                                  type="button"
                                  className="view-quotations-action view"
                                  title="View quotation"
                                  aria-label={`View quotation QTN-${item.quotationNo}`}
                                  onClick={() =>
                                    handleInvoiceView(
                                      item._id
                                    )
                                  }
                                >
                                  <FaEye />
                                </button>

                                <button
                                  type="button"
                                  className="view-quotations-action edit"
                                  title="Edit quotation"
                                  aria-label={`Edit quotation QTN-${item.quotationNo}`}
                                  onClick={() =>
                                    handleEditQuotation(
                                      item._id
                                    )
                                  }
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  type="button"
                                  className="view-quotations-action delete"
                                  title="Delete quotation"
                                  aria-label={`Delete quotation QTN-${item.quotationNo}`}
                                  onClick={() =>
                                    handleDelete(item._id)
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="view-quotations-empty-cell"
                          >
                            <div className="view-quotations-empty">
                              <FaFileInvoice />

                              <h3>
                                No quotations found
                              </h3>

                              <p>
                                Change your filters or
                                create a new quotation.
                              </p>

                              <Link to="/quotations">
                                <FaPlus />
                                Create Quotation
                              </Link>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="view-quotations-mobile-list">
                  {quotations.length > 0 ? (
                    quotations.map((item) => (
                      <article
                        className="view-quotations-mobile-card"
                        key={item._id}
                      >
                        <div className="view-quotations-mobile-card-header">
                          <div>
                            <span className="view-quotations-mobile-label">
                              Quotation No
                            </span>
                            <strong>
                              QTN-
                              {String(item.quotationNo).padStart(
                                4,
                                "0"
                              )}
                            </strong>
                          </div>

                          <span
                            className={`view-quotations-status ${
                              item.status || "draft"
                            }`}
                          >
                            {item.status || "draft"}
                          </span>
                        </div>

                        <div className="view-quotations-mobile-customer">
                          <span className="view-quotations-mobile-label">
                            Customer
                          </span>
                          <strong>{item.customer_name}</strong>
                        </div>

                        <div className="view-quotations-mobile-grid">
                          <div>
                            <span className="view-quotations-mobile-label">
                              Contact
                            </span>
                            <p>{item.customer_contact}</p>
                          </div>

                          <div>
                            <span className="view-quotations-mobile-label">
                              Date
                            </span>
                            <p>
                              {formatDate(
                                item.quotation_date ||
                                  item.createdAt
                              )}
                            </p>
                          </div>

                          <div className="view-quotations-mobile-amount">
                            <span className="view-quotations-mobile-label">
                              Total Amount
                            </span>
                            <strong>
                              {formatCurrency(
                                item.total_amount || 0
                              )}
                            </strong>
                          </div>
                        </div>

                        <div className="view-quotations-mobile-actions">
                          <button
                            type="button"
                            className="view-quotations-mobile-action view"
                            onClick={() =>
                              handleInvoiceView(item._id)
                            }
                          >
                            <FaEye />
                            View
                          </button>

                          <button
                            type="button"
                            className="view-quotations-mobile-action edit"
                            onClick={() =>
                              handleEditQuotation(item._id)
                            }
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="view-quotations-mobile-action delete"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="view-quotations-empty">
                      <FaFileInvoice />

                      <h3>No quotations found</h3>

                      <p>
                        Change your filters or create a new quotation.
                      </p>

                      <Link to="/quotations">
                        <FaPlus />
                        Create Quotation
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {!loading &&
              quotations.length > 0 &&
              totalPages > 0 && (
                <footer className="view-quotations-footer">
                  <p>
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="view-quotations-pagination">
                    <button
                      type="button"
                      className="view-quotations-pagination-btn pagination-nav"
                      disabled={currentPage === 1}
                      onClick={goToPreviousPage}
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    {getVisiblePages().map(
                      (pageNumber) => (
                        <button
                          type="button"
                          key={pageNumber}
                          className={`view-quotations-pagination-btn ${
                            currentPage === pageNumber
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setCurrentPage(pageNumber)
                          }
                          aria-label={`Go to page ${pageNumber}`}
                          aria-current={
                            currentPage === pageNumber
                              ? "page"
                              : undefined
                          }
                        >
                          {pageNumber}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      className="view-quotations-pagination-btn pagination-nav"
                      disabled={
                        currentPage === totalPages
                      }
                      onClick={goToNextPage}
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </div>
                </footer>
              )}
          </section>
        </div>
      </main>
    </>
  );
};

export default ViewQuotation;
