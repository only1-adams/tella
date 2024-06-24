import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Global styles
import "./styles/global.scss";
// React query
import { QueryClient, QueryClientProvider } from "react-query";

import { routes } from "./router/Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  refetchOnReconnect: false,
  retry: false,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools /> */}
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          brand: [
            "#E3F2FD",
            "#BBDEFB",
            "#90CAF9",
            "#64B5F6",
            "#42A5F5",
            "#2196F3",
            "#1E88E5",
            "#1976D2",
            "#1565C0",
            "#0D47A1",
          ],
          background: "linear-gradient(175.95deg, #56BBEB 25.27%, #2D99CC 88.32%)",
          textColor: [
            "#06161F",
            "#474848"
          ]
        },
        globalStyles: theme => ({
          body: {
            color: "#000000",
            background: "#FAFAFA",
          },
        }),
        primaryShade: 8,
        primaryColor: "brand",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSizes: {
          xs: '0.6rem',
          sm: '0.75rem',
          md: '0.9rem',
          lg: '1rem',
          xl: '1.2rem',
        },
      }}
    >
      <ModalsProvider>
        <NotificationsProvider position="top-center">
          <BrowserRouter>{routes}</BrowserRouter>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </QueryClientProvider>
);
