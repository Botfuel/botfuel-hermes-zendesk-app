const fs = require('fs');
const AdmZip = require('adm-zip');
const BACKEND_URL = '';

// build zip
const zip = new AdmZip();

zip.addLocalFolder('./app/assets', '/assets');
zip.addLocalFile('./app/manifest.json');
zip.addLocalFile('./app/requirements.json');

// build translation folder
const addTranslationFile = (lang) => {
  const langJson = JSON.parse(fs.readFileSync('./app/translations/' + lang + '.json'));
  langJson.app.long_description = fs.readFileSync('./app/translations/' + lang + '_long_description.md').toString().replace(/\r/g, '');
  langJson.app.installation_instructions = fs.readFileSync('./app/translations/' + lang + '_installation_instructions.md').toString().replace(/\r/g, '');
  zip.addFile(
    'translations/' + lang + '.json',
    Buffer.from(JSON.stringify(langJson, null, 2), 'utf8')
  );
};
addTranslationFile('en');

zip.writeZip('./dist/app.zip');

// build integration_manifest.json
const integrationManifest = require('./integration_manifest_template.json');
const { admin_ui, channelback_url } = integrationManifest.urls;
integrationManifest.urls.admin_ui = admin_ui.replace('BACKEND_URL', BACKEND_URL);
integrationManifest.urls.channelback_url = channelback_url.replace('BACKEND_URL', BACKEND_URL);
fs.writeFileSync('./dist/zendesk_integration_manifest.json', JSON.stringify(integrationManifest, null, 2));