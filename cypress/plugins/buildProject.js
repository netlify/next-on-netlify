const { join }      = require('path')
const { spawnSync } = require('child_process')

// Build the given NextJS project
const buildProject = ({ project }, config) => {
  process.stdout.write(`Building project: ${project}...`)

  // Build project
  spawnSync('npm', ['run', 'build'], { cwd: join(config.buildsFolder, project) })

  console.log(" Done! ✅")
  return true
}

module.exports = buildProject
