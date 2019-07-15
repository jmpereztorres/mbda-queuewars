import api
import pandas as pd
import json
from kafka import KafkaConsumer

# CONSUMER
# Goals: read from queue, confirm when sum = 1
# Decide:
# - 1 or N topics
# - 1 or N partitions per topic
# - Consumer groups?


def main():
    # TODO Check sum equals 1, then send the whole block
    # Each block might have variable number of chunks
    # To confirm block, use api.confirm

    # auto_offset_reset='latest',
                             # group_id="work-queue"
    consumer = KafkaConsumer('foo2',
                             enable_auto_commit=False,
                             auto_offset_reset='earliest',
                             value_deserializer=lambda m:
                                 m.decode('utf-8'),
                             bootstrap_servers='localhost:9092')
    list = {}

    for message in consumer:
        splitted = message.value.split(',')

        parent = splitted[1]
        id = splitted[0]
        weight = splitted[2]

        if parent in list:
            if(id not in list[parent]['ids']):
                print('parent located: ' + parent)
                print('current weight: ' +
                      str(list[parent]['weight'] + float(weight)))
                list[parent] = {
                    'weight': list[parent]['weight'] + float(weight),
                    'ids': list[parent]['ids']+','+str(id)
                }
        else:
            print('parent not found: ' + parent)
            print('current weight: ' + weight)
            list[parent] = {
                'weight': float(weight),
                'ids': str(id)
            }

        if(list[parent]['weight'] >= 1):
            ids = list[parnet]['ids'].split(',')

            print('publishing parent ' + parent + 'composed by ' + ids)
            statusCode = api.confirm(parent, ids)

            if statusCode == 200:
                print("Confirmed block",  list[parent])
            else:
                print("Block",  list[parent], "was not valid")


if __name__ == '__main__':
    main()
