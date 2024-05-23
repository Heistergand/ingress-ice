#!/bin/bash
# Ingress ICE buildscript

NRML="$(tput sgr0)"
RED="$(tput setaf 1)"
BLUE="$(tput setaf 4)"
GREEN="$(tput setaf 2)"
DIR="`pwd`"
TEMP_DIR="/tmp/ingress-ice"

say_red() {
  echo -e "> $RED$1$NRML"
  exit 1
}

say_blue() {
  echo "> $BLUE$1$NRML"
}

say_green() {
  echo "> $GREEN$1$NRML"
}

quit() {
  echo -e ">$RED Operation cancelled by user.$NRML"
  kill -- -$(ps -o pgid= $pokepid | grep -o '[0-9]*') >/dev/null
  exit 2
}

remove() {
  for i in $@; do
    rm "$i" -rf
    say_green "Deleted $i"
  done
}

trap "quit" 2

[[ -d "$TEMP_DIR" ]] && rm -rf "$TEMP_DIR"
say_blue "Copying everything to a temporary directory..."
mkdir -p "$TEMP_DIR/original"
cp -R * "$TEMP_DIR/original"

say_blue "Removing development-related files..."
cd $TEMP_DIR/original
remove .git .gitattributes .gitignore CONTRIBUTING.md Dockerfile docker-ingress-ice.sh .editorconfig .dockerignore build.sh ingress-ice-* phantom-bin

say_blue "Installing Node.js dependencies..."
npm install

say_blue "Creating directories for different OS..."
for os in linux64; do
  cp -R original "$TEMP_DIR/ingress-ice-$os"
  say_green "Created ingress-ice-$os"
done

say_blue "Cleaning up..."
for os in linux64; do
  if [[ -d "$TEMP_DIR/ingress-ice-$os" ]]; then
    cd "$TEMP_DIR/ingress-ice-$os"
    remove ingress-ice.cmd reconfigure.cmd
    say_green "Cleaned ingress-ice-$os"
  fi
done

say_blue "Archiving Ingress ICE"
for os in linux64; do
  cd "$TEMP_DIR"
  tar czf "ingress-ice-$os.tar.gz" "ingress-ice-$os"
  say_green "Packed ingress-ice-$os"
done

say_blue "Saving your archives..."
mv "$TEMP_DIR"/*.tar.gz $DIR

say_blue "You now have these builds:"
ls -l *.tar.gz

rm -rf "$TEMP_DIR"
