import Header from "@/components/header";
import type { AppProps } from "next/app";
import { useEffect } from "react";



export default function AppComponent({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import("bootstrap/dist/css/bootstrap.css");
  }, []);

  return (
        <div>  
          <Header currentUser={{ currentUser: null }} />    
          <Component {...pageProps} />;
        </div>
  )
}
