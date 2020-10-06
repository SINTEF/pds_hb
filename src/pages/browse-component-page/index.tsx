import React, { useState } from 'react'

import styles from './BrowseComponentPage.module.css'

import { Title } from '../../components/title'
import { TextBox } from '../../components/text-box'
import { EditableField } from '../../components/editable-field'
import { Filter } from '../../components/filter'
import { Table } from '../../components/table'

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
  getHeaders: (component: string) => Array<string>
  getFailureData: (
    component: string,
    filters: Array<Record<string, string>>
  ) => Array<Array<string>>
  onChange: (value: string) => void //This is only temporary
  redirect: () => void
  getUserGroup: () => string
}

export interface Form {
  filters: { filter: string; value: string }[]
}

export const BrowseComponentPage: React.FC<BrowseComponentPageProps> = ({
  component,
  equipmentgroup,
  getComponents,
  getFilters,
  getValuesForFilter,
  getDescription,
  onChange,
  getDateOfRevision,
  getRemarks,
  getRecommendedValues,
  getDefinitionDU,
  getHeaders,
  getFailureData,
  redirect,
  getUserGroup,
}: BrowseComponentPageProps) => {
  const [compState, setComp] = useState<string>(component)
  const [filterState, setFilter] = useState<Form>({
    filters: [{ filter: 'Component', value: compState }],
  })
  return (
    <div>
      <div className={styles.path} onClick={redirect}>
        {'/Choose equipmentgroup /'}
        {equipmentgroup}
      </div>
      <div className={[styles.filters, styles.padding].join(' ')}>
        {
          //filters - use getFilters and for each filter return a
          // FilterComponent
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
                filters: [
                  ...filterState.filters,
                  {
                    filter: filter,
                    value: selected,
                  },
                ],
              })
            }
            key={filter}
          />
        ))}
      </div>
      <div>
        <div className={styles.content}>
          <div className={[styles.padding, styles.center].join(' ')}>
            <Title title={compState} />
          </div>
          <div className={styles.description}>
            <TextBox
              title="Description"
              content={getDescription(compState)}
              size="small"
            />
          </div>
          <EditableField
            index="Date of revision"
            content={getDateOfRevision(compState)}
            mode="view"
            isAdmin={getUserGroup() === 'Admin'}
          />
          <EditableField
            index="Remarks"
            content={getRemarks(compState)}
            mode="view"
            isAdmin={getUserGroup() === 'Admin'}
          />
          <EditableField
            index="Recommended values for calculation"
            content={getRecommendedValues(compState)}
            mode="view"
            isAdmin={getUserGroup() === 'Admin'}
          />
          <div className={styles.padding}>
            <TextBox
              title="Definition of DU"
              content={getDefinitionDU(compState)}
              size="large"
            />
          </div>
          <div className={[styles.center, styles.padding].join(' ')}>
            <Title title="Failure data" />
          </div>
          <Table
            headers={getHeaders(compState)}
            data={getFailureData(compState, filterState.filters)}
            onValueChanged={(value) => onChange(value)}
          />
        </div>
      </div>
    </div>
  )
}
