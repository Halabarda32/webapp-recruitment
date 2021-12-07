import React from 'react'
import { Button } from '@material-ui/core'
import successGif from '@static/gif/successAnimation.gif'
import errorGif from '@static/gif/errorAnimation.gif'
import useStyles from './style'

export type ProgressState = 'progress' | 'approved' | 'success' | 'failed' | 'none'

interface Props {
  content: string
  disabled?: boolean
  progress: ProgressState
  onClick: () => void
}

const AnimatedButton: React.FC<Props> = ({
  content,
  disabled = false,
  progress,
  onClick
}) => {
  const classes = useStyles()

  const getMessage = () => {
    if (progress === 'none') {
      return <p className={classes.buttonContent}>{content}</p>
    }

    if (progress === 'progress' || progress === 'approved') {
      return <p className={classes.buttonContent}>In progress..</p>
    }

    if (progress === 'success') {
      return <img className={classes.gifContent} src={successGif}/>
    }

    return <img className={classes.gifContent} src={errorGif}/>
  }

  const getClasses = () => {
    if (progress === 'progress') {
      return `${classes.button} ${classes.backgroundRelease}`
    }
    if (progress === 'approved') {
      return `${classes.button} ${classes.backgroundApproved}`
    }
    return ''
  }
  return (
    <div>
      <Button
        disabled={disabled}
        variant='contained'
        className={progress === 'progress' || progress === 'approved' ? `${classes.button} ${classes.buttonRelease}` : classes.button}
        onClick={onClick}
      >
        <div className={getClasses()} >
        </div>
        {getMessage()}
      </Button>
    </div>
  )
}

export default AnimatedButton
