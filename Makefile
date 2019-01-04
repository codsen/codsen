clone-license:
	./scripts/clone-license.sh

lect:
	./scripts/run-lect.sh

publish:
	git pull --rebase
	make clean-lib
	make test
	make clone-license
