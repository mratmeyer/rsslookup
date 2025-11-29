import "tailwindcss/tailwind.css";
// import { Inter } from 'next/font/google'
import Fathom from "../components/Fathom";

// const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Fathom />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
