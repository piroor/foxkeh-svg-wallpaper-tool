#!/bin/sh

BUILD=`dirname $0`
ROOT=${BUILD}/../

mkdir -p ${BUILD}/tmp

TMP=${BUILD}/tmp/$$
mkdir $TMP

SRC=${ROOT}/src

if [ -d $SRC ]; then

	_SWT=${TMP}/SVGSprite.js
	_SWT_TMP=${_SWT}.tmp
	_SWT_MIN=${TMP}/SVGSprite-min.js

	#copyright
	cat ${ROOT}/COPYRIGHT > $_SWT
	cat ${ROOT}/COPYRIGHT > $_SWT_MIN

	#src
	cat ${SRC}/SVGSprite.js >> $_SWT_TMP

	cat $_SWT_TMP >> $_SWT 
	uglifyjs $_SWT_TMP >> $_SWT_MIN 

	mv $_SWT ${ROOT}
	mv $_SWT_MIN ${ROOT}

fi

rm -rf $TMP
