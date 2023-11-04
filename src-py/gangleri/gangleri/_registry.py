_next_id: int = 0


def generate_id() -> int:
    global _next_id
    id_ = _next_id
    _next_id += 1
    return id_
