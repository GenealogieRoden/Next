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
  const [moederData, setMoederData] = useState([]);
  const [vaderData, setVaderData] = useState([]);
  const [relatieData, setRelatieData] = useState([]);
  const router = useRouter();
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem("refresh") == "true") {
      sessionStorage.removeItem("refresh");
      //back
      window.history.back(1);
    }
  }
  useEffect(() => {
    //fetch data

    //get query parameters

    const queryKey1 = "voor";
    const queryKey2 = "achter";
    const queryKey3 = "id";
    const first = router.query[queryKey1];
    const last = router.query[queryKey2];
    const id = router.query[queryKey3];

    if (!first && !last && id) {
      var url = "/api/loadById?id=" + id;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("Persoon niet gevonden.");
            return router.back();
          }
          setData(data);
          fetch("/api/getRelatie?id=" + id)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) return;
              setRelatieData(data);
            });
          if (data[0].verwijzingmoeder) {
            fetch("/api/loadById?id=" + data[0].verwijzingmoeder)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (!data.error) if (data.length > 0) setMoederData(data[0]);
                setLoading(false);
              });
          }
          if (data[0].verwijzingvader) {
            fetch("/api/loadById?id=" + data[0].verwijzingvader)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (!data.error) if (data.length > 0) setVaderData(data[0]);
                setLoading(false);
              });
          }
          if (data.verwijzingmoeder == "" && data.verwijzingvader == "") {
            setLoading(false);
          }
          setLoading(false);
        });
    } else {
      var url = "/api/list?first=" + first + "&last=" + last;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length < 1) return;
          if (data.length > 1) {
            router.push("/multiple?first=" + first + "&last=" + last);
          }
          setData(data);
          if (data[0].verwijzingmoeder) {
            fetch("/api/loadById?id=" + data[0].verwijzingmoeder)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (!data.error) if (data.length > 0) setMoederData(data[0]);
                setLoading(false);
              });
          }
          if (data[0].verwijzingvader) {
            fetch("/api/loadById?id=" + data[0].verwijzingvader)
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                if (!data.error) if (data.length > 0) setVaderData(data[0]);

                setLoading(false);
              });
          }
          if (data.verwijzingmoeder == "" && data.verwijzingvader == "") {
            setLoading(false);
          }
        });
    }
  }, [router.isReady, router.pathname]);

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
        <p>
          {data.length > 1 ? (
            <span>
              Er zijn meerdere resultaten gevonden voor {router.query.voor}{" "}
              {router.query.achter}
            </span>
          ) : (
            <span></span>
          )}
        </p>
        <br></br>
        <div class="grid grid-cols-1 gap-4">
          <div class="shadow-md rounded-lg overflow-hidden">
            {data.map((item) => (
              <div>
                <div class="px-4 py-2 ">
                  <h1 class="text-white-900 font-bold text-2xl">
                    {item.voornaam} {item.voorvoegsel ? item.voorvoegsel : ""}{" "}
                    {item.achternaam}
                  </h1>
                  {item.roepnaam != "" ? (
                    <p class="text-white-600 text-sm">
                      Roepnaam: {item.roepnaam}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <br></br>
                  <p class="text-white-600 text-l">
                    Geboren: {item.geboortedag !== "" ? item.geboortedag : ""}/
                    {item.geboortemaand !== "" ? item.geboortemaand : ""}/
                    {item.geboortejaar !== "" ? item.geboortejaar : ""} te{" "}
                    {item.geboorteplaats !== "" ? item.geboorteplaats : ""}
                  </p>
                  {item.overlijdingsdag != "" ? (
                    <p class="text-white-600 text-l">
                      Overleden: {item.overlijdingsdag}/{item.overlijdingsmaand}
                      /{item.overlijdingsjaar} te {item.overlijdingsplaats}
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <p class="text-white-600 text-l">
                    Geslacht: {item.geslacht === "m" ? "Man" : "Vrouw"}
                  </p>
                  {item.verwijzingmoeder || item.verwijzingvader ? (
                    <br></br>
                  ) : (
                    ""
                  )}
                  <h1 class="text-white-900 font-bold text-2xl">
                    {(item.verwijzingmoeder !== "0" &&
                      moederData.voornaam !== undefined) ||
                    (item.verwijzingvader !== "0" &&
                      vaderData.voornaam !== undefined)
                      ? "Ouders"
                      : ""}
                  </h1>
                  <p>
                    {(item.verwijzingvader !== "0" &&
                      vaderData.voornaam === undefined) ||
                    (item.verwijzingmoeder !== "0" &&
                      moederData.voornaam === undefined) ? (
                      <p>Data laden...</p>
                    ) : (
                      <p></p>
                    )}{" "}
                    {item.verwijzingvader !== "0" &&
                    vaderData.voornaam !== undefined ? (
                      <div>
                        {" "}
                        <Link
                          href={"/persoon?id=" + item.verwijzingvader}
                          onClick={() => {
                            location = "/persoon?id=" + item.verwijzingvader;
                          }}
                        >
                          Vader (
                          {vaderData.roepnaam
                            ? vaderData.roepnaam
                            : vaderData.voornaam}{" "}
                          {vaderData.voorvoegsel ? vaderData.voorvoegsel : ""}{" "}
                          {vaderData.achternaam})
                        </Link>
                        <br></br>
                      </div>
                    ) : (
                      <p></p>
                    )}{" "}
                    {item.verwijzingmoeder !== "0" &&
                    moederData.voornaam !== undefined ? (
                      <Link
                        href={"/persoon?id=" + item.verwijzingmoeder}
                        onClick={() => {
                          location = "/persoon?id=" + item.verwijzingmoeder;
                        }}
                      >
                        Moeder (
                        {moederData.roepnaam
                          ? moederData.roepnaam
                          : moederData.voornaam}{" "}
                        {moederData.voorvoegsel ? moederData.voorvoegsel : ""}{" "}
                        {moederData.achternaam})
                      </Link>
                    ) : (
                      <p></p>
                    )}
                  </p>
                  {relatieData.length > 0 ? (
                    <p>
                      {relatieData.map((item) => (
                        <div>
                          <br></br>
                          <Link
                            href={"/persoon?id=" + item.relatie1}
                            onClick={() => {
                              location = "/persoon?id=" + item.relatie1;
                            }}
                          >
                            {item.relatie1}
                          </Link>
                          <br></br>
                          <Link
                            href={"/persoon?id=" + item.relatie2}
                            onClick={() => {
                              location = "/persoon?id=" + item.relatie2;
                            }}
                          >
                            {item.relatie2}
                          </Link>
                        </div>
                      ))}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
                <br></br>
                <div class="px-4 py-2"></div>
              </div>
            ))}
            <a
              onClick={() => {
                sessionStorage.setItem("refresh", "true");

                router.back();
              }}
              class="bg-grey-500 text-white font-bold py-2 px-4 rounded"
            >
              Terug
            </a>
          </div>
        </div>
      </div>
    );
  }
}
