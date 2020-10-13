import React from 'react'
import { Link } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

import styles from './NotFound.module.css'

export const NotFound: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <h1>404</h1>
      <h2>Oups!</h2>
      <p>Looks like we couldn&apos;t find the page you were looking for.</p>
      <p>
        Let&apos;s go back to <Link to={MAIN_ROUTES.HOME}>the front page</Link>!
      </p>
    </div>
  )
}
