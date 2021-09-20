import "tailwindcss/tailwind.css";
import "react-responsive-modal/styles.css";
import "nprogress/nprogress.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import Router from "next/router";
import progress from "nprogress";
import ShopingCargProvider from "components/context/ShoppingCartProvider";

progress.configure({
  showSpinner: true,
});

Router.events.on("routeChangeStart", () => progress.start());
Router.events.on("routeChangeComplete", () => progress.done());
Router.events.on("routeChangeError", () => progress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ShopingCargProvider>
          <div className="h-screen">
            <Component {...pageProps} />
          </div>
        </ShopingCargProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
