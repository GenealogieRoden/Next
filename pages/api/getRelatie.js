//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.id)
    return res.send({ status: "error", message: "ID niet meegegeven" });

  const id1 = req.query.id1;
  const id2 = req.query.id2;

  var url =
    "https://GenealogieRodenAPI.daanschenkel.repl.co/api/getRelatie?id1=" +
    id1 +
    "&id2=" +
    id2;

  fetch(url)
    .then((res) => res.json())

    .then((data) => {
      res.send(data);
    });
}
