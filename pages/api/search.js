//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.last && !req.query.first)
    return res.send({ status: "error", message: "Voer voor of achternaam in" });

  const voor = req.query.first;
  const achter = req.query.last;

  if (!achter) var url = "http://localhost:3000/api/search?voor=" + voor;
  if (!voor) var url = "http://localhost:3000/api/search?achter=" + achter;
  if (voor && achter)
    var url =
      "http://localhost:3000/api/search?voor=" + voor + "&achter=" + achter;

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
          link: "/persoon?voor=" + voor + "&achter=" + achter,
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
