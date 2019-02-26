/**
 * Downloads the contents of the course.
 *
 * Args:
 *  file_name (REQUIRED | str)
 *  text (REQUIRED | str)
 *
 * Returns: none
 */
function download(file_name, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', file_name);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Checks if the browser supports file uploads.
 *
 * Args: none
 *
 * Returns: compatible (bool)
 */
function browser_supports_file_upload() {
  var compatible = false;
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    compatible = true;
  }
  return compatible;
}