#!/bin/bash

# ./publish design patch (or minor/major)
# ./publish core patch (or minor/major)

echo "Are you sure want to publish?"
read -p "Want to continue? (y): " choice

if [ $choice == "y" ]; then
    cd "./packages/$1"

    # patch: 1.0.0 -> 1.0.1
    # minor: 1.0.1 -> 1.1.0
    # major: 1.1.0 -> 2.0.0
    npm version "$2"

    env -i

    git add -A
    git commit -m "Increment $1 $2 version"
    git push origin $branch

    npm publish

    echo "Done"
else
  echo "Bye"
fi
