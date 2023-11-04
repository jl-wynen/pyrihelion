"""High-level wrappers for the Gangleri engine."""

import importlib.metadata

try:
    __version__ = importlib.metadata.version(__package__ or __name__)
except importlib.metadata.PackageNotFoundError:
    __version__ = "0.0.0"

from ._engine import clear, init
from ._entity import Box, Sphere
from ._vector import Vector3

__all__ = ["Box", "Sphere", "Vector3", "clear", "init"]
