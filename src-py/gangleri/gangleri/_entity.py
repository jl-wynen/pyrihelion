from typing import Iterable

import js

from ._engine import queue_create, queue_destroy, queue_line_segments
from ._ffi import dict_to_js_object
from ._registry import generate_id
from ._vector import Vector3


class Entity:
    """Bass class for entities rendered by Gangleri."""

    def __init__(self, pos: Vector3 | Iterable[float]) -> None:
        self._id = generate_id()
        self._pos = Vector3.from_elements(pos, parent_id=self._id, update=False)

    def remove(self) -> None:
        queue_destroy(self._id)
        self._pos.detach()

    @property
    def pos(self) -> Vector3:
        return self._pos

    @pos.setter
    def pos(self, pos: Vector3 | Iterable[float]) -> None:
        self._pos.assign(pos)


class Box(Entity):
    """A box."""

    def __init__(
        self, *, pos: list[float] | tuple[float], size: Iterable[float], color: str
    ) -> None:
        super().__init__(pos)
        queue_create(
            id_=self._id,
            pos=self._pos,
            geometry="box",
            geometry_params=js.Array.new(*size),
            material="basic",
            material_params=dict_to_js_object({"color": color}),
        )


class Sphere(Entity):
    """A sphere."""

    def __init__(
        self,
        *,
        pos: list[float] | tuple[float],
        radius: float,
        color: str,
        width_segments: int = 32,
        height_segments: int = 32,
    ) -> None:
        super().__init__(pos)
        queue_create(
            id_=self._id,
            pos=self._pos,
            geometry="sphere",
            geometry_params=js.Array.new(radius, width_segments, height_segments),
            material="basic",
            material_params=dict_to_js_object({"color": color}),
        )


class LineSegments(Entity):
    """Line segments."""

    def __init__(self, *, color: int | str = 0xCCCCCC):
        super().__init__([0, 0, 0])
        queue_line_segments(id_=self._id, op="create", color=color, pos=None)

    def add_point(self, pos: Vector3 | Iterable[float]) -> None:
        queue_line_segments(
            id_=self._id,
            op="add",
            color=None,
            pos=Vector3.from_elements(pos, update=False),
        )

    @property
    def pos(self) -> Vector3:
        raise TypeError("LineSegments does not have a unique position.")

    @pos.setter
    def pos(self, pos: Vector3) -> None:
        raise TypeError("LineSegments does not have a unique position.")
