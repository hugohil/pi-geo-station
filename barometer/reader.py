#!/usr/bin/env python

import time 
import hp206c
from datetime import datetime 

now = datetime.now()
date = now.strftime("%d-%m-%Y")
timelog = now.strftime("%H:%M")

filename = "/data/barometer-" + date + ".txt"
filestream = open(filename, 'a')
filestream.write("---\n" + timelog + "\n")

h= hp206c.hp206c()
ret=h.isAvailable()

if h.OK_HP20X_DEV == ret:
    print("HP20x_dev is available.")
else:
    print("HP20x_dev isn't available.")

while True:
    print("---")
    
    temp=h.ReadTemperature()
    pressure=h.ReadPressure()
    altitude=h.ReadAltitude()
    
    log = ("T %.2f C | P %.2f hPa | A %.2f m\n" %(temp,pressure,altitude))
    print(log)
    filestream.write(log)

    time.sleep(60)
