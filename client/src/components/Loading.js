import React from 'react';
import ReactLoading from "react-loading";

function Loading() {
  return (
    <div className="loader flex items-center justify-center h-screen">
      <ReactLoading type="spin" color="#0000FF"
              height={100} width={50} />
    </div>
  )
}

export default Loading
