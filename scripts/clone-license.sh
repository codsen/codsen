echo "Cloning LICENSE to all packages"
cat LICENSE
ls -d ./packages/*/ | xargs -n 1 cp LICENSE
