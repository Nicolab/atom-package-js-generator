/**
 * Get current pane buffer
 * @return {object|null} atom.workspace.activePaneItem.buffer
 */
module.exports.getCurrentBuffer = function getCurrentBuffer() {

  var buffer = atom.workspace.activePaneItem && atom.workspace.activePaneItem.buffer;

  return buffer || null;
};

/**
 * Get current file
 * @link https://atom.io/docs/api/v0.110.0/api/classes/File.html
 * @return {File|null}
 */
module.exports.getCurrentFile = function getCurrentFile() {

  var buffer = this.getCurrentBuffer();

  if(buffer && buffer.file) {
    return buffer.file;
  }

  return null;
};

/**
 * Get current file path
 * @return {string|null}
 */
module.exports.getCurrentFilePath = function getCurrentFilePath() {

  var file = this.getCurrentFile();

  if(file && file.path) {
    return file.path;
  }

  return null;
};