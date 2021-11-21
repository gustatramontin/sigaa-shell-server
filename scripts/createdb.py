import sqlite3
import os

if os.path.exists("banco.db"):
    os.remove("banco.db")

with open('scripts/create_db.sql') as f:
    sql = f.read()

    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()
    cursor.executescript(sql)
    conn.commit()

    conn.close()
