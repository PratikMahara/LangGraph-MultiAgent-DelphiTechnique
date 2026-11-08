import app from "./app.js";

const PORT = Number(process.env.PORT || 5000);
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("Could not start the API server:", error);
  process.exitCode = 1;
});
