SRC_DIR = src
BUILD_DIR = ../build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe

BASE_FILES = ${SRC_DIR}/core.js\
	   ${SRC_DIR}/display/DisplayObject.js\
	   ${SRC_DIR}/display/DisplayObjectContainer.js\
	   ${SRC_DIR}/display/Sprite.js

MODULES = ${PREFIX}/COPYRIGHT\
	${BASE_FILES}

SS = ${DIST_DIR}/SVGSprite.js
SS_MIN = ${DIST_DIR}/SVGSprite.min.js


all: core

core: SVGSprite min
	@@echo "SVGSprite build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

SVGSprite: ${SS}

${SS}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${SS}

	@@cat ${MODULES} > ${SS};

min: SVGSprite ${SS_MIN}

${SS_MIN}: ${SS}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying SVGSprite" ${SS_MIN}; \
		${COMPILER} ${SS} > ${SS_MIN}; \
	else \
		echo "You must have NodeJS installed in order to minify SVGSprite."; \
	fi
	
clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all SVGSprite min clean core
