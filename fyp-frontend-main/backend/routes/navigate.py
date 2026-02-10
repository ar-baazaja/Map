# routes/navigate.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from maps.Maps_campus import CampusNavigator
from pathlib import Path
import math

router = APIRouter()

GRAPH_PATH = Path("maps/campus_graph.json")

# Load campus navigator
nav = CampusNavigator(str(GRAPH_PATH))

# Map building names to nodes (use same as LOCATIONS in Maps_campus)
LOCATIONS = nav.nodes  # Or define a subset mapping building names to node IDs


class NavigateRequest(BaseModel):
    start_node: Optional[str] = None
    destination_node: Optional[str] = None
    start_x: Optional[float] = None
    start_y: Optional[float] = None
    destination_x: Optional[float] = None
    destination_y: Optional[float] = None


def _nearest_node_id(x: float, y: float) -> Optional[str]:
    nearest_id: Optional[str] = None
    best_dist = float("inf")
    for node_id, (nx, ny) in nav.nodes.items():
        d = math.hypot(nx - x, ny - y)
        if d < best_dist:
            best_dist = d
            nearest_id = node_id
    return nearest_id

@router.post("/navigate")
async def navigate(req: NavigateRequest):
    start_node = req.start_node
    destination_node = req.destination_node

    if start_node is None:
        if req.start_x is None or req.start_y is None:
            return JSONResponse(status_code=400, content={"error": "Missing start_node and start_x/start_y"})
        start_node = _nearest_node_id(req.start_x, req.start_y)

    if destination_node is None:
        if req.destination_x is None or req.destination_y is None:
            return JSONResponse(status_code=400, content={"error": "Missing destination_node and destination_x/destination_y"})
        destination_node = _nearest_node_id(req.destination_x, req.destination_y)

    if start_node is None or destination_node is None:
        return JSONResponse(status_code=400, content={"error": "Unable to resolve nearest nodes"})

    if start_node not in nav.nodes or destination_node not in nav.nodes:
        return JSONResponse(status_code=404, content={"error": "Invalid start or destination node"})

    # Get path
    path, status = nav.get_path(start_node, destination_node)
    if path is None:
        return JSONResponse(
            status_code=404,
            content={"error": status}
        )

    # Generate instructions
    instructions = nav.get_readable_instructions(path)

    path_coords = [{"x": float(nav.nodes[n][0]), "y": float(nav.nodes[n][1]), "id": n} for n in path]

    return {
        "path": path,
        "path_coords": path_coords,
        "instructions": instructions,
        "start_node": start_node,
        "destination_node": destination_node,
    }
