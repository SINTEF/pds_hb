import React from 'react'
import PropTypes from 'prop-types'

import styles from './RegisteredDataField.module.css'

RegisteredDataField.propTypes = {
  children: PropTypes.node,
}

export const RegisteredDataField: React.FC = ({ children }) => {
  return (
    <div className={styles.container}>
      {children.map((d, key) => (
        <td key={key}>{d}</td>
      ))}
    </div>
  )
}
