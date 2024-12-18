#!/bin/bash

PACKAGE_NAME=$(node -p "require('./package.json').name")
YALC_STORE_PATH="$HOME/.yalc/packages/$PACKAGE_NAME"

if [ ! -d "$YALC_STORE_PATH" ]; then
  echo "Package not found in yalc store. Publishing..."
  yalc publish
else
  echo "Package found in yalc store. Pushing updates..."
fi

yalc push
