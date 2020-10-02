import React, { useState } from 'react'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { TextBox } from '../../components/text-box'
import { InputField } from '../../components/input-field'
import { Filter } from '../../components/filter'

export interface BrowseComponentPageProps {
  component: string //this comes from the parentpage in somehow or from userinput by homepage-search
  equipmentgroup: string // this should also come from above
  getComponents: (equipmentGroup: string) => Array<string>
  getFilters: (component: string) => Array<string>
  getValuesForFilter: (filter: string) => Array<string>
  getDescription: (component: string) => string
  getDateOfRevision: (component: string) => string
  getRemarks: (component: string) => string
  getRecommendedValues: (component: string) => string
  getDefinitionDU: (component: string) => string
  getFailureData: (component: string) => Array<string>
  onChange: (value: string) => void //This is only temporary
}

export interface Form {
  filters: [{ filter: string; value: string | number | React.ReactText }]
}

export const BrowseComponentPage: React.FC<BrowseComponentPageProps> = ({
  component,
  equipmentgroup,
  getComponents,
  getFilters,
  getValuesForFilter,
  getDescription,
  onChange,
  getDefinitionDU,
}: BrowseComponentPageProps) => {
  const [compState, setComp] = useState<string>(component)
  const [filterState, setFilter] = useState<Form>({
    filters: [{ filter: 'Component', value: compState }],
  })
  return (
    <div>
      <div>{'/Choose equipmentgroup /Fire detectors'}</div>
      <div className={styles.filters}>
        {
          //filters - use getFilters and for each filter return a
          // FilterComponent - use map inside each of these to return
          // variable amount of filterValues comming from getFilterValues
          // think i need a isChecked var to set/unset the filter
        }
        <Filter
          category="Component"
          filters={getComponents(equipmentgroup)}
          onClick={(newcomp) => setComp(newcomp)}
        />
        {getFilters(compState).map((filter) => (
          <Filter
            category={filter}
            filters={getValuesForFilter(filter)}
            onClick={(selected) =>
              setFilter({
                ...filterState.filters,
                filter: filter,
                value: selected,
              })
            }
            key={filter}
          />
        ))}
      </div>
      <div className={styles.container}>
        <Title title={compState} />
        <div className={styles.description}>
          <TextBox
            title="Description"
            content={getDescription(compState)}
            size="small"
          />
        </div>
        <InputField
          type="text"
          variant="standard"
          label="Date of revision"
          onValueChanged={(value) => onChange(value as string)} // This is wrong
        />
        <InputField
          type="text"
          variant="standard"
          label="Remarks"
          onValueChanged={(value) => onChange(value as string)} // This is wrong
        />
        <InputField
          type="text"
          variant="standard"
          label="Recommended values for calculation"
          onValueChanged={(value) => onChange(value as string)} // This is wrong
        />
        <Title title="Failure data" />
        <TextBox
          title="Definition of DU"
          content={getDefinitionDU(compState)}
          size="large"
        />
      </div>
    </div>
  )
}
