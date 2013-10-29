test:
	./node_modules/.bin/browserify test/suite.js -t ktbr > test/suite.bundle.js
	./node_modules/.bin/mocha-phantomjs test/runner-cli.html
.PHONY: test