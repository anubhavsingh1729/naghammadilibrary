from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

import json

from fastapi.responses import FileResponse

from pyvis.network import Network

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session

app = FastAPI()


with open("data/gnostic_chunks.json","r") as f:
    gnostic = json.load(f)

with open("data/entitygraph.json","r") as f:
    graph = json.load(f)

DATABASE_URL = "sqlite:///./llm.db"
engine = create_engine(DATABASE_URL,connect_args = {"check_same_thread":False})
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base = declarative_base()

class TextDB(Base):
    __tablename__ = "textcompare"
    id = Column(Integer, primary_key=True,index=True)
    book = Column(String,unique=True,index=True)
    result = Column(Text)

class LlmDB(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True,index=True)
    book = Column(String,unique=True,index=True)
    tags = Column(Text)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow access from frontend. For production, restrict this to your frontend’s domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/home/")
def home():
    file_list = os.listdir("data/gnostic_texts")
    txt_file = sorted([f.split('.')[0].strip() for f in file_list if f.endswith('.txt')])
    return({"files" : txt_file})

@app.get("/get_text")
def get_book_text(file : str):  
    return {"title":file, "body":gnostic[file]}



@app.get("/tags")
def get_tags(book):
    db: Session = SessionLocal()
    existing = db.query(LlmDB).filter(LlmDB.book==book).first()
    if existing:
        result = existing.tags.split("\n")
        db.close()
        return({"tags":result})
    
# compare gnostic text with bible----------------------
@app.get("/compare")
def compare_bible(book):
    db: Session = SessionLocal()

    existing = db.query(TextDB).filter(TextDB.book == book).first()
    if existing:
        result = existing.result.split('\n\n')
        return({"result":result})
    

@app.get("/graph")
def build_graph(book):
    print(book)
    engr = graph[book]
    graph_nodes = engr['graph']['nodes']
    graph_edges = engr['graph']['edges']

    # Create constellation-like graph with PyVis
    net = Network(height="800px", width="100%", bgcolor="#222222", font_color="#ffffff", directed=False)

    # Add nodes with constellation styling
    for node in graph_nodes:
        size = 5 + node["count"] * 2 
        net.add_node(
            node["id"],
            label=node["id"],
            title=f"Count: {node['count']}",
            size=size,
            color="#FFD700",
            borderWidth=0,  
            shape="dot"    
        )

    # Add edges with low opacity
    for edge in graph_edges:
        net.add_edge(
            edge["source"],
            edge["target"],
            value=edge["weight"], 
            color={"color": "#ffffff", "opacity": 0.4}, 
            title=f"Co-occurrences: {edge['weight']}"  
        )

    # Configure static layout (no physics after initial layout)
    net.set_options("""
    var options = {
    "nodes": {
        "font": {
        "size": 15,
        "color": "#ffffff"
        }
    },
    "edges": {
        "smooth": {
        "type": "continuous"
        }
    },
    "physics": {
        "forceAtlas2Based": {
        "gravitationalConstant": -50,
        "centralGravity": 0.01,
        "springLength": 100,
        "springConstant": 0.08
        },
        "maxVelocity": 50,
        "solver": "forceAtlas2Based",
        "timestep": 0.35
    },
    "interaction": {
        "zoomView": true,
        "dragView": true,
        "hover": true,
        "tooltipDelay": 200,
        "hideEdgesOnZoom": true,
        "hideNodesOnZoom": false
    }
    }
    """)
    # Save the interactive graph
    net.show("data/graph.html",notebook=False)
    return FileResponse("data/graph.html", media_type="text/html")