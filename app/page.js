import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
        className={inter.className}
        style={{
          fontSize: "2rem",
        }}
      >
        Genealogie Roden
      </h1>

      <Link href="/info" className={styles.card} rel="noopener noreferrer">
        <h2 className={inter.className}>
          Info <span>-&gt;</span>
        </h2>
        <p className={inter.className}>
          Info over het project, de bronnen en de auteurs.
        </p>
      </Link>
      <Link href="/zoeken" className={styles.card} rel="noopener noreferrer">
        <h2 className={inter.className}>
          Zoeken <span>-&gt;</span>
        </h2>
        <p className={inter.className}>Zoek een persoon in de database.</p>
      </Link>
    </div>
  );
}
