exports.init = (nav, videoEl) => {
  function handleSuccess(videoEl, stream) {
    videoEl.src = window.URL.createObjectURL(stream);
  }

  function handleError(error) {
    console.log('Camera error', error);
  }
  
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

  nav.getUserMedia = nav.webkitGetUserMedia;
  nav.getUserMedia(constraints, stream => handleSuccess(videoEl, stream), handleError);
}
