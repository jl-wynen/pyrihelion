from typing import Any

import gangleri_backend as backend
import js
from pyodide import ffi

from .typing import JSConvertible

_update_queue: list[js.Object] = []


def as_js(obj: JSConvertible | None) -> Any:
    return None if obj is None else obj.__as_js__()


def clear() -> None:
    """Remove all objects from the scene."""
    queue_update({"what": backend.MessageKind.clear})
    update()


def init() -> None:
    """Initialize the engine for the current Python process."""
    _update_queue.clear()
    clear()


def update() -> None:
    """Update the scene by applying queued commands and redrawing."""
    global _update_queue
    backend.update(ffi.to_js(_update_queue, create_pyproxies=False))
    _update_queue = []


def queue_update(message: dict[str, Any]) -> None:
    _update_queue.append(
        js.Object.fromEntries(ffi.to_js(message, create_pyproxies=False))
    )


def queue_create(
    id_: int,
    pos: JSConvertible,
    geometry: str,
    geometry_params: Any,
    material: str,
    material_params: Any,
) -> None:
    queue_update(
        {
            "what": backend.MessageKind.create,
            "id": id_,
            "pos": as_js(pos),
            "geometry": geometry,
            "geometry_params": geometry_params,
            "material": material,
            "material_params": material_params,
        }
    )


def queue_destroy(id_: int) -> None:
    queue_update({"what": backend.MessageKind.destroy, "id": id_})


def queue_move_to(id_: int, pos: JSConvertible) -> None:
    queue_update({"what": backend.MessageKind.moveTo, "id": id_, "pos": as_js(pos)})


def queue_line_segments(id_: int, op: str, pos: JSConvertible | None) -> None:
    queue_update(
        {
            "what": backend.MessageKind.lineSegments,
            "id": id_,
            "op": op,
            "pos": as_js(pos),
        }
    )
