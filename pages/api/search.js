//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.last && !req.query.first && !req.query.birth)
    return res.send({ status: "error", message: "Voer voor of achternaam in" });

  const voor = req.query.first;
  const achter = req.query.last;
  const birth = req.query.birth;

  var voorURL = "";
  var achterURL = "";
  var birthURL = "";
  if (voor && voor !== undefined && voor !== "undefined" && voor !== "")
    var voorURL = "voor=" + voor;
  if (achter && achter !== undefined && achter !== "undefined" && achter !== "")
    var achterURL = "achter=" + achter;
  if (birth && birth !== undefined && achter !== "undefined" && birth !== "")
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
      console.log(data);
      if (data.length < 1) {
        return res.send({ status: "error", message: "No results found." });
      }
      if (data.length === 1) {
        return res.send({
          status: "success",
          link: "/persoon?id=" + data[0].id,
        });
      }
      if (data.length > 1) {
        return res.send({
          status: "error",
          message: "Multiple results found.",
        });
      }
    });
}
