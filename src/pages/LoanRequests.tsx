import PageHeader from "@/components/PageHeader/PageHeader";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMyClients } from "@/services/features/client/clientService";
import { getAllLoanProducts } from "@/services/features/loanProduct/loanProductService";
import type { Client } from "@/services/features/client/client.types";
import type { LoanProduct } from "@/services/features/loanProduct/loanProduct.types";
import CreateNewLoan from "@/components/ui/CreateNewLoan";

export default function LoanRequests() {
  const [searchParams] = useSearchParams();

  // State for data
  const [clients, setClients] = useState<Client[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get clientId from URL params (if coming from client details page)
  const clientId = searchParams.get("clientId");

  // Fetch clients and loan products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch clients and loan products in parallel
        const [clientsResponse, loanProductsResponse] = await Promise.all([
          getMyClients(),
          getAllLoanProducts(),
        ]);

        if (clientsResponse.success) {
          setClients(clientsResponse.data);
        } else {
          setError(clientsResponse.message || "Failed to fetch clients");
        }

        if (loanProductsResponse.success) {
          setLoanProducts(loanProductsResponse.data);
        } else {
          setError(
            loanProductsResponse.message || "Failed to fetch loan products"
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          clients={clients}
          loanProducts={loanProducts}
          preselectedClientId={clientId}
        />
      </div>
    </div>
  );
}
