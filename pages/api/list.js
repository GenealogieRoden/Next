//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.first && !req.query.last) {
    return res.send({
      status: "error",
      message: "Geen voor of achternaam ingevuld.",
    });
  }

  const voor = req.query.first;
  const achter = req.query.last;

  if ((!achter || achter === undefined) && voor)
    var url = "http://localhost:3000/api/search?voor=" + voor;
  if ((!voor || voor === undefined) && achter)
    var url = "http://localhost:3000/api/search?achter=" + achter;
  if (voor && achter)
    var url =
      "http://localhost:3000/api/search?voor=" + voor + "&achter=" + achter;

  fetch(url)
    .then((res) => res.json())

    .then((data) => {
      res.send(data);
    });
}
