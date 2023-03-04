const fs = require('fs');
const path = require('path');

const output_dir = '../public/';
const assets = [
  '../node_modules/bootstrap/dist/css/bootstrap.min.css',
  '../node_modules/react-big-calendar/lib/css/react-big-calendar.css',
  '../node_modules/react-bootstrap-typeahead/css/Typeahead.css',
  '../node_modules/@fortawesome/fontawesome-free/js/all.js',
  '../node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  ['../node_modules/bootstrap-switch-button-react/src/style.css', 'switch-button-style.css']
];

assets.forEach((asset_path) => {
  let verified_path = asset_path;
  let filename = "";
  if(Array.isArray(asset_path))
  {
    filename = asset_path[1];
    verified_path = asset_path[0];
  } else
  {
    filename = path.basename(asset_path);
  }

  fs.createReadStream(path.resolve(__dirname, verified_path)).pipe(
    fs.createWriteStream(path.resolve(__dirname, output_dir, filename))
  );
});