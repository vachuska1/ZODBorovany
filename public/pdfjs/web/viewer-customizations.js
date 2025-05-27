// Hide the download button in the toolbar
const downloadButton = document.getElementById('download');
if (downloadButton) downloadButton.style.display = 'none';

// Hide the secondary toolbar
const secondaryToolbar = document.getElementById('secondaryToolbar');
if (secondaryToolbar) secondaryToolbar.style.display = 'none';

// Hide the toolbar
const toolbar = document.getElementById('toolbarViewer');
if (toolbar) toolbar.style.display = 'none';

// Adjust the viewer container to take full height
const viewerContainer = document.getElementById('viewerContainer');
if (viewerContainer) {
  viewerContainer.style.top = '0';
  viewerContainer.style.position = 'absolute';
}

// Adjust the viewer
const viewer = document.getElementById('viewer');
if (viewer) {
  viewer.style.marginTop = '0';
}

// Hide the findbar
const findbar = document.getElementById('findbar');
if (findbar) findbar.style.display = 'none';
