import React, { useRef } from 'react';

function AutoIframe({ src }) {
  const iframeRef = useRef(null);

  // const handleLoad = () => {
  //   const iframe = iframeRef.current;
  //   if (iframe) {
  //       console.log(iframe)
  //     iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
  //   }
  // };

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      height="500px"
      frameBorder="0"
      //scrolling="no"
      //onLoad={handleLoad}
      title="auto-adjustable-iframe"
    />
  );
}

export default AutoIframe;