//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  const id = req.query.id;
  if (!req.query.id)
    return res.send({ status: "error", message: "ID niet meegegeven" });

  var url =
    "https://GenealogieRodenAPI.daanschenkel.repl.co/api/getRelatie?id=" + id;

  fetch(url)
    .then((res) => res.json())

    .then((data) => {
      res.send(data);
    });
}
