//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.first && !req.query.last && !req.query.birth) {
    return res.send({
      status: "error",
      message: "Geen voor of achternaam ingevuld.",
    });
  }

  const voor = req.query.first;
  const achter = req.query.last;
  const birth = req.query.birth;
  var voorURL = "";
  var achterURL = "";
  var birthURL = "";
  if (voor && voor !== undefined && voor !== "undefined")
    var voorURL = "voor=" + voor;
  if (achter && achter !== undefined && achter !== "undefined")
    var achterURL = "achter=" + achter;
  if (birth && birth !== undefined && achter !== "undefined")
    var birthURL = "birth=" + birth;
  var url =
    "https://GenealogieRodenAPI.daanschenkel.repl.co/api/search?" +
    voorURL +
    "&" +
    achterURL +
    "&" +
    birthURL;

  fetch(url)
    .then((res) => res.json())

    .then((data) => {
      res.send(data);
    });
}
