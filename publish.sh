#!/bin/bash
if [ ! $1 ]; then
echo "请指定目录"
else
rm -rf ./bin-release/web/$1/*
cp -r ./bin-release/web/$1/* /Users/mouwenyao/egret/publish/hehexl
fi