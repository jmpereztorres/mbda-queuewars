from random import randint, random

def each_cons(x, size):
  return [x[i:i+size] for i in range(len(x) - size + 1)]

def generate_chunks(divisions):
  yield 0
  for chunk in map(lambda r: random(), range(0, divisions - 1)):
      yield chunk
  yield 1

def divisions(n):
  """Generates a list of N random numbers, where they add up to 1.0"""
  chunks = sorted(generate_chunks(n))
  for pos in each_cons(chunks, 2):
    weight = pos[1] - pos[0]
    yield weight

def main():
  total = 0
  for i,t in enumerate(divisions(5)):
    total = total + t
    print(i,t)
  print("total:", total)

if __name__ == '__main__':
  main()

