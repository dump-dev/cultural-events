import bootstrap from "./bootstrap";
import { closeConnectionRedis } from "./redis-client/client";
import { closeConnectionDB } from "./typeorm/data-source";

const showUpMessage = () => console.log("🚀 Server is up");
const handleError = async (err: any) => {
  console.log("Something goes wrong");
  console.error(err);
  handleExit();
};
const handleExit = async () =>
  Promise.all([closeConnectionDB(), closeConnectionRedis()]);

bootstrap()
  .then((server) => server.listen(process.env.SERVER_PORT, showUpMessage))
  .catch(handleError);

["SIGINT", "SIGTERM"].forEach((signal) => process.on(signal, handleExit));
