/**
 * @file Ingress-ICE, Dropbox interface
 * @license MIT
 * @original_author c2nprds
 * @modified_by Heistergand, GPT-4 AI : Using the dropbox npm package for uploading.
 */

/*global announce */
/*global config */

const fetch = require('node-fetch');
const fs = require('fs');

/**
 * Upload Dropbox
 * @see AccessToken https://www.dropbox.com/developers/reference/oauth-guide
 * @param {String} token - Dropbox token
 * @param {String} remotepath - Upload path
 * @param {String} path - Screenshot filepath
 * @param {Boolean} remove - delete current file
 */
async function uploadDropbox(token, remotepath, path, remove) {
  const fileContent = fs.readFileSync(path);

  const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'Dropbox-API-Arg': JSON.stringify({
        path: remotepath,
        mode: 'add',
        autorename: true,
        mute: false
      })
    },
    body: fileContent
  });

  if (response.ok) {
    announce('Successfully uploaded file to Dropbox');
    if (remove) {
      fs.unlinkSync(path);
    }
  } else {
    const error = await response.json();
    announce(`Failed to upload file to Dropbox: ${error.error_summary}`);
  }
}
