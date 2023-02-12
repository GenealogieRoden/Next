//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  const id1 = req.query.id1;
  const id2 = req.query.id2;
  if (!req.query.id1)
    return res.send({ status: "error", message: "ID1 niet meegegeven" });

  if (!req.query.id2)
    return res.send({ status: "error", message: "ID2 niet meegegeven" });

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
