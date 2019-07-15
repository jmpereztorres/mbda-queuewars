SERVER_DIR=server
COMMIT_ID=$(shell git log --pretty=format:'%h' -n 1)
SERVER_PKG=server-$(COMMIT_ID).tgz
GRIDFILE=./$(SERVER_DIR)/data/grid.json
UI_DIR=frontend
UI_BUILD=$(UI_DIR)/build
STARTER_PKG=starter.tgz

.PHONY: all
all: check $(UI_BUILD) package-server

.PHONY: clean
clean: package-clean
	rm -rf $(GRIDFILE)*
	rm -rf $(SERVER_DIR)/node_modules
	rm -rf $(UI_DIR)/node_modules
	rm -rf $(UI_BUILD)
	rm -rf $(SERVER_PKG)*

$(GRIDFILE):
	python3 generate.py

$(SERVER_DIR)/node_modules:
	cd $(SERVER_DIR); yarn

.PHONY: check
check: $(GRIDFILE) $(SERVER_DIR)/node_modules
	cd server/src && node check.js

$(UI_DIR)/node_modules:
	cd $(UI_DIR); yarn

$(UI_BUILD): $(UI_DIR)/node_modules
	cd $(UI_DIR); yarn build

.PHONY: frontend
frontend: $(UI_BUILD)

$(SERVER_PKG): $(UI_BUILD) $(GRIDFILE)
	tar -zcvf $(SERVER_PKG) -h --exclude node_modules $(SERVER_DIR)

$(STARTER_PKG):
	tar cvfz starter.tgz api.py config.py demo.py consumer.py producer.py requirements.txt

.PHONY: package-server
package-server: $(SERVER_PKG) $(STARTER_PKG)

.PHONY: package-clean
.package-clean:
	rm -rf *.tgz

.PHONY: push-packages
push-packages: package-server
	scp $(SERVER_PKG) root@queuewars.luisbelloch.es:~/
	scp $(STARTER_PKG) root@queuewars.luisbelloch.es:~/server/public/

.PHONY: release
release: package-clean push-packages
	ssh root@queuewars.luisbelloch.es tar xvfz $(SERVER_PKG)

.PHONY: patch
patch:
	rsync -avzh $(SERVER_DIR)/src root@queuewars.luisbelloch.es:~/server/src

include kafka.mk
