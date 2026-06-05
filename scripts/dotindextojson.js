const fs = require("fs");
const TOML = require("js-toml");

let output = [];
function iterateFolder(folder, type) {
	for (const file of fs.readdirSync(folder)) {
		if (!file.endsWith(".toml")) continue;

		console.log("> " + file);
		const content = fs.readFileSync(folder + "/" + file).toString();
		const data = TOML.load(content);
		console.log(data.name);
		console.log(data.filename);

		if (data.download.mode === "metadata:curseforge") {
			data.download.url = `https://mediafilez.forgecdn.net/files/`;
			const fileID = `${data.update.curseforge["file-id"]}`;
			const roundedLength = Math.round(fileID.length / 2);
			for (let i = 0; i < fileID.length; i++) {
				if (i === roundedLength)
					data.download.url += "/";
				data.download.url += fileID[i];
			}
			data.download.url += "/" + data.filename;
		}

		console.log(data.download.url);
		output.push({type, name: data.name, filename: data.filename, url: data.download.url});
		//console.log(JSON.stringify(data));
		console.log();
	}
}

iterateFolder("D:/da/PrismLauncher/instances/PredelCreate/minecraft/mods/.index", "mod");
iterateFolder("D:/da/PrismLauncher/instances/PredelCreate/minecraft/resourcepacks/.index", "resourcepack");
iterateFolder("D:/da/PrismLauncher/instances/PredelCreate/minecraft/shaderpacks", "shaderpack");

fs.writeFileSync("output.json", JSON.stringify(output, null, "\t"));