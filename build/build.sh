#!/bin/sh

DIR=`dirname $0`

mkdir -p ${DIR}/tmp

TMP=${DIR}/tmp/SVGWallpaperTool.$$
mkdir $TMP

SWT_SRC=${DIR}/../SVGWallpaperTool/src
SS_SRC=${DIR}/../SVGSprite/src

if [ -d $SWT_SRC ]; then

	_SWT=${TMP}/SVGWallpaperTool.js
	_SWT_MIN=${TMP}/SVGWallpaperTool-min.js

	#copyright
	cat ${DIR}/copyright/SVGWallpaperTool.txt > $_SWT
	cat ${DIR}/copyright/SVGWallpaperTool.txt > $_SWT_MIN
	
	cat ${SWT_SRC}/lib/SVGUtil/loadSVG.js >> $_SWT
	cat ${SWT_SRC}/lib/SVGBBoxTool.js >> $_SWT
	cat ${SWT_SRC}/lib/SVGDropBox.js >> $_SWT
	cat ${SWT_SRC}/SVGWallpaperTool.js >> $_SWT

 	cat $_SWT | jsjuicer -sm >> $_SWT_MIN 

	mv $_SWT ${DIR}/../SVGWallpaperTool/
	mv $_SWT_MIN ${DIR}/../SVGWallpaperTool/

fi

if [ -d $SS_SRC ]; then

	_SS=${TMP}/SVGSprite.js
	_SS_MIN=${TMP}/SVGSprite-min.js

	#copyright
        cat ${DIR}/copyright/SVGSprite.txt > $_SS
        cat ${DIR}/copyright/SVGSprite.txt > $_SS_MIN

	cat ${SS_SRC}/SVGSprite.js >> $_SS

	cat $_SS | jsjuicer -sm >> $_SS_MIN

	mv $_SS ${DIR}/../SVGSprite/
	mv $_SS_MIN ${DIR}/../SVGSprite/


fi

rm -rf $TMP
