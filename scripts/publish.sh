#!/bin/bash

# this script auto incremenet the patch/minor/major versions
# usage:
# publish {patch|minor|major}
# result:
# patch: 1.0.0 -> 1.0.1
# minor: 1.0.1 -> 1.1.0
# major: 1.1.0 -> 2.0.0

echo "Are you sure want to publish?"
read -p "Want to continue? (y): " choice

if [ $choice == "y" ]; then
    # current branch
    branch=$(git branch | grep \* | cut -d ' ' -f2)

    # bump core version
    cd "./packages/core"
    npm version "$1"

    # bump design version
    cd -
    cd "./packages/design"
    npm version "$1"

    # bump root version
    cd -
    npm version "$1"

    # get the new version that was bumped
    version_raw=$(npm pkg get version) 
    version=$(echo "$version_raw" | tr -d '"')

    # commit the new versions
    git add -A
    git commit -m "Bump $1 version to $version"
    git push origin $branch

    # tag the repo so it deploys
    git tag $version
    git push origin $version
    
    # if we wanted to deploy from here
    # npm run publish

    echo "Done"
else
  echo "Bye"
fi
