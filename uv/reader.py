#!/usr/bin/env python

import time 
import SI1145
from datetime import datetime 

now = datetime.now()
date = now.strftime("%d-%m-%Y")
timelog = now.strftime("%H:%M")

filename = "/data/uv-" + date + ".txt"
filestream = open(filename, 'a')
filestream.write("---\n" + timelog + "\n")

sensor = SI1145.SI1145()

while True:
    print("---")
    IR = sensor.readIR()
    UV = sensor.readUV()

    log = ("IR %.2f | UV %.2f\n" %(IR,UV))
    print(log)
    filestream.write(log)

    time.sleep(60)
