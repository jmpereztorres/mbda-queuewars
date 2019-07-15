# USAGE: TOPIC_NAME=messages make create-topic
# By default it would use 'test' as topic name

KAFKA_PKG_URL := http://apache.rediris.es/kafka/2.3.0/kafka_2.12-2.3.0.tgz
KAFKA_PKG := kafka.tgz
KAFKA_HOME := ./kafka
KAFKA_DATA := /tmp/kafka-logs
ZK := --zookeeper localhost:2181
TOPIC_NAME ?= test
BROKER1=localhost:9092

.PHONY: kafka_clean kafka_install

kafka_install: $(KAFKA_HOME)

kafka_clean:
	rm -rf $(KAFKA_PKG) $(KAFKA_HOME)* /tmp/kafka-logs /tmp/zookeeper

$(KAFKA_PKG):
	curl "$(KAFKA_PKG_URL)" -o $(KAFKA_PKG)

$(KAFKA_HOME): $(KAFKA_PKG)
	mkdir -p $(KAFKA_HOME)
	tar xvfz $(KAFKA_PKG)
	mv kafka_2.12-2.3.0/* $(KAFKA_HOME)
	rm -rf kafka_2.12-2.3.0
	echo "\n\ndelete.topic.enable=true" >> $(KAFKA_HOME)/config/server.properties

.PHONY: zookeeper
zookeeper: $(KAFKA_HOME)
	cd $(KAFKA_HOME); bin/zookeeper-server-start.sh config/zookeeper.properties

.PHONY: kafka_start
kafka_start: $(KAFKA_HOME)
	cd $(KAFKA_HOME); bin/kafka-server-start.sh config/server.properties

.PHONY: create-topic list-topics delete-topic describe-topic producer consumer multiple-partitions
create-topic:
	cd $(KAFKA_HOME); \
	bin/kafka-topics.sh $(ZK) --create --replication-factor 1 --partitions 1 --topic $(TOPIC_NAME)

list-topics:
	cd $(KAFKA_HOME); \
	bin/kafka-topics.sh $(ZK) --list

delete-topic:
	cd $(KAFKA_HOME); \
	bin/kafka-topics.sh $(ZK) --delete --topic $(TOPIC_NAME)

describe-topic:
	cd $(KAFKA_HOME); \
	bin/kafka-topics.sh $(ZK) --describe --topic $(TOPIC_NAME)

producer:
	cd $(KAFKA_HOME); \
	bin/kafka-console-producer.sh --broker-list $(BROKER1) --topic $(TOPIC_NAME)

consumer:
	cd $(KAFKA_HOME); \
	bin/kafka-console-consumer.sh --bootstrap-server $(BROKER1) --topic $(TOPIC_NAME) --from-beginning

consumer-group:
	cd $(KAFKA_HOME); \
	bin/kafka-console-consumer.sh --bootstrap-server $(BROKER1) --topic $(TOPIC_NAME) --consumer-property group.id=ZERO

describe-group:
	cd $(KAFKA_HOME); \
	bin/kafka-consumer-groups.sh --bootstrap-server $(BROKER1) --describe --group ZERO

multiple-partitions:
	cd $(KAFKA_HOME); \
	bin/kafka-topics.sh $(ZK) --create --replication-factor 1 --partitions 2 --topic $(TOPIC_NAME)

consumer-partition:
	cd $(KAFKA_HOME); \
	bin/kafka-console-consumer.sh --bootstrap-server $(BROKER1) --topic $(TOPIC_NAME) --from-beginning --partition $(PARTITION)