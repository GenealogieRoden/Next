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
  const [persoon, setPersoon] = useState([]);
  const [moederData, setMoederData] = useState([]);
  const [vaderData, setVaderData] = useState([]);
  const [relatieData, setRelatieData] = useState(null);
  const [kinderenData, setKinderenData] = useState(null);
  const [siblingsData, setSiblingsData] = useState([]);
  const [referentieData, setReferentieData] = useState(null);
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
    const queryKey4 = "birth";
    const first = router.query[queryKey1];
    const last = router.query[queryKey2];
    const id = router.query[queryKey3];
    const birth = router.query[queryKey4];

    if (id) {
      var url = "/api/loadById?id=" + id;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert("Persoon niet gevonden.");
            return router.back();
          }
          setPersoon(data);
          console.log("Got persoon data");
          console.log(persoon);
          setLoading(false);
          fetch("/api/getReferentie?id=" + id)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) return;
              console.log("GOT REFERENTIE DATA");
              if (!data.referentie) return;
              setReferentieData(data);
              console.log(data);
            });

          fetch("/api/getKinderen?id=" + id)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) return;
              console.log("GOT KINDEREN DATA");
              if (data.length > 0) {
                setKinderenData(data);
                console.log(data);
              }
            });
          fetch("/api/getSiblings?id=" + id)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) return;
              console.log("GOT SIBLINGS DATA");
              if (data.length > 0) {
                setSiblingsData(data);
                console.log(data);
              }
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
          fetch("/api/getRelatie?id=" + id)
            .then((response) => response.json())
            .then((data) => {
              if (data.error) return;
              console.log("GOT RELATIE DATA");
              console.log(persoon);
              setRelatieData(data);

              if (data[0].relatie1 === id) {
                console.log(data[0].relatie1);
                fetch("/api/loadById?id=" + data[0].relatie2)
                  .then((response) => response.json())
                  .then((data) => {
                    if (!data.error) if (data.length > 0) setRelatieData(data);
                  });
              }
              if (data[0].relatie2 === id) {
                console.log(data[0].relatie2);
                fetch("/api/loadById?id=" + data[0].relatie1)
                  .then((response) => response.json())
                  .then((data) => {
                    if (!data.error) if (data.length > 0) setRelatieData(data);
                  });
              }
            });
        });
    }
    if (!id) {
      if (first == undefined && last == undefined && birth == undefined) return;
      var firstURL = "";
      var lastURL = "";
      var birthURL = "";
      console.log("first: " + first + " last: " + last + " birth: " + birth);
      if (first !== undefined) var firstURL = "first=" + first;
      if (last !== undefined) var lastURL = "last=" + last;
      if (birth !== undefined) var birthURL = "birth=" + birth;
      var url = "/api/search?" + firstURL + "&" + lastURL + "&" + birthURL;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.link) {
            return (location = data.link);
          }
          if (data.length < 1) return;
          if (data.length > 1) {
            router.push("/multiple?first=" + first + "&last=" + last);
          }
          if (data.length == 1) {
            location = "/persoon?id=" + data[0].id;
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
          {persoon.length > 1 ? (
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
            {persoon.map((item) => (
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
                  {item.opmerking1 != "" ? (
                    <p class="text-white-600 text-sm">{item.opmerking1}</p>
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
                    {item.verwijzingmoeder !== "0" ||
                    item.verwijzingvader !== "0"
                      ? "Ouders"
                      : ""}
                  </h1>
                  <p>
                    {item.verwijzingvader !== "0" &&
                    vaderData.voornaam === undefined ? (
                      <p>Vader laden...</p>
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
                    moederData.voornaam === undefined ? (
                      <p>Moeder laden...</p>
                    ) : (
                      <p></p>
                    )}
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
                  {relatieData !== null ? (
                    <div>
                      <br></br>
                      <h1 class="text-white-900 font-bold text-2xl">
                        {relatieData[0].geslacht === "m" ? "Echtgenoot" : ""}
                        {relatieData[0].geslacht === "v" ? "Echtgenote" : ""}
                        {relatieData[0].geslacht !== "m" &&
                        relatieData[0].geslacht !== "v"
                          ? "Partner"
                          : ""}
                      </h1>
                      {!relatieData[0].voornaam ? "Partner laden..." : ""}

                      <Link
                        href={"/persoon?id=" + relatieData[0].id}
                        onClick={() => {
                          location = "/persoon?id=" + relatieData[0].id;
                        }}
                      >
                        {relatieData[0].voornaam}{" "}
                        {relatieData[0].roepnaam
                          ? ` (${relatieData[0].roepnaam}) `
                          : ""}{" "}
                        {relatieData[0].voorvoegsel} {relatieData[0].achternaam}{" "}
                      </Link>
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {siblingsData.length !== 0 ? (
                    <div>
                      <br></br>
                      <h1 class="text-white-900 font-bold text-2xl">
                        Broers en zussen
                      </h1>
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {siblingsData.map((item) => (
                    <div>
                      <Link
                        href={"/persoon?id=" + item.id}
                        onClick={() => {
                          location = "/persoon?id=" + item.id;
                        }}
                      >
                        {item.voornaam}{" "}
                        {item.roepnaam ? ` (${item.roepnaam}) ` : ""}{" "}
                        {item.voorvoegsel} {item.achternaam}{" "}
                      </Link>
                    </div>
                  ))}
                  {kinderenData !== null ? (
                    <div>
                      <br></br>
                      <h1 class="text-white-900 font-bold text-2xl">
                        Kinderen
                      </h1>

                      {kinderenData.map((item) => (
                        <div>
                          <Link
                            href={"/persoon?id=" + item.id}
                            onClick={() => {
                              location = "/persoon?id=" + item.id;
                            }}
                          >
                            {item.voornaam}{" "}
                            {item.roepnaam ? ` (${item.roepnaam}) ` : ""}{" "}
                            {item.voorvoegsel} {item.achternaam}{" "}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {referentieData !== null ? (
                    <div>
                      <br></br>
                      <h1 class="text-white-900 font-bold text-m">
                        Referentie
                      </h1>
                      <p>{referentieData.referentie}</p>
                      <p>{referentieData.extra}</p>
                    </div>
                  ) : (
                    <div>
                      <br></br>
                      <h1 class="text-white-900 font-bold text-m">
                        Referentie
                      </h1>
                      <p>Referentie onbekend.</p>
                    </div>
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
