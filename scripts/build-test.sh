#!/bin/bash

cd packages

# Variables
_start=0

# This accounts as the "totalState" variable for the ProgressBar function
_end=$(find . -maxdepth 1 -type d \( ! -name . \) | wc -l)

# echo "END:"
# echo ${_end}

# https://github.com/fearside/ProgressBar/blob/master/progressbar.sh
# Author : Teddy Skarin
# 1. Create ProgressBar function
# 1.1 Input is currentState($1) and totalState($2)
function ProgressBar {
# Process data
  let _progress=(${1}*100/${2}*100)/100
  let _done=(${_progress}*4)/10
  let _left=40-$_done
# Build progressbar string lengths
  _done=$(printf "%${_done}s")
  _left=$(printf "%${_left}s")

# 1.2 Build progressbar strings and print the ProgressBar line
# 1.2.1 Output example:
# 1.2.1.1 Progress : [########################################] 100%
printf "\rProgress : [${_done// /#}${_left// /-}] ${_progress}%%"

}

# ============================
# ============================
# ============================
# ============================
# ============================

#Use set -x if you want to echo each command while getting executed
# set -x

#Save current directory so we can restore it later
cur=$PWD
#Save command line arguments so functions can access it
args=("$@")

#Put your code in this function
#To access command line arguments use syntax ${args[1]} etc
function dir_command {
  cd $1
  npm run test && (echo "All OK." || ( echo "some tests didn't pass!" && exit 1 ))
  cd ..
}

#This loop will go to each immediate child and execute dir_command
find . -maxdepth 1 -type d \( ! -name . \) | while read dir; do
  dir_command "$dir/"
  # echo ${_start} ${_end}
  ProgressBar ${_start} ${_end}
  (( _start++ ))
done

#This example loop only loops through give set of folders
# declare -a dirs=("dir1" "dir2" "dir3")
# for dir in "${dirs[@]}"; do
#     dir_command "$dir/"
# done

#Restore the folder
cd "$cur"

# ███████████████████████████████████████

# # loop
# for number in $(seq ${_start} ${_end})
# do
# 	sleep 0.1
# 	ProgressBar ${number} ${_end}
# done
# printf '\nFinished!\n'
