import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const AllProvider = ({ children }: PropsWithChildren) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};

export default AllProvider;