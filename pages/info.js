import Image from "next/image";
import styles from "../app/page.module.css";
//use global styles
import "../app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  return (
    <div
      style={{
        //fix to center horizontally and vertically
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        //center text
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
        }}
      >
        Info
      </h1>
      <br></br>
      <p style={{ fontSize: "1rem" }}>
        Website door{" "}
        <a
          href="https://daanschenkel.nl"
          style={{
            //underline
            textDecoration: "underline",
          }}
          target="_blank"
        >
          Daan Schenkel
        </a>
        <br></br>
        Samenstelling database{" "}
        <a
          href="https://www.historischeverenigingroon.nl/"
          style={{
            //underline
            textDecoration: "underline",
          }}
          target="_blank"
        >
          Historische Vereniging Roon
        </a>
        <br></br>
        Digitalisering database{" "}
        <a
          href="/persoon?voor=Kees&achter=Meulen"
          style={{
            //underline
            textDecoration: "underline",
          }}
        >
          Kees van der Meulen
        </a>
      </p>
      <br></br>
      <div class="px-4 py-2">
        <a
          href="#"
          class="bg-grey-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            router.push("/");
          }}
        >
          Terug
        </a>
      </div>
    </div>
  );
}
