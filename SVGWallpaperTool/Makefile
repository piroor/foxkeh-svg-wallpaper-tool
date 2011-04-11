SRC_DIR = src
LIB_DIR = lib
BUILD_DIR = ../build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/Wallpaper.js\
	${SRC_DIR}/WallpaperSizeSelectorView.js\
	${SRC_DIR}/WallpaperSizeSelectorController.js\
	${SRC_DIR}/Parts.js\
	${SRC_DIR}/PartsListView.js\
	${SRC_DIR}/PartsListController.js\
	${SRC_DIR}/PartsControllView.js\
	${SRC_DIR}/PartsControllController.js\
	${SRC_DIR}/BackgroundListController.js\
	${SRC_DIR}/DownloadButtonController.js\
	${SRC_DIR}/IndicatorView.js

LIB_FILES = ${LIB_DIR}/SVGDropBox.js\
	${LIB_DIR}/SVGBoundingBox.js\
	${LIB_DIR}/SVGUtil.js

MODULES = ${PREFIX}/COPYRIGHT\
	${BASE_FILES}\
	${LIB_FILES}

SWT = ${DIST_DIR}/SVGWallpaperTool.js
SWT_MIN = ${DIST_DIR}/SVGWallpaperTool.min.js


all: core

core: SVGWallpaperTool min
	@@echo "SVGWallpapaerTool build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

SVGWallpaperTool: ${SWT}

${SWT}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${SWT}

	@@cat ${MODULES} > ${SWT};

min: SVGWallpaperTool ${SWT_MIN}

${SWT_MIN}: ${SWT}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying SVGWallpaperTool" ${SWT_MIN}; \
		${COMPILER} ${SWT} > ${SWT_MIN}; \
	else \
		echo "You must have NodeJS installed in order to minify SVGWallpaperTool."; \
	fi
	
clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all SVGWallpaperTool min clean core
