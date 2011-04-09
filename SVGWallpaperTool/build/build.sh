#!/bin/sh

BUILD=`dirname $0`
ROOT=${BUILD}/../

mkdir -p ${BUILD}/tmp

TMP=${BUILD}/tmp/$$
mkdir $TMP

LIB=${ROOT}/lib
SRC=${ROOT}/src

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
	cat ${SRC}/SVGWallpaperTool.js >> $_SWT_TMP

	cat $_SWT_TMP >> $_SWT 
	uglifyjs $_SWT_TMP >> $_SWT_MIN 

	mv $_SWT ${ROOT}
	mv $_SWT_MIN ${ROOT}

fi

rm -rf $TMP
