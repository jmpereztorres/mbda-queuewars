import json

from itertools import chain
from random import randint, choice, shuffle
from divisions import divisions

OUT_FILE = "server/data/grid.json"
GRID_SIZE = 40 # 40*40 = 1600
MIN_CHUNKS = 2
MAX_CHUNKS = 10

used_identifiers = {}
def identifier():
  identifier = hex(randint(0x111111, 0xFFFFFF))[2:]
  if identifier in used_identifiers:
    return get_identifier()
  return identifier

def generate_chunks(parent):
  for i,d in enumerate(divisions(randint(MIN_CHUNKS, MAX_CHUNKS))):
    yield { "id": identifier(), "parent": parent, "weight": d }

def generate_blocks(n):
  for i in range(0, n):
    yield { "id": i, "chunks": list(generate_chunks(i)) }

def flatten_blocks(blocks):
  return chain.from_iterable(map(lambda b: b["chunks"], blocks))

def generate_grid(n):
  blocks = list(flatten_blocks(generate_blocks(n)))
  shuffle(blocks)
  return blocks

def main():
  print("Generating", OUT_FILE)
  b = generate_grid(GRID_SIZE*GRID_SIZE)
  with open(OUT_FILE, "w") as f:
    json.dump(b, f, indent=True)
  print("Done")

if __name__ == '__main__':
  main()


