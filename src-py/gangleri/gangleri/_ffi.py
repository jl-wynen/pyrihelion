from typing import Any

import js
from pyodide.ffi import to_js


def dict_to_js_object(x: dict[Any, Any]) -> object:
    return to_js(
        x,
        dict_converter=js.Object.fromEntries,
        create_pyproxies=False,
    )
