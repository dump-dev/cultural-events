import bootstrap from "./bootstrap";
import { closeConnectionDB } from "./typeorm/data-source";

const showUpMessage = () => console.log("🚀 Server is up");
const handleError = (err: any) => {
  console.log("Something goes wrong");
  console.error(err);
  closeConnectionDB();
};

bootstrap()
  .then((server) => server.listen(process.env.SERVER_PORT, showUpMessage))
  .catch(handleError);

process.on("SIGINT", closeConnectionDB);
