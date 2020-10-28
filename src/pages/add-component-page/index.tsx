import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/button'
import { InputField } from '../../components/input-field'
import { TextBox } from '../../components/text-box'
import { Title } from '../../components/title'

import styles from './AddComponentPage.module.css'

export const AddComponentPage: FC = () => {
  const { equipmentGroup } = useParams<{ equipmentGroup: string }>()

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title title={`New ${equipmentGroup} component`} />
      </div>

      <div className={styles.description}>
        <TextBox title={'Description'} edit={true} />
      </div>
      <div className={styles.inputfields}>
        <InputField
          variant={'standard'}
          label="Component name"
          placeholder="Chose a component name"
        />
        <InputField
          variant={'standard'}
          label="Date of revision"
          placeholder="dd.mm.yyyy"
        />
        <InputField
          variant={'standard'}
          label="Remarks"
          placeholder="Add a remark"
        />
        <InputField
          variant={'standard'}
          label="Component name"
          placeholder="Chose a component name"
        />
      </div>
      <div className={styles.definition}>
        <TextBox title="Definition of DU" edit={true} />
      </div>
      <div className={styles.buttons}>
        <Button type="danger" label="Cancel component creation" />
        <Button type="primary" label="Save new component" />
      </div>
    </div>
  )
}
