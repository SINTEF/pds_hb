import React, { useEffect, useState } from 'react'
import styles from './AllEditsPage.module.css'
import { Title } from '../../components/title'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch, { CachePolicies } from 'use-http'
import { IUser } from '../../models/user'
import { APIResponse } from '../../models/api-response'
import { IDataInstance } from '../../models/datainstance'
import { Button } from '../../components/button'
import { SUB_ROUTES } from '../../routes/routes.constants'
import { useHistory, useRouteMatch } from 'react-router-dom'

interface IClicked {
  notReviewed: string
  approved: string
  notApproved: string
}

export const AllEditsPage: React.FC = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [clickState, setClick] = useState<IClicked>({
    notReviewed: 'clicked',
    approved: 'notClicked',
    notApproved: 'notClicked',
  })
  const [pageState, setPage] = useState<string>('Not Reviewed')
  const [notReviewedState, setNotReviewed] = useState<IDataInstance[]>([])
  const [approvedState, setApproved] = useState<IDataInstance[]>([])
  const [notApprovedState, setNotApproved] = useState<IDataInstance[]>([])
  const {
    del: editsDel,
    get: editsGet,
    response: editsResponse,
    put: editsPut,
  } = useFetch<APIResponse<IUser[]>>('/data-instances', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    getNotReviewed()
    getApproved()
    getNotApproved()
  }, [])

  const getNotReviewed = async () => {
    const edits = await editsGet('/?status=not+reviewed')
    if (editsResponse.ok) {
      const notReviewed = edits.data
      setNotReviewed(notReviewed ?? [])
    }
  }

  const getApproved = async () => {
    const edits = await editsGet('/?status=approved')
    if (editsResponse.ok) {
      const approved = edits.data
      setApproved(approved ?? [])
    }
  }

  const getNotApproved = async () => {
    const edits = await editsGet('/?status=not+approved')
    if (editsResponse.ok) {
      const notApproved = edits.data
      setNotApproved(notApproved ?? [])
    }
  }

  const approveEdit = async (datainstanceid: string) => {
    const approved = { status: 'approved' }
    await editsPut('/' + datainstanceid, approved)
    await getNotReviewed()
    await getApproved()
    await getNotApproved()
    if (editsResponse.ok) getNotApproved() // Er denne nødvendig?
  }

  const disApproveEdit = async (datainstanceid: string) => {
    const disapproved = { status: 'not approved' }
    await editsPut('/' + datainstanceid, disapproved)
    await getNotReviewed()
    await getApproved()
    await getNotApproved()
  }

  const releaseNewEdition = async () => {
    // må denne være async?
    const publish = { status: 'published' }
    approvedState.forEach(async (edit) => {
      await editsPut('/' + edit._id, publish)
    })
    // dette skal nok ikke skje
    notApprovedState.forEach(async (edit) => {
      await editsDel('/' + edit._id)
    })
    await getNotReviewed()
    await getApproved()
    await getNotApproved()
  }

  const possibleRelease = () => {
    return notReviewedState.length > 0 || approvedState.length > 0
  }

  const approvedEditsExists = () => {
    return approvedState.length > 0
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Title title="See all edits for next release" />
        </div>
        <div className={styles.tabs}>
          <div
            className={styles[clickState.notReviewed]}
            onClick={() => {
              setPage('Not Reviewed')
              setClick({
                notReviewed: 'clicked',
                approved: 'notClicked',
                notApproved: 'notClicked',
              })
            }}
          >
            {'Not Reviewed'}
          </div>
          <div
            className={styles[clickState.approved]}
            onClick={() => {
              setPage('Approved')
              setClick({
                notReviewed: 'notClicked',
                approved: 'clicked',
                notApproved: 'notClicked',
              })
            }}
          >
            {'Approved'}
          </div>
          <div
            className={styles[clickState.notApproved]}
            onClick={() => {
              setPage('Not Approved')
              setClick({
                notReviewed: 'notClicked',
                approved: 'notClicked',
                notApproved: 'clicked',
              })
            }}
          >
            {'Not Approved'}
          </div>
        </div>
      </div>
      <hr />
      {pageState === 'Not Reviewed' &&
        (possibleRelease() ? (
          <>
            {notReviewedState.length > 0 && (
              <div className={styles.table}>
                <div>
                  <table className={styles.headers}>
                    <tbody>
                      <tr>
                        <td>{'Component'}</td>
                        <td>{'Company'}</td>
                        <td>{'Comment'}</td>
                        <td>{'Failure Rate'}</td>
                        <td>{'SINTEF comment'}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {notReviewedState &&
              notReviewedState?.map(
                (
                  edit,
                  idx // type any?
                ) =>
                  (
                    <RegisteredDataField key={idx}>
                      {[
                        <div className={styles.datainstances} key={idx}>
                          {edit.component}
                        </div>,
                        <div className={styles.datainstances} key={idx}>
                          {edit.company}
                        </div>,
                        <div className={styles.datainstances} key={idx}>
                          {edit.comment}
                        </div>,
                        <div className={styles.datainstances} key={idx}>
                          {edit.failureRates}
                        </div>,
                        <div
                          onClick={() =>
                            history.push(
                              url +
                                SUB_ROUTES.UPDATE.replace(
                                  ':datainstanceId',
                                  edit._id
                                )
                            )
                          }
                          className={[styles.datainstances, styles.edit].join(
                            ' '
                          )}
                          key={idx}
                        >
                          {edit.sintefComment}
                        </div>,
                        <div
                          className={styles.approve}
                          onClick={() => {
                            approveEdit(edit._id)
                          }}
                          key={idx}
                        >
                          {'Approve'}
                        </div>,
                        <div
                          className={styles.remove}
                          onClick={() => {
                            disApproveEdit(edit._id)
                          }}
                          key={idx}
                        >
                          {'Disapprove'}
                        </div>,
                      ]}
                    </RegisteredDataField>
                  ) ?? []
              )}
            {notReviewedState.length > 0 ? (
              <div className={styles.centerInfo}>
                {'Please complete the review before publishing a new edition.'}
              </div>
            ) : (
              <div className={styles.centerInfo}>
                <div>
                  {'There are approved updates ready for the new edition!'}
                </div>
                <div>
                  {
                    'By clicking "Publish" all approved edits will be published.'
                  }
                </div>
                <Button
                  label="Publish release"
                  onClick={() => releaseNewEdition()}
                />
              </div>
            )}
          </>
        ) : (
          <div className={styles.centerInfo}>
            {
              "Seems like the PDS users don't experience any failures these days!"
            }
          </div>
        ))}
      {pageState === 'Approved' &&
        (possibleRelease() ? (
          approvedEditsExists() ? (
            <>
              <div className={styles.table}>
                <div>
                  <table className={styles.headers}>
                    <tbody>
                      <tr>
                        <td>{'Component'}</td>
                        <td>{'Company'}</td>
                        <td>{'Comment'}</td>
                        <td>{'Failure Rate'}</td>
                        <td>{'SINTEF comment'}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {approvedState &&
                approvedState?.map(
                  (
                    edit,
                    idx // type any?
                  ) =>
                    (
                      <RegisteredDataField key={idx}>
                        {[
                          <div className={styles.datainstances} key={idx}>
                            {edit.component}
                          </div>,
                          <div className={styles.datainstances} key={idx}>
                            {edit.company}
                          </div>,
                          <div className={styles.datainstances} key={idx}>
                            {edit.comment}
                          </div>,
                          <div className={styles.datainstances} key={idx}>
                            {edit.failureRates}
                          </div>,
                          <div
                            onClick={() =>
                              history.push(
                                url +
                                  SUB_ROUTES.UPDATE.replace(
                                    ':datainstanceId',
                                    edit._id
                                  )
                              )
                            }
                            className={[styles.datainstances, styles.edit].join(
                              ' '
                            )}
                            key={idx}
                          >
                            {edit.sintefComment}
                          </div>,
                          <div key={idx}>{}</div>,
                          <div
                            className={styles.remove}
                            onClick={() => {
                              disApproveEdit(edit._id)
                            }}
                            key={idx}
                          >
                            {'Disapprove'}
                          </div>,
                        ]}
                      </RegisteredDataField>
                    ) ?? []
                )}
            </>
          ) : (
            <div className={styles.centerInfo}>
              {'There are no approved edits at the moment...'}
            </div>
          )
        ) : (
          <div className={styles.centerInfo}>
            {
              "Seems like the PDS users don't experience any failures these days!"
            }
          </div>
        ))}
      {pageState === 'Not Approved' && (
        <>
          <div className={styles.table}>
            <div>
              <table className={styles.headers}>
                <tbody>
                  <tr>
                    <td>{'Component'}</td>
                    <td>{'Company'}</td>
                    <td>{'Comment'}</td>
                    <td>{'Failure Rate'}</td>
                    <td>{'SINTEF comment'}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {notApprovedState &&
            notApprovedState?.map(
              (
                edit,
                idx // type any?
              ) =>
                (
                  <RegisteredDataField key={idx}>
                    {[
                      <div className={styles.datainstances} key={idx}>
                        {edit.component}
                      </div>,
                      <div className={styles.datainstances} key={idx}>
                        {edit.company}
                      </div>,
                      <div className={styles.datainstances} key={idx}>
                        {edit.comment}
                      </div>,
                      <div className={styles.datainstances} key={idx}>
                        {edit.failureRates}
                      </div>,
                      <div
                        onClick={() =>
                          history.push(
                            url +
                              SUB_ROUTES.UPDATE.replace(
                                ':datainstanceId',
                                edit._id
                              )
                          )
                        }
                        className={[styles.datainstances, styles.edit].join(
                          ' '
                        )}
                        key={idx}
                      >
                        {edit.sintefComment}
                      </div>,
                      <div
                        className={styles.approve}
                        onClick={() => {
                          approveEdit(edit._id)
                        }}
                        key={idx}
                      >
                        {'Approve'}
                      </div>,
                      <div key={idx}>{}</div>,
                    ]}
                  </RegisteredDataField>
                ) ?? []
            )}
        </>
      )}
    </div>
  )
}
