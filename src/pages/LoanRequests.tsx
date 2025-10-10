import PageHeader from "@/components/PageHeader/PageHeader";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyClients } from "@/services/features/client/clientSlice";
import { getAllLoanProducts } from "@/services/features/loanProduct/loanProductSlice";
import type { RootState, AppDispatch } from "@/store";
import CreateNewLoan from "@/components/ui/CreateNewLoan";

export default function LoanRequests() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Get clientId from URL params (if coming from client details page)
  const clientId = searchParams.get("clientId");

  // Get data from Redux store
  const {
    myClients,
    isFetching: clientsLoading,
    isError: clientsError,
    message: clientsMessage,
  } = useSelector((state: RootState) => state.client);
  const {
    loanProducts,
    isFetching: productsLoading,
    isError: productsError,
    message: productsMessage,
  } = useSelector((state: RootState) => state.loanProduct);

  const isLoading = clientsLoading || productsLoading;
  const error = clientsError
    ? clientsMessage
    : productsError
    ? productsMessage
    : null;

  // Fetch clients and loan products using Redux
  useEffect(() => {
    dispatch(getMyClients());
    dispatch(getAllLoanProducts());
  }, [dispatch]);

  // Filter loan products to show only active ones
  const activeLoanProducts = loanProducts.filter(
    (product) => product.status === "active"
  );

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Loan Application"
          subtitle="Create a new loan request for your client"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <PageHeader
          title="Loan Application"
          subtitle="Create a new loan request for your client"
        />
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Loan Application"
        subtitle="Create a new loan request for your client"
      />

      <div className="p-4 md:p-6 bg-white rounded-[12px]">
        <CreateNewLoan
          clients={myClients}
          loanProducts={activeLoanProducts}
          preselectedClientId={clientId}
        />
      </div>
    </div>
  );
}
