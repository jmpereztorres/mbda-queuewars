import json
import api

from kafka import KafkaProducer

# PRODUCER
# Goals: read N chunks, publish them on queue
# Decide:
# - 1 or N topics
# - 1 or N partitions per topic
# - Consumer groups?


def main():
    producer = KafkaProducer(bootstrap_servers='localhost:9092')
    chunks = api.fetch()
    for chunk in chunks:
        message = (chunk['id'] + ',' +
                   str(chunk['parent']) + ',' +
                   str(chunk['weight'])).encode('utf-8')
        producer.send('foo2', message)
        print("Publishing message as comma-separated line" + message)


if __name__ == '__main__':
    main()
