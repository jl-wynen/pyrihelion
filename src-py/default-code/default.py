import math
from time import sleep

from gangleri import Sphere, init, update

init()
s = Sphere(pos=[0, 0, 0], radius=1, color="#aa9900")

for t in range(1000):
    r = max(abs(math.cos(t * 0.01)), 0.2)
    x = r * math.cos(t * 0.1)
    y = 2 * r * math.sin(t * 0.1)
    s.pos = [x, y, 0]
    update()
    sleep(1 / 60)
