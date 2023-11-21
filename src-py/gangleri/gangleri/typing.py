"""Helpers for static typing."""

from typing import Any, Protocol


class JSConvertible(Protocol):
    """An object that can be converted to a JavaScript object."""

    def __as_js__(self) -> Any:
        """Convert self to a JavaScript object."""
