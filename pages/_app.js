import "tailwindcss/tailwind.css";
// import { Inter } from 'next/font/google'
import Umami from "../components/Umami";

// const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Umami />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
