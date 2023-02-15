import Image from "next/image";
import styles from "../app/page.module.css";
//use global styles
import "../app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  if (typeof window !== "undefined") {
    if (sessionStorage.getItem("refresh") == "true") {
      sessionStorage.removeItem("refresh");
    }
  }
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
        Zoeken
      </h1>
      <br></br>
      <form>
        <div class="mb-4">
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            id="first"
            type="text"
            placeholder="Voornaam"
          ></input>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            id="last"
            type="text"
            placeholder="Achternaam (geen tussenvoegsels)"
          ></input>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            id="birth"
            type="number"
            placeholder="Geboortejaar"
            onChange={(e) => {
              //make correct if birthyear is incorrect or in the future
              if (e.target.value > new Date().getFullYear()) {
                e.target.value = new Date().getFullYear();
              }
              if (e.target.value < 0) {
                e.target.value = 0;
              }
              if (e.target.value.length > 4) {
                e.target.value = e.target.value.substring(0, 4);
              }
            }}
          ></input>
        </div>

        <button
          class="bg-grey-500 hover:bg-grey-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => {
            var first = document.getElementById("first").value;
            var last = document.getElementById("last").value;
            var birth = document.getElementById("birth").value;
            var url =
              "/api/search?first=" +
              first +
              "&last=" +
              last +
              "&birth=" +
              birth;

            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                if (data.link) {
                  //redirect to the link
                  router.push(data.link);
                }
                if (data.status === "error") {
                  if (data.message === "Multiple results found.") {
                    //redirect to the link
                    var firstURL = "";
                    if (first) var firstURL = "first=" + first;
                    var lastURL = "";
                    if (last) var lastURL = "last=" + last;
                    var birthURL = "";
                    if (birth) var birthURL = "birth=" + birth;
                    router.push(
                      "/multiple?" + firstURL + "&" + lastURL + "&" + birthURL
                    );
                  } else if (data.message === "No results found.") {
                    alert(
                      "Er zijn geen resultaten gevonden voor deze zoekopdracht. Probeer minder specifieke zoektermen te gebruiken."
                    );
                  } else {
                    alert(data.message);
                  }
                }
              });
          }}
        >
          Zoeken
        </button>
      </form>
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
