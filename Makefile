run-lect:
	./scripts/run-lect.sh

publish:
	git pull --rebase
	make clean-lib
	make test
	make clone-license

republish:
	./scripts/republish.sh

add1:
	./scripts/add1.sh

remove1:
	./scripts/remove1.sh

build-test:
	./scripts/build-test.sh
