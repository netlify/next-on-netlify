// Get the NextJS distDir specified in next.config.js
const { pathExistsSync }  = require('fs-extra')
const { resolve, join }   = require('path')

// The default dist dir used by NextJS, if not specified otherwise by user
const DEFAULT_DIST_DIR = join(".", ".next")

const getNextDistDir = ({ nextConfigPath }) => {
  // If next.config.js does not exists, default to NextJS' default distDir
  hasNextConfig = pathExistsSync(nextConfigPath)
  if(!hasNextConfig)
    return DEFAULT_DIST_DIR

  // Read next.config.js
  const resolvedNextConfigPath = resolve(".", nextConfigPath)
  const nextConfig = require(resolvedNextConfigPath)

  // If distDir is not set, default to NextJS' default distDir
  const hasDistDir = 'distDir' in nextConfig
  if(!hasDistDir)
    return DEFAULT_DIST_DIR

  // Return distDir specified by user
  return join(".", nextConfig.distDir)
}


module.exports = getNextDistDir
