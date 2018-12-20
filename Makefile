clone-license:
	./scripts/clone-license.sh

publish:
	git pull --rebase
	make clean-lib
	make test
	make clone-license
