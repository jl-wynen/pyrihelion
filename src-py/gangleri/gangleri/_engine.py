import gangleri_backend as backend


def clear() -> None:
    """Remove all objects from the scene."""
    backend.clear()


def init() -> None:
    """Initialize the engine for the current Python process."""
    backend.clear()


def update() -> None:
    """Update the scene by applying queued commands and redrawing."""
    backend.update()
