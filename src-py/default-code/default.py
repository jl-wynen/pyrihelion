import math
from time import sleep

from gangleri import LineSegments, Sphere, init, update

init()

s = Sphere(pos=[0, 0, 0], radius=0.1, color=0xAA9900)
trace = LineSegments(color=0x887700)

for t in range(1000):
    r = max(abs(math.cos(t * 0.01)), 0.2)
    x = r * math.cos(t * 0.1)
    y = 2 * r * math.sin(t * 0.1)
    s.pos = [x, y, 0]
    trace.add_point(s.pos)
    update()
    sleep(1 / 60)
