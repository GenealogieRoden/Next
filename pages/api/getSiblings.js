//import fetch library
import fetch from "node-fetch";
export default function handler(req, res) {
  //get query

  if (!req.query.id)
    return res.send({ status: "error", message: "ID niet meegegeven" });

  const id = req.query.id;

  var url =
    "https://GenealogieRodenAPI.daanschenkel.repl.co/api/broersenzussen?id=" +
    id;

  fetch(url)
    .then((res) => res.json())

    .then((data) => {
      res.send(data);
    });
}
