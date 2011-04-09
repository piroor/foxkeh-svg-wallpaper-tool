#!/bin/sh

cd `dirname $0`/../

ROOT=`pwd`
BUILD=${ROOT}/build
TMP=${BUILD}/tmp/$$
LIB=${ROOT}/lib
SRC=${ROOT}/src

mkdir -p ${BUILD}/tmp
mkdir $TMP

if [ -d $LIB -a -d $SRC ]; then

	_SWT=${TMP}/SVGWallpaperTool.js
	_SWT_TMP=${_SWT}.tmp
	_SWT_MIN=${TMP}/SVGWallpaperTool-min.js

	#copyright
	cat ${ROOT}/COPYRIGHT > $_SWT
	cat ${ROOT}/COPYRIGHT > $_SWT_MIN
	
	#lib	
	cat ${LIB}/SVGUtil.js >> $_SWT_TMP
	cat ${LIB}/SVGBoundingBox.js >> $_SWT_TMP
	cat ${LIB}/SVGDropBox.js >> $_SWT_TMP

	#src
	FILES="core.js Wallpaper.js Parts.js PartsControllView.js PartsControllController.js PartsListView.js PartsListController.js"
	FILES="${FILES} BackgroundListController.js DownloadButtonController.js IndicatorView.js"
	FILES="${FILES} WallpaperSizeSelectorView.js WallpaperSizeSelectorController.js"
	for FILE in $FILES; do
		ls ${SRC}/${FILE}
		cat ${SRC}/${FILE} >> $_SWT_TMP
	done

	cat $_SWT_TMP >> $_SWT 
	uglifyjs $_SWT_TMP >> $_SWT_MIN 

	mv $_SWT ${ROOT}
	mv $_SWT_MIN ${ROOT}

fi

rm -rf $TMP
