const fs = require('fs');
const AdmZip = require('adm-zip');
const BACKEND_URL = '';

// build zip
const zip = new AdmZip();

zip.addLocalFolder('./app/assets', '/assets');
zip.addLocalFolder('./app/translations', '/translations');
zip.addLocalFile('./app/manifest.json');
zip.addLocalFile('./app/requirements.json');

zip.writeZip('./dist/app.zip');

// build integration_manifest.json
const integrationManifest = require('./integration_manifest_template.json');
const { admin_ui, channelback_url } = integrationManifest.urls;
integrationManifest.urls.admin_ui = admin_ui.replace('BACKEND_URL', BACKEND_URL);
integrationManifest.urls.channelback_url = channelback_url.replace('BACKEND_URL', BACKEND_URL);
fs.writeFileSync('./dist/zendesk_integration_manifest.json', JSON.stringify(integrationManifest, null, 2));