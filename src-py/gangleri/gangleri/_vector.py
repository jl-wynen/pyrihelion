from __future__ import annotations

from typing import Iterable

import gangleri_backend as backend
import js


class Vector3:
    """Three-dimensional vector.

    Can be used as the positions of an entity by setting ``parent_id``.
    If so, all updates to the vector move the parent entity.
    """

    def __init__(self, x: float, y: float, z: float, *, parent_id: int | None) -> None:
        self._x = x
        self._y = y
        self._z = z
        self._parent_id = parent_id

    @classmethod
    def from_elements(
        cls,
        elements: Vector3 | Iterable[float],
        *,
        parent_id: int | None = None,
        update: bool = True,
    ) -> Vector3:
        vec = cls(0, 0, 0, parent_id=parent_id)
        vec.assign(elements, update=update)
        return vec

    def assign(
        self, elements: Vector3 | Iterable[float], *, update: bool = True
    ) -> None:
        if isinstance(elements, Vector3):
            self._x, self._y, self._z = elements.x, elements.y, elements.z
        else:
            self._x, self._y, self._z = elements
        if update:
            self._update()

    def detach(self) -> None:
        self._parent_id = None

    @property
    def x(self) -> float:
        return self._x

    @x.setter
    def x(self, x: float) -> None:
        self._x = x
        self._update()

    @property
    def y(self) -> float:
        return self._y

    @y.setter
    def y(self, y: float) -> None:
        self._y = y
        self._update()

    @property
    def z(self) -> float:
        return self._z

    @z.setter
    def z(self, z: float) -> None:
        self._z = z
        self._update()

    @property
    def norm(self) -> float:
        """Return the length of the vector."""
        return (self._x**2 + self._y**2 + self._z**2) ** 0.5

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector3):
            return NotImplemented
        return self._x == other._x and self._y == other._y and self._z == other._z

    def __str__(self) -> str:
        return f"[{self._x}, {self._y}, {self._z}]"

    def __repr__(self) -> str:
        return f"Vector3({self._x}, {self._y}, {self._z}, parent_id={self._parent_id})"

    def __as_js__(self) -> js.Array:
        return js.Array.new(self._x, self._y, self._z)

    def _update(self) -> None:
        if self._parent_id is not None:
            backend.move_to(self._parent_id, self.__as_js__())
