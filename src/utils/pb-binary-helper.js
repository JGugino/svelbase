import { pipeline } from 'node:stream/promises';
import { createWriteStream, fsync, unlink } from 'node:fs';
import { chmod } from 'node:fs/promises';
import AdmZip from 'adm-zip';

/**
 *
 * @param {string} pbVersion
 * @returns {string}
 */
function resolveAssetName(pbVersion) {
	const platform = process.platform; // 'darwin' | 'linux' | 'win32'
	const arch = process.arch; // 'x64' | 'arm64'

	/**
 * @type {Map<string, string>} platformMap
 * @param {string} darwin
 */
  const platformMap = new Map();
  platformMap.set("darwin", "darwin");
  platformMap.set("linux", "linux");
  platformMap.set("win32", "windows");

  const archMap = new Map();
  archMap.set("x64", "amd64");
  archMap.set("arm64", "arm64");


	const pf = platformMap.get(platform);
	const ar = archMap.get(arch);

	if (!pf || !ar) {
		throw new Error(`Unsupported platform/arch: ${platform}/${arch}`);
	}

	const ext = platform === 'win32' ? 'zip' : 'zip'; // PocketBase ships .zip on all platforms
	return `pocketbase_${pbVersion}_${pf}_${ar}.${ext}`;
}

/**
 *
 * @param {import('./auth-hooks.js').requestCancel} cancel
 * @param {string} pbVersion
 */
export async function downloadPocketBaseBinary(cancel, pbVersion) {
  const assetName = resolveAssetName(pbVersion);

  console.log(assetName)

  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${pbVersion}/${assetName}`;

  console.log(url)

	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`Failed to download PocketBase binary: ${res.status} ${res.statusText}`);
	}

  if (!res.body) {
    throw new Error(`Failed to download PocketBase binary: ${res.status} ${res.statusText}`);
  }

	const zipPath = `./${assetName}`;
	await pipeline(res.body, createWriteStream(zipPath));

	// INFO: Unzip the pocketbase binary, and delete the downloaded zip
  const zip = new AdmZip(zipPath)
  zip.extractAllTo("./pb")

  unlink(zipPath, (err) => {
    if (err) {
      cancel("Failed to deleted downloaded pb zip, you'll have to do it manually")
    }
  })

	// INFO: Change permissions if not on windows
	if (process.platform !== 'win32') {
		await chmod('./pb/pocketbase', 0o755);
	}
}
