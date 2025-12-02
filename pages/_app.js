import "../styles/tailwind.css";
import Umami from "../components/Umami";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Umami />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
