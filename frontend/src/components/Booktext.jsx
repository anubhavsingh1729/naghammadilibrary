import { useLocation, useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react"
import "../css/booktext.css"

import api from "../api"

const BookText = () => {

    const location = useLocation();
    const { text, book } = location.state || {};

    // const [buttonPosition,setButtonPosition] = useState(null);
    // const [semanticMatch, setSemanticMatch] = useState([]);
    // const [selectedText, setSelectedText] = useState("");
    const [loading, setLoading] = useState();
    // const [llm, setLlm] = useState([]);
    const [compare, setCompare] = useState([]);
    const [popup, setPopup] = useState(false);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const [query,setQuery] = useState("");
    const [feedback,setFeedback] = useState("");
    const [loadingFeedback, setLoadingFeedback] = useState(false);

    // const handleTextSelection = async () => {
    //     const selection = window.getSelection();
    //     const selectedText = selection.toString();
    //     if (selectedText) {
    //         setLoading(true);
    //         setSemanticMatch([]);
    //         setLlm([]);
    //         // const range = selection.getRangeAt(0);
    //         // const rect = range.getBoundingClientRect(); //position of selected text
    //         // setButtonPosition({ top: rect.top + window.scrollY,left: rect.left + window.scrollX })
    //         setSelectedText(selectedText)
    //         const response = await api.get("/search" , {params : {query : selectedText,book:book}});
    //         const result = response.data.result;
    //         setSemanticMatch(result)
    //         setLlm(response.data.llm)
    //         setLoading(false);
    //     } else {
    //         // setButtonPosition(null);
    //         setSelectedText("");
    //     }
    // };

    // const handleCompare = () => {
    //     const state = { selectedText, semanticMatch };
    //     const stateString = encodeURIComponent(JSON.stringify(state));
    //     window.open(`\compare_text?state=${stateString}`,"_blank");
    //     // navigate("/compare_text", {state : {selectedText,semanticMatch }});
    // };

    const handleCompare = async () => {
        setLoading(true);
        setCompare([]);
        try {
            const response = await api.get("/compare", {params : {gnostic: text, book: book}});
            setCompare(response.data.result);
            setPopup(true);
        } catch(error) {
            alert(error);
        } finally {
            setLoading(false);
        };
    }

    const closePopup = () => {
        setFeedback("");
        setQuery("");
        setPopup(false);
    }

    const handleGraph = () => {
        navigate("/view_graph", {state : { book }});
    }

    const handleTags = async () => {
        setTags([]);
        try {
            const response = await api.get("/tags", {params : {book: book}});
            setTags(response.data.tags)
        } catch(error){
            alert(error)
        }
    }

    useEffect (()=>{
        handleTags();
    },[]);

    return (
        <div className="text-container">

            <div className="left-bar">
                <div className="buttons">
                        <button onClick={handleCompare} disabled={loading} className="button">
                            {loading ? "loading...": "Compare With Bible"}
                        </button>
                        <button onClick={handleGraph} className="button">Entity graph</button>
                </div>
                <span></span>
                {tags && (
                    <div className="tags">
                        {tags.map((tag,i)=> {
                            const cleanedTag = tag.replace(/[^a-zA-Z\s,\\\/:-]/g,"");
                            return cleanedTag.length > 1 ? (
                            <li key={i}>{cleanedTag}</li>
                            ):null;
                        })}
                    </div>
                )}
            </div>

            <div className="book-text">
                <h2>{text.title}</h2>
                {text.body.map((verse,index)=>(
                    <p>{verse}</p>
                ))}
            </div>

            {popup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Comparision with Canonical Scriptures</h2>
                        {compare.map((c,i)=>(
                            <p key={i}>{c}</p>
                        ))}
                            <button onClick={closePopup}>close</button>
                    </div>
                </div>
            )}

            {/* {buttonPosition && (
                <button
                    style={{
                        position:"absolute",
                        top:buttonPosition.top,
                        left:buttonPosition.left,
                        zIndex:1000,
                    }}
                    onClick={handleCompare}
                    >compare</button>
            )} */}
{/* 
            {!selectedText && (
                <div className="placeholder">
                    <h3>Select text to compare with Canonical Scripture</h3>
                </div>
            )}

            {selectedText && (
                <div className="bible-text">
                    <h2>Canonical Texts</h2>
                    {loading && (
                        <div className="placeholder">
                            <h3>Loading...</h3>
                        </div>
                    )}
                    {semanticMatch.map((t,i)=> (
                        <ul>
                            <li key={i}>{`${t[0]}`}</li>
                            <p>{`similarity ${(t[1]*100).toFixed(0)}%`}</p>
                        </ul>
                    ))}
                    {llm.map((l,i)=>(
                        <ul>
                            <li key = {i}>{l}</li>
                        </ul>
                    ))}
                </div>
            )} */}
        </div>
    )
}

export default BookText;