import execa from 'execa'
import consola from 'consola'

execa.sync('yarn', ['build'], { stdio: 'inherit' })

execa.sync('yarn', ['publish', '--access', 'public'], {
  stdio: 'inherit',
  cwd: 'dist'
})

consola.success('Published u-draw-poster')
