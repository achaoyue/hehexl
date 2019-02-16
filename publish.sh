#!/bin/bash
if [ ! $1 ]; then
echo "请指定目录"
else
rm -rf /Users/mouwenyao/egret/publish/hehexl/*
cp -r ./bin-release/web/$1/* /Users/mouwenyao/egret/publish/hehexl
cd /Users/mouwenyao/egret/publish/hehexl
zip -r xxx.zip ./*
fi