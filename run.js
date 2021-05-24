const fs = require("fs-extra");
const klaw = require("klaw");
const path = require("path");

async function main() {
  const reportFiles = [];
  const reportContents = [];

  for await (const file of klaw(path.resolve(__dirname, "public/data"))) {
    if (
      path.extname(file.path) === ".json" &&
      path.basename(file.path) !== "data"
    ) {
      reportFiles.push(file.path);
    }
  }

  for (const filePath of reportFiles) {
    const content = await fs.readJson(filePath);

    reportContents.push(content);
  }

  const controls = [];

  for (const content of reportContents) {
    for (const profile of content.profiles) {
      for (const control of profile.controls) {
        controls.push(control);
      }
    }
  }

  fs.writeJSON(path.resolve(__dirname, "public/data/data.json"), controls);
}

main().catch((err) => console.log(err));
