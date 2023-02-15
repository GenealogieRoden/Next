import Image from "next/image";
import styles from "../app/page.module.css";
//use global styles
import "../app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const router = useRouter();
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem("refresh") == "true") {
      sessionStorage.removeItem("refresh");
    }
  }
  useEffect(() => {
    //fetch data

    //get query parameters

    const queryKey1 = "first";
    const queryKey2 = "last";
    const queryKey3 = "birth";

    const first = router.query[queryKey1];
    const last = router.query[queryKey2];
    const birth = router.query[queryKey3];

    var firstURL = "";
    var lastURL = "";
    var birthURL = "";
    if (first !== undefined) var firstURL = "&first=" + first;
    if (last !== undefined) var lastURL = "&last=" + last;
    if (birth !== undefined) var birthURL = "&birth=" + birth;

    var url = "/api/list?" + firstURL + lastURL + birthURL;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status == "error") {
          router.push("/persoon?" + firstURL + lastURL + birthURL);
        } else {
          setData(data);
          setLoading(false);
        }
      });
  }, [router.isReady]);

  if (loading) {
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
          Resultaat
        </h1>
        <p>Even geduld aub. De resultaten worden opgehaald.</p>
      </div>
    );
  }

  if (!loading) {
    return (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
          }}
        >
          Resultaat
        </h1>
        <p>
          Er zijn {data.length} resultaten gevonden. Klik op een van de resultaten om
          verder te gaan.
        </p>
        <br></br>
        <div class="grid grid-cols-1 gap-4">
          <div class="shadow-md rounded-lg overflow-hidden">
            {data.map((item) => (
              <div>
                <div
                  class="px-4 py-2 "
                  onClick={() => {
                    router.push("/persoon?id=" + item.id);
                  }}
                  style={{
                    backgroundColor: "#1a202c",
                  }}
                >
                  <h1 class="text-white-900 font-bold text-2xl">
                    {item.voornaam} {item.achternaam}{" "}
                    {item.roepnaam ? "(" + item.roepnaam + ")" : ""}
                  </h1>
                  <p class="text-white-600 text-sm">
                    Geboren:{" "}
                    {item.geboortedag !== "" ? item.geboortedag + "/" : ""}
                    {item.geboortemaand !== "" ? item.geboortemaand + "/" : ""}
                    {item.geboortejaar !== "" ? item.geboortejaar : ""}
                    {item.geboorteplaats !== ""
                      ? " te " + item.geboorteplaats
                      : ""}
                  </p>
                </div>
                <br></br>
              </div>
            ))}
            <button>
              <Link href="/zoeken">Terug</Link>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
