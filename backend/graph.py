import networkx as nx
from pyvis.network import Network

def build_graph(engr):
    graph_nodes = engr['graph']['nodes']
    graph_edges = engr['graph']['edges']

    # Create constellation-like graph with PyVis
    net = Network(height="800px", width="100%", bgcolor="#222222", font_color="#ffffff", directed=False)

    # Add nodes with constellation styling
    for node in graph_nodes:
        # Small, glowing nodes (white/yellow); scale size by count
        size = 5 + node["count"] * 2  # Adjust size based on frequency
        net.add_node(
            node["id"],
            label=node["id"],
            title=f"Count: {node['count']}",  # Hover tooltip
            size=size,
            color="#ffff100",  # Yellowish for starry effect
            borderWidth=0,    # No border for cleaner look
            shape="dot"       # Circular nodes
        )

    # Add edges with low opacity
    for edge in graph_edges:
        net.add_edge(
            edge["source"],
            edge["target"],
            value=edge["weight"],  # Edge thickness based on weight
            color={"color": "#ffffff", "opacity": 0.2},  # Faint white edges
            title=f"Co-occurrences: {edge['weight']}"    # Hover tooltip
        )

    # Configure static layout (no physics after initial layout)
    net.set_options("""
    var options = {
    "nodes": {
        "font": {
        "size": 12,
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
    net.show("data/entity_constellation.html",notebook=False)