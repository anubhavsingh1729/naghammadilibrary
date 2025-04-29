import React, { useEffect, useState } from "react";
import api from "../api"
import { useLocation } from "react-router-dom";

const GraphViewer = () => {
    const location = useLocation();
    const { state } = location;
    const { book }  = state || {}
    const [iframeUrl, setIframeUrl] = useState("")

    useEffect(() => {
        const fetchGraph = async () => {
            try {
                const response = await api.get("/graph", {params : { book: book }});
                const blob= new Blob([response.data], {type : "text/html"});
                const url = URL.createObjectURL(blob);
                setIframeUrl(url)
            } catch(error) {
                alert(error)
            }
        };

        if (book) {
            fetchGraph();
        }
    },[book]);

  return (
    <iframe
      src={iframeUrl}
      title="Pyvis Graph"
      width="100%"
      height="600px"
      style={{ width: "100vw", height: "100vh", border: "none", 
        position: "absolute", top: 0, left: 0
    }}
    />
  );
}

export default GraphViewer;
