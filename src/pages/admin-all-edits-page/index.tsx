import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from './AllEditsPage.module.css'
import { Title } from '../../components/title'
import { RegisteredDataField } from '../../components/registered-data-field'
import useFetch, { CachePolicies } from 'use-http'
import { IUserContext } from '../../models/user'
import { APIResponse } from '../../models/api-response'
import { INotification } from '../../models/notification'
import { Button } from '../../components/button'
import Loader from 'react-loader-spinner'
import { ViewLongText } from '../../components/view-long-text'
import { UserContext } from '../../utils/context/userContext'
import { CommentSection } from '../../components/comment-section'
import { IComment } from '../../models/comment'
import { EditableField } from '../../components/editable-field'
import { InputField } from '../../components/input-field'
import { IInventoryInstance } from '../../models/inventoryinstance'
import { IDataInstance } from '../../models/datainstance'
import { IPeriod } from '../../models/period'
import { Table } from '../../components/table'
import { useHistory } from 'react-router-dom'
import MAIN_ROUTES from '../../routes/routes.constants'

interface IClicked {
  notReviewed: string
  approved: string
  notApproved: string
  publish: string
  active: string
}
export interface Form {
  company: string | undefined
  facility: string | undefined
  component: string | undefined
  startDate: Date
  endDate: Date
  du: number | undefined
  populationSize: number | undefined
  failureRate: number | undefined
  T: number | undefined
  status: string
}

export const AllEditsPage: React.FC = () => {
  const history = useHistory()
  const userContext = useContext(UserContext) as IUserContext
  const [clickState, setClick] = useState<IClicked>({
    notReviewed: 'clicked',
    approved: 'notClicked',
    notApproved: 'notClicked',
    publish: 'notClicked',
    active: 'notClicked',
  })
  const [pageState, setPage] = useState<string>('Not Reviewed')
  const [open, setOpen] = useState<boolean>(false)
  const [selectedNotificationNumber, setSelectedNotificationNumber] = useState<
    string
  >()
  const [notReviewedState, setNotReviewed] = useState<INotification[]>([])
  const [approvedState, setApproved] = useState<INotification[]>([])
  const [notApprovedState, setNotApproved] = useState<INotification[]>([])
  const [publishedState, setPublished] = useState<INotification[]>([])
  const [viewComment, setViewComment] = useState<boolean>(false)
  const [close, setClose] = useState<boolean>(true)
  const [comments, setComments] = useState<IComment[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [dataInstances, setDataInstances] = useState<IDataInstance[]>([])
  const [inventory, setInventory] = useState<IInventoryInstance[]>([])
  const [periods, setPeriods] = useState<IPeriod[]>([])
  const [external, setExternal] = useState<IDataInstance[]>([])

  const headers = [
    'Source',
    'DU',
    'T',
    'Observation start',
    'Observation end',
    'Population size',
    'Failure rate',
  ]

  const {
    get: notificationGet,
    response: notificationResponse,
    loading: notificationLoad,
    put: notificationPut,
  } = useFetch<APIResponse<INotification>>('/notifications', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const getNotReviewed = useCallback(async () => {
    const notification = await notificationGet(
      '/?status=not+reviewed&failureType=DU'
    )
    if (notificationResponse.ok) {
      const notReviewed = notification.data
      setNotReviewed(notReviewed ?? [])
    }
  }, [notificationGet, notificationResponse.ok, setNotReviewed])

  const getApproved = useCallback(async () => {
    const notification = await notificationGet(
      '/?status=approved&failureType=DU'
    )
    if (notificationResponse.ok) {
      const approved = notification.data
      setApproved(approved ?? [])
    }
  }, [notificationGet, notificationResponse.ok, setApproved])

  const getNotApproved = useCallback(async () => {
    const notification = await notificationGet(
      '/?status=not+approved&failureType=DU'
    )
    if (notificationResponse.ok) {
      const notApproved = notification.data
      setNotApproved(notApproved ?? [])
    }
  }, [notificationGet, notificationResponse, setNotApproved])

  const getPublished = useCallback(async () => {
    const notification = await notificationGet(
      '/?status=published&failureType=DU'
    )
    if (notificationResponse.ok) {
      const published = notification.data
      setPublished(published ?? [])
    }
  }, [notificationGet, notificationResponse, setNotApproved])

  useEffect(() => {
    getNotReviewed()
    getApproved()
    getNotApproved()
    getPublished()
  }, [getNotReviewed, getApproved, getNotApproved, getPublished])

  const {
    get: inventoryInstanceGet,
    response: inventoryInstanceResponse,
  } = useFetch<APIResponse<IInventoryInstance>>(
    '/inventoryInstances',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    }
  )

  useEffect(() => {
    const getInventory = async () => {
      const inventoryData: APIResponse<
        IInventoryInstance[]
      > = await inventoryInstanceGet()
      if (inventoryInstanceResponse.ok) {
        setInventory(inventoryData.data)
      }
    }
    getInventory()
  }, [inventoryInstanceGet, inventoryInstanceResponse, userContext.user])

  const { get: periodGet, response: periodResponse } = useFetch<
    APIResponse<IPeriod>
  >('/periods', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  useEffect(() => {
    const getPeriod = async () => {
      const periodData: APIResponse<IPeriod[]> = await periodGet()
      if (periodResponse.ok) {
        setPeriods(periodData.data)
      }
    }
    getPeriod()
  }, [periodGet, periodResponse, userContext.user])

  const {
    get: commentGet,
    post: commentPost,
    put: commentPut,
    del: commentDel,
    response: commentResponse,
    //loading: commentLoad,
  } = useFetch<APIResponse<INotification>>('/comments', (options) => {
    options.cachePolicy = CachePolicies.NO_CACHE
    return options
  })

  const getComments = async () => {
    const commentData: APIResponse<IComment[]> = await commentGet()
    if (commentResponse.ok) {
      setComments(commentData.data)
    }
  }

  const postComment = async (content: string): Promise<void> => {
    const form = {
      company: notReviewedState.filter(
        (notification) =>
          notification.notificationNumber === selectedNotificationNumber
      )[0].company,
      author: userContext.user?.username,
      content: content,
      notificationNumber: selectedNotificationNumber,
    }
    await commentPost(form)
    if (commentResponse.ok) {
      getComments()
    }
  }

  useEffect(() => {
    getComments()
  }, [commentGet, commentResponse, userContext.user])

  const deleteComment = async (comment: string) => {
    await commentDel(comment)
    if (commentResponse.ok) {
      getComments()
    }
  }

  const approveEdit = async (notification: string) => {
    await notificationPut(notification, { status: 'approved' })
    if (notificationResponse.ok) {
      await getNotReviewed()
      await getApproved()
      await getNotApproved()
      await getPublished()
    }
  }

  const disApproveEdit = async (notification: string) => {
    await notificationPut(notification, { status: 'not approved' })
    if (notificationResponse.ok) {
      await getNotReviewed()
      await getApproved()
      await getNotApproved()
      await getPublished()
    }
  }

  const approvedNotificationExists = () => {
    return approvedState.length > 0
  }

  useEffect(() => {
    setViewComment(false)
  }, [close])

  const calculateAggregatedOperationTime = (
    facility: string,
    equipmentGroup: string
  ) => {
    const relevantInventory = inventory.filter((inventoryInstance) =>
      getRelevantTags(facility, equipmentGroup).includes(inventoryInstance.tag)
    )

    const relevantPeriods = periods.filter((period) =>
      relevantInventory
        .map((inventoryInstance) => inventoryInstance.tag)
        .includes(period.tag)
    )

    const time = 36e5 * 10e6
    const startDates = relevantPeriods
      .map((period) => new Date(period.startDate).getTime())
      .reduce((a, b) => a + b, 0)

    const endDates = relevantPeriods
      .map((period) => new Date(period.endDate).getTime())
      .reduce((a, b) => a + b, 0)
    return (endDates - startDates) / time
  }

  const getRelevantTags = (facility: string, equipmentGroup: string) => {
    const relevantTags = inventory
      .filter(
        (inventoryInstance) =>
          inventoryInstance.facility === facility &&
          inventoryInstance.equipmentGroupL2 === equipmentGroup
      )
      .map((inventoryInstance) => inventoryInstance.tag)
      .filter((v, i, a) => a.indexOf(v) === i)
    return relevantTags
  }

  const getNumberOfDU = (
    facility: string,
    equipmentGroup: string,
    data: INotification[]
  ) => {
    const relevantNotifications = data.filter((notification) =>
      getRelevantTags(facility, equipmentGroup).includes(notification.tag)
    )
    return relevantNotifications.length
  }

  const getPopulationSize = (facility: string, equipmentGroup: string) => {
    return getRelevantTags(facility, equipmentGroup).filter(
      (v, i, a) => a.indexOf(v) === i
    ).length
  }

  const getStartDate = (
    facility: string,
    equipmentGroup: string,
    data: INotification[]
  ) => {
    return new Date(
      Math.min(
        ...data
          .filter((notification) =>
            getRelevantTags(facility, equipmentGroup).includes(notification.tag)
          )
          .map(
            (notification) => new Date(notification.detectionDate).getTime() - 1
          )
      )
    )
  }

  const getEndDate = (
    facility: string,
    equipmentGroup: string,
    data: INotification[]
  ) => {
    return new Date(
      Math.max(
        ...data
          .filter((notification) =>
            getRelevantTags(facility, equipmentGroup).includes(notification.tag)
          )
          .map(
            (notification) => new Date(notification.detectionDate).getTime() + 1
          )
      )
    )
  }

  const splitByFacility = (eqGroup: string, data: INotification[]) => {
    const facilities = inventory
      .filter(
        (inventoryInstance) => inventoryInstance.equipmentGroupL2 === eqGroup
      )
      .map((inventoryInstance) => inventoryInstance.facility)
      .filter((v, i, a) => a.indexOf(v) === i)
    const newDataInstances: Form[] = []
    facilities.map((facility) => {
      const newDataInstance = {
        status: 'published',
        company: 'test',
        facility: facility,
        component: eqGroup,
        startDate: getStartDate(facility, eqGroup, data),
        endDate: getEndDate(facility, eqGroup, data),
        T:
          Math.round(
            (calculateAggregatedOperationTime(facility, eqGroup) +
              Number.EPSILON) *
              1000
          ) / 1000,
        du: getNumberOfDU(facility, eqGroup, data),
        populationSize: getPopulationSize(facility, eqGroup),
        failureRate:
          Math.round(
            (getNumberOfDU(facility, eqGroup, data) /
              (Math.round(
                (calculateAggregatedOperationTime(facility, eqGroup) +
                  Number.EPSILON) *
                  1000
              ) /
                1000) +
              Number.EPSILON) *
              100
          ) / 100,
      }
      newDataInstances.push(newDataInstance)
    })
    return newDataInstances
  }

  const generateDataInstances = (data: INotification[]) => {
    const newDataInstances: Form[] = []
    const equipmentGroups = data
      .map((notification) => notification.equipmentGroupL2)
      .filter((v, i, a) => a.indexOf(v) === i)
    equipmentGroups.forEach((equipmentGroup) =>
      newDataInstances.push(...splitByFacility(equipmentGroup, data))
    )
    return newDataInstances
  }

  const {
    get: dataInstanceGet,
    post: dataInstancePost,
    put: dataInstancePut,
    response: dataInstanceResponse,
    //loading: dataInstanceLoad,
  } = useFetch<APIResponse<IDataInstance[]>>(
    '/data-instances',
    (options) => {
      options.cachePolicy = CachePolicies.NO_CACHE
      return options
    },
    []
  )

  useEffect(() => {
    const getDataInstances = async () => {
      const dataInstanceData: APIResponse<
        IDataInstance[]
      > = await dataInstanceGet()
      if (dataInstanceResponse.ok) {
        setDataInstances(dataInstanceData.data ?? [])
        setExternal(
          dataInstanceData.data.filter(
            (dataInstance) => dataInstance.status === 'new'
          )
        )
      }
    }
    getDataInstances()
  }, [inventoryInstanceGet, inventoryInstanceResponse, userContext.user])

  const unpublishDataInstance = async (dataInstance: string) => {
    await dataInstancePut(dataInstance, { status: 'unpublished' })
    if (notificationResponse.ok) {
      await getNotReviewed()
      await getApproved()
      await getNotApproved()
      await getPublished()
    }
  }

  const publishDataInstance = async (dataInstance: string) => {
    await dataInstancePut(dataInstance, { status: 'published' })
    if (notificationResponse.ok) {
      await getNotReviewed()
      await getApproved()
      await getNotApproved()
      await getPublished()
    }
  }

  const publishNotifications = async (dataInstance: Form) => {
    dataInstances
      .filter((dataInstance) => dataInstance.status !== 'new')
      .forEach((dataInstance) => unpublishDataInstance(dataInstance._id))
    dataInstances
      .filter((dataInstance) => dataInstance.status === 'new')
      .forEach((dataInstance) => publishDataInstance(dataInstance._id))
    const publish = { status: 'published' }
    approvedState
      .filter((notification) =>
        getRelevantTags(
          dataInstance.facility as string,
          dataInstance.component as string
        ).includes(notification.tag)
      )
      .forEach(async (edit) => {
        await notificationPut('/' + edit._id, publish)
      })
    await getNotReviewed()
    await getApproved()
    await getNotApproved()
    await getPublished()
  }

  const postDataInstance = async (dataInstance: Form): Promise<void> => {
    await dataInstancePost(dataInstance)
    if (dataInstanceResponse.ok) {
      publishNotifications(dataInstance)
      await getNotReviewed()
      await getApproved()
      await getNotApproved()
    }
  }

  const validDataInstance = (dataInstance: Form) => {
    return (
      dataInstance.component &&
      dataInstance.du &&
      dataInstance.facility &&
      dataInstance.populationSize &&
      dataInstance.startDate &&
      dataInstance.endDate
    )
  }

  const publishDataInstances = () => {
    const newReleaseData = [...approvedState, ...publishedState]
    generateDataInstances(newReleaseData).map((dataInstance) =>
      validDataInstance(dataInstance) ? postDataInstance(dataInstance) : null
    )
  }

  const requestToData = (request: Form[]) => {
    return (request ?? []).map((data) => [
      data.facility,
      data.du?.toString(),
      data.T?.toString(),
      new Date(data.startDate as Date).toLocaleDateString(),
      new Date(data.endDate as Date).toLocaleDateString(),
      data.populationSize?.toString(),
      data.failureRate?.toString(),
    ])
  }

  return notificationLoad ? (
    <div className={styles.loading}>
      <Loader type="Grid" color="grey" />
    </div>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <div
            className={styles[clickState.notReviewed]}
            onClick={() => {
              setPage('Not Reviewed')
              setClick({
                notReviewed: 'clicked',
                approved: 'notClicked',
                notApproved: 'notClicked',
                publish: 'notClicked',
                active: 'notClicked',
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
                publish: 'notClicked',
                active: 'notClicked',
              })
            }}
          >
            {'Approved'}
          </div>
          <div
            className={styles[clickState.publish]}
            onClick={() => {
              setPage('Publish')
              setClick({
                notReviewed: 'notClicked',
                approved: 'notClicked',
                notApproved: 'notClicked',
                publish: 'clicked',
                active: 'notClicked',
              })
            }}
          >
            {'Publish'}
          </div>
          <div
            className={styles[clickState.notApproved]}
            onClick={() => {
              setPage('Active')
              setClick({
                notReviewed: 'notClicked',
                approved: 'notClicked',
                notApproved: 'notClicked',
                publish: 'notClicked',
                active: 'clicked',
              })
            }}
          >
            {'Active'}
          </div>
          <div
            className={styles[clickState.active]}
            onClick={() => {
              setPage('Not Approved')
              setClick({
                notReviewed: 'notClicked',
                approved: 'notClicked',
                notApproved: 'clicked',
                publish: 'notClicked',
                active: 'notClicked',
              })
            }}
          >
            {'Not Approved'}
          </div>
        </div>
      </div>
      <hr />
      {pageState === 'Not Reviewed' && (
        <>
          {notReviewedState.length > 0 && (
            <div className={styles.table}>
              <div>
                <table className={styles.headers}>
                  <tbody>
                    <tr>
                      <td>{'Notification number'}</td>
                      <td>{'Date'}</td>
                      <td>{'Equipment group L2'}</td>
                      <td>{'Tag'}</td>
                      <td>{'Short text (click for longer text)'}</td>
                      <td> {'Detection method'}</td>
                      <td> {'F1'}</td>
                      <td> {'F2'}</td>
                      <td> {'Failure type'}</td>
                      <td>{'QA?'}</td>
                      <td></td>
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
                    <label className={styles.notifications} key={idx}>
                      {edit.notificationNumber}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {new Date(
                        edit.detectionDate as Date
                      ).toLocaleDateString()}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.equipmentGroupL2}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.tag}
                    </label>
                    <label
                      onClick={() => {
                        setOpen(!open)
                        setSelectedNotificationNumber(edit.notificationNumber)
                      }}
                      className={styles.clickable}
                    >
                      {edit.shortText}
                      {edit.notificationNumber ===
                        selectedNotificationNumber && (
                        <ViewLongText
                          title="Long text"
                          text={
                            notReviewedState.filter(
                              (notification) =>
                                notification.notificationNumber ===
                                selectedNotificationNumber
                            )[0].longText ?? ''
                          }
                          isOpen={open}
                        />
                      )}
                    </label>
                    <label className={styles.notifications}>
                      {edit.detectionMethod}
                    </label>
                    <label className={styles.notifications}>{edit.F1}</label>
                    <label className={styles.notifications}>{edit.F2}</label>
                    <label className={styles.notifications}>
                      {edit.failureType}
                    </label>
                    {edit.qualityStatus ? (
                      <i className={'material-icons ' + styles.checkedicon}>
                        {'check'}
                      </i>
                    ) : (
                      <i className={'material-icons ' + styles.notcheckedicon}>
                        {'clear'}
                      </i>
                    )}
                    <i
                      className={'material-icons ' + styles.icon}
                      onClick={() => {
                        setSelectedNotificationNumber(edit.notificationNumber)
                        setViewComment(true)
                      }}
                    >
                      {'comment'}
                      {edit.notificationNumber ===
                        selectedNotificationNumber && (
                        <CommentSection isOpen={viewComment}>
                          <i
                            className={'material-icons ' + styles.close}
                            onClick={() => setClose(!close)}
                          >
                            {'clear'}
                          </i>
                          <Title
                            title={'comments on: '}
                            dynamic={selectedNotificationNumber}
                          />
                          <div className={styles.commentsContainer}>
                            {comments
                              .filter(
                                (comment) =>
                                  comment.notificationNumber ===
                                  selectedNotificationNumber
                              )
                              .map((content, key) => (
                                <div
                                  key={key}
                                  className={styles.commentContent}
                                >
                                  {content.created && (
                                    <div className={styles.date}>
                                      {content.author +
                                        ': ' +
                                        new Date(
                                          content.created
                                        ).toDateString()}
                                      <div
                                        className={
                                          'material-icons ' + styles.smallIcon
                                        }
                                        onClick={() =>
                                          deleteComment(content._id)
                                        }
                                      >
                                        {'delete'}
                                      </div>
                                    </div>
                                  )}
                                  <div className={styles.comment} key={key}>
                                    <EditableField
                                      type={'comment'}
                                      content={content.content}
                                      isAdmin={true}
                                      onSubmit={(value) => {
                                        commentPut(content._id, {
                                          content: value.content,
                                        })
                                        setComments(
                                          comments.filter((comment) =>
                                            comment._id === content._id
                                              ? {
                                                  ...comment,
                                                  content: value.content,
                                                }
                                              : comment
                                          )
                                        )
                                      }}
                                    ></EditableField>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className={styles.writeComment}>
                            <InputField
                              variant="standard"
                              label="New"
                              type="text"
                              value={newComment ?? ''}
                              onValueChanged={(value) =>
                                setNewComment(value as string)
                              }
                            />
                            <i
                              className={'material-icons ' + styles.icon}
                              onClick={() => {
                                if (newComment !== '') {
                                  postComment(newComment)
                                }
                                setNewComment('')
                              }}
                            >
                              {'send'}
                            </i>
                          </div>
                        </CommentSection>
                      )}
                    </i>
                    <div
                      className={styles.approve}
                      onClick={() => {
                        approveEdit(edit._id)
                      }}
                      key={idx}
                    >
                      {'Approve'}
                    </div>
                    <div
                      className={styles.remove}
                      onClick={() => {
                        disApproveEdit(edit._id)
                      }}
                      key={idx}
                    >
                      {'Disapprove'}
                    </div>
                  </RegisteredDataField>
                ) ?? []
            )}
        </>
      )}
      {pageState === 'Approved' &&
        (approvedNotificationExists() ? (
          <div>
            <div className={styles.datainstanceContainer}>
              <div className={styles.table}>
                <div>
                  <table className={styles.headers}>
                    <tbody>
                      <tr>
                        <td>{'Facility'}</td>
                        <td>{'Equipment group L2'}</td>
                        <td>{'Number of du'}</td>
                        <td>{'T'}</td>
                        <td> {'Start year'}</td>
                        <td> {'End year'}</td>
                        <td> {'Population size'}</td>
                        <td> {'Failure rate'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {approvedState &&
                generateDataInstances(approvedState).map((data, key) => (
                  <RegisteredDataField key={key}>
                    <label className={styles.notifications} key={key}>
                      {data.facility}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {data.component}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {data.du}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {data.T + ' · 10^6'}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {new Date(data.startDate).getFullYear()}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {new Date(data.endDate).getFullYear()}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {data.populationSize}
                    </label>
                    <label className={styles.notifications} key={key}>
                      {data.failureRate}
                    </label>
                  </RegisteredDataField>
                ))}
            </div>
            <div className={styles.info}>
              The data ready for publish (above) is based on the notifications
              below:
            </div>
            <div className={styles.table}>
              <div>
                <table className={styles.headers}>
                  <tbody>
                    <tr>
                      <td>{'Notification number'}</td>
                      <td>{'Date'}</td>
                      <td>{'Equipment group L2'}</td>
                      <td>{'Tag'}</td>
                      <td>{'Short text'}</td>
                      <td> {'Detection method'}</td>
                      <td> {'F1'}</td>
                      <td> {'F2'}</td>
                      <td> {'Failure type'}</td>
                      <td>{'QA?'}</td>
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
                      <label className={styles.notifications} key={idx}>
                        {edit.notificationNumber}
                      </label>
                      <label className={styles.notifications} key={idx}>
                        {new Date(
                          edit.detectionDate as Date
                        ).toLocaleDateString()}
                      </label>
                      <label className={styles.notifications} key={idx}>
                        {edit.equipmentGroupL2}
                      </label>
                      <label className={styles.notifications} key={idx}>
                        {edit.tag}
                      </label>
                      <label className={styles.notifications}>
                        {edit.shortText}
                      </label>
                      <label className={styles.notifications}>
                        {edit.detectionMethod}
                      </label>
                      <label className={styles.notifications}>{edit.F1}</label>
                      <label className={styles.notifications}>{edit.F2}</label>
                      <label className={styles.notifications}>
                        {edit.failureType}
                      </label>
                      {edit.qualityStatus ? (
                        <i className={'material-icons ' + styles.checkedicon}>
                          {'check'}
                        </i>
                      ) : (
                        <i
                          className={'material-icons ' + styles.notcheckedicon}
                        >
                          {'clear'}
                        </i>
                      )}

                      <div key={idx}>{}</div>
                      <div
                        className={styles.remove}
                        onClick={() => {
                          disApproveEdit(edit._id)
                        }}
                        key={idx}
                      >
                        {'Disapprove'}
                      </div>
                    </RegisteredDataField>
                  ) ?? []
              )}
          </div>
        ) : (
          <div className={styles.centerInfo}>
            {'There are no approved edits at the moment...'}
          </div>
        ))}
      {pageState === 'Publish' && (
        <div>
          <div className={styles.buttonContainer}>
            <Button
              size="small"
              label={'Add data manually'}
              onClick={() => history.push(MAIN_ROUTES.ADD)}
            ></Button>
            <Button
              size="small"
              label={'Publish'}
              onClick={() => publishDataInstances()}
            ></Button>
          </div>
          {[...approvedState, ...publishedState]
            .map((notification) => notification.equipmentGroupL2)
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((eqGroup, key) => (
              <div key={key} className={styles.dataTable}>
                <Title title={eqGroup} />
                <Table
                  headers={headers}
                  data={requestToData([
                    ...splitByFacility(eqGroup, [
                      ...approvedState,
                      ...publishedState,
                    ]),
                    ...external
                      .filter(
                        (dataInstance) => dataInstance.component === eqGroup
                      )
                      .map((dataInstance) => dataInstance as Form),
                  ])}
                  onValueChanged={() => false}
                />
              </div>
            ))}
        </div>
      )}
      {pageState === 'Active' && (
        <div className={styles.activeContainer}>
          <div className={styles.info}>
            Notifications already in the handbook. Click disapprove to exclude a
            notification from the next release
          </div>
          <div className={styles.table}>
            <div>
              <table className={styles.headers}>
                <tbody>
                  <tr>
                    <td>{'Notification number'}</td>
                    <td>{'Date'}</td>
                    <td>{'Equipment group L2'}</td>
                    <td>{'Tag'}</td>
                    <td>{'Short text'}</td>
                    <td> {'Detection method'}</td>
                    <td> {'F1'}</td>
                    <td> {'F2'}</td>
                    <td> {'Failure type'}</td>
                    <td>{'QA?'}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {publishedState &&
            publishedState?.map(
              (
                edit,
                idx // type any?
              ) =>
                (
                  <RegisteredDataField key={idx}>
                    <label className={styles.notifications} key={idx}>
                      {edit.notificationNumber}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {new Date(
                        edit.detectionDate as Date
                      ).toLocaleDateString()}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.equipmentGroupL2}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.tag}
                    </label>
                    <label className={styles.notifications}>
                      {edit.shortText}
                    </label>
                    <label className={styles.notifications}>
                      {edit.detectionMethod}
                    </label>
                    <label className={styles.notifications}>{edit.F1}</label>
                    <label className={styles.notifications}>{edit.F2}</label>
                    <label className={styles.notifications}>
                      {edit.failureType}
                    </label>
                    {edit.qualityStatus ? (
                      <i className={'material-icons ' + styles.checkedicon}>
                        {'check'}
                      </i>
                    ) : (
                      <i className={'material-icons ' + styles.notcheckedicon}>
                        {'clear'}
                      </i>
                    )}

                    <div key={idx}>{}</div>
                    <div
                      className={styles.remove}
                      onClick={() => {
                        disApproveEdit(edit._id)
                      }}
                      key={idx}
                    >
                      {'Disapprove'}
                    </div>
                  </RegisteredDataField>
                ) ?? []
            )}
        </div>
      )}
      {pageState === 'Not Approved' && (
        <>
          {notApprovedState.length > 0 ? (
            <div className={styles.table}>
              <div>
                <table className={styles.headers}>
                  <tbody>
                    <tr>
                      <td>{'Notification number'}</td>
                      <td>{'Date'}</td>
                      <td>{'Equipment group L2'}</td>
                      <td>{'Tag'}</td>
                      <td>{'Short text'}</td>
                      <td> {'Detection method'}</td>
                      <td> {'F1'}</td>
                      <td> {'F2'}</td>
                      <td> {'Failure type'}</td>
                      <td>{'QA?'}</td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className={styles.centerInfo}>
              {'There are no disapproved edits at the moment...'}
            </div>
          )}
          {notApprovedState &&
            notApprovedState?.map(
              (
                edit,
                idx // type any?
              ) =>
                (
                  <RegisteredDataField key={idx}>
                    <label className={styles.notifications} key={idx}>
                      {edit.notificationNumber}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {new Date(
                        edit.detectionDate as Date
                      ).toLocaleDateString()}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.equipmentGroupL2}
                    </label>
                    <label className={styles.notifications} key={idx}>
                      {edit.tag}
                    </label>
                    <label className={styles.notifications}>
                      {edit.shortText}
                    </label>
                    <label className={styles.notifications}>
                      {edit.detectionMethod}
                    </label>
                    <label className={styles.notifications}>{edit.F1}</label>
                    <label className={styles.notifications}>{edit.F2}</label>
                    <label className={styles.notifications}>
                      {edit.failureType}
                    </label>
                    {edit.qualityStatus ? (
                      <i className={'material-icons ' + styles.checkedicon}>
                        {'check'}
                      </i>
                    ) : (
                      <i className={'material-icons ' + styles.notcheckedicon}>
                        {'clear'}
                      </i>
                    )}

                    <div
                      className={styles.approve}
                      onClick={() => {
                        approveEdit(edit._id)
                      }}
                      key={idx}
                    >
                      {'Approve'}
                    </div>
                    <div key={idx}>{}</div>
                  </RegisteredDataField>
                ) ?? []
            )}
        </>
      )}
    </div>
  )
}
