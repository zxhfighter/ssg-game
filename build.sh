#!/bin/bash

rm -rf output
mkdir output

cp login.html output
cp index.html output
cp prize.html output
cp ie.html output
cp 404.html output

cp -rf asset output
cp -rf game output
cp -rf user output

cp src/css/common.css output/asset/css/

cd output

html_file="index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="login.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="prize.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/1024/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/bird/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/breakout/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/color/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/pacman/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

html_file="game/snake/index.html"
grep -v "\[__debug__\]" "${html_file}" > "${html_file}.tmp"
cp "${html_file}.tmp" "${html_file}"

rm *.tmp