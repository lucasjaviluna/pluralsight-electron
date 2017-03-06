navigator.getUserMedia = navigator.webkitGetUserMedia;

const video = require('./video');

function handleSuccess(videoEl, stream) {
  videoEl.src = window.URL.createObjectURL(stream);
}

function handleError(error) {
  console.log('Camera error', error);
}

window.addEventListener('DOMContentLoaded', _ => {
  const videoEl = document.getElementById('video');
  const canvasEl = document.getElementById('canvas');
  const recordEl = document.getElementById('record');
  const photosEl = document.querySelector('.photosContainer');
  const counterEl = document.getElementById('counter');

  video.init(navigator, videoEl);

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        minWidth: 353,
        minHeight: 280,
        maxWidth: 353,
        maxHeight: 280,
      }
    }
  };

  navigator.getUserMedia(constraints, stream => handleSuccess(videoEl, stream), handleError);
});
