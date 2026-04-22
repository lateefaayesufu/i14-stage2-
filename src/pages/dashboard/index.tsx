import { useEffect, useState } from "react";
import styles from "../../assets/styles/modules/dashboard/dashboard.module.css";
import ShowNoInvoice from "./components/ShowNoInvoice";
import DashboardNav from "./components/DashboardNav";
import { InvoiceType } from "../../types/InvoiceTypes";
import Invoice from "../../features/invoice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getInvoiceAsync } from "../../redux/invoice/invoiceSlice";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useSort from "../../hooks/useSort";
import { useLocation } from "react-router-dom";
import useFilter from "../../hooks/useFilter";

const Dashboard = () => {
  const location = useLocation();
  const [animationParent] = useAutoAnimate();
  const [data, setData] = useState<InvoiceType[]>([]);
  const [sort, setSort] = useState<string[]>([]);
  const [filter, setFilter] = useState<string[]>([]);

  const invoiceData = useSelector((state: RootState) => state.invoice);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, invoiceItems } = invoiceData;

  // Call hooks at component level
  const sortedArray = useSort(data, sort);
  const manipulatedData = useFilter(sortedArray, filter);

  // Load once from localStorage on mount
  useEffect(() => {
    dispatch(getInvoiceAsync());

    const handleStorage = () => dispatch(getInvoiceAsync());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);

  // Reload when returning to dashboard (after create/edit/delete)
  useEffect(() => {
    dispatch(getInvoiceAsync());
  }, [location.key, dispatch]);

  useEffect(() => {
    if (!loading) setData(invoiceItems);
  }, [loading, invoiceItems]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilter = searchParams.get("filter") || "";
    setSort([]);
    setFilter(newFilter.split(","));
  }, [location]);

  return (
    <div className={styles.dashboard}>
      <DashboardNav length={data.length ?? 0} />
      <div className={styles.invoiceContainer}>
        {data && data.length > 0 ? (
          <div className={styles.invoiceWrapper} ref={animationParent}>
            {manipulatedData.map((invoice: InvoiceType) => (
              <Invoice data={invoice} key={invoice.id} />
            ))}
          </div>
        ) : (
          <div className={styles.noInvoice}>
            <ShowNoInvoice />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
