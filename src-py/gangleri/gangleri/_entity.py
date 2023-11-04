from typing import Iterable

import gangleri_backend as backend
import js

from ._ffi import dict_to_js_object
from ._registry import generate_id
from ._vector import Vector3


class Entity:
    """Bass class for entities rendered by Gangleri."""

    def __init__(self, pos: Vector3 | Iterable[float]) -> None:
        self._id = generate_id()
        self._pos = Vector3.from_elements(pos, parent_id=self._id, update=False)

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
        backend.create(
            self._id,
            self._pos.__as_js__(),
            "box",
            js.Array.new(*size),
            "basic",
            dict_to_js_object({"color": color}),
        )
